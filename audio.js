// js/audio.js
// Web Audio pipeline: AudioContext, gain node, buffering, fallback microphone,
// and test-tone playback. This file is intentionally verbose with comments so
// it doubles as an 11th std portfolio piece.

import { debounce, log, sleep } from './utils.js';

const SAMPLE_RATE = 48000; // 48 kHz target
const BUFFER_SIZE = 1024;  // 21.33 ms at 48 kHz

let audioContext = null;
let gainNode = null;
let scriptNode = null;
let currentSource = null;
let micStream = null;
let mode = 'idle'; // 'ble', 'mic', 'test'

let bleBufferQueue = [];
let bufferProgressCb = null;
let onPlaybackErrorCb = null;
let volume = 0.8;
let muted = false;

/**
 * Initialize the shared AudioContext, gain node, and script processor node.
 * This function builds a tiny streaming pipeline:
 * - 48 kHz AudioContext
 * - GainNode for volume control
 * - ScriptProcessorNode used as a simple pull-based consumer for sample data
 *   we feed via a queue (bleBufferQueue).
 */
export async function initAudio({ onBufferProgress, onPlaybackError }) {
  if (audioContext) return audioContext;

  audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: SAMPLE_RATE
  });

  gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  scriptNode = audioContext.createScriptProcessor(BUFFER_SIZE, 0, 2);
  bufferProgressCb = onBufferProgress || null;
  onPlaybackErrorCb = onPlaybackError || null;

  scriptNode.onaudioprocess = (event) => {
    // Each onaudioprocess callback requests BUFFER_SIZE samples per channel.
    // We want gapless playback: if we don't have enough data, we fill with zeros.
    try {
      const outputL = event.outputBuffer.getChannelData(0);
      const outputR = event.outputBuffer.getChannelData(1);

      if (mode === 'ble' && bleBufferQueue.length > 0) {
        const frame = bleBufferQueue.shift();
        // frame is expected Float32Array interleaved stereo or mono
        for (let i = 0; i < BUFFER_SIZE; i++) {
          const idx = i * 2;
          outputL[i] = frame[idx] ?? 0;
          outputR[i] = frame[idx + 1] ?? frame[idx] ?? 0;
        }
      } else {
        // Fallback: silence to avoid clicks.
        for (let i = 0; i < BUFFER_SIZE; i++) {
          outputL[i] = 0;
          outputR[i] = 0;
        }
      }

      if (bufferProgressCb) {
        const filled = Math.min(bleBufferQueue.length / 8, 1) * 100;
        bufferProgressCb(filled);
      }
    } catch (err) {
      log('Audio process error', err);
      if (onPlaybackErrorCb) onPlaybackErrorCb(err);
    }
  };

  scriptNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return audioContext;
}

/**
 * Push PCM frames from Bluetooth or other sources into the internal queue.
 * In a real BLE audio implementation, you would convert 16-bit PCM from
 * Uint8Array to Float32Array here. For demo, we accept a Float32Array.
 */
export function enqueueBleFrame(float32StereoFrame) {
  if (!Array.isArray(bleBufferQueue)) bleBufferQueue = [];
  bleBufferQueue.push(float32StereoFrame);
}

/**
 * Start BLE streaming mode. Assumes an external module will feed PCM frames
 * via enqueueBleFrame. This function is purely about configuring mode and
 * ensuring the AudioContext is running.
 */
export async function startBleStream() {
  await ensureRunning();
  mode = 'ble';
}

/**
 * Start microphone fallback using getUserMedia. If Web Bluetooth fails or
 * the TV cannot provide a compatible BLE audio stream, we at least show
 * AudioContext + mic streaming.
 */
export async function startMicFallback() {
  try {
    await ensureRunning();
    mode = 'mic';

    // Stop existing mic track if any
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }

    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      },
      video: false
    });

    const micSource = audioContext.createMediaStreamSource(micStream);
    micSource.connect(gainNode);
    currentSource = micSource;
  } catch (err) {
    if (onPlaybackErrorCb) onPlaybackErrorCb(err);
  }
}

/**
 * Play bundled test tone file as a demo audio source. This is useful when you
 * want to confirm Web Audio + UI are working even without any Bluetooth device.
 */
export async function playTestTone() {
  await ensureRunning();
  mode = 'test';

  if (currentSource) {
    try {
      currentSource.stop?.();
    } catch (e) {
      // ignore
    }
    currentSource.disconnect?.();
    currentSource = null;
  }

  try {
    const response = await fetch('./audio/test-tone.mp3');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(gainNode);
    source.start(0);
    currentSource = source;
  } catch (err) {
    if (onPlaybackErrorCb) onPlaybackErrorCb(err);
  }
}

/**
 * Ensure AudioContext is created and resumed (user gesture required
 * in most browsers before audio can play).
 */
export async function ensureRunning() {
  if (!audioContext) {
    await initAudio({});
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

/**
 * Set master volume from 0–100. Internally mapped 0–1 gain value.
 * Includes a tiny debounce so rapid slider changes do not cause
 * unnecessary work.
 */
const setGainDebounced = debounce((gainValue) => {
  if (gainNode) {
    gainNode.gain.value = muted ? 0 : gainValue;
  }
}, 40);

export function setVolume(percent) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  volume = clamped / 100;
  setGainDebounced(volume);
}

/**
 * Toggle mute state without losing the original volume setting.
 */
export function toggleMute() {
  muted = !muted;
  setGainDebounced(volume);
  return muted;
}

/**
 * Stop all audio, release mic, and reset mode back to idle.
 */
export async function stopAllAudio() {
  mode = 'idle';
  bleBufferQueue = [];

  if (currentSource) {
    try {
      currentSource.stop?.();
    } catch (e) {
      // ignore
    }
    currentSource.disconnect?.();
    currentSource = null;
  }

  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
  }

  if (audioContext && audioContext.state !== 'closed') {
    // Small delay so we do not rapidly recreate context on mobile
    await sleep(150);
    await audioContext.suspend();
  }
}

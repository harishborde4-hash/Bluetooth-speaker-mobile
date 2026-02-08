// js/app.js
// Main controller: coordinates UI, Bluetooth, and audio modules.
// Uses async/await with robust error handling and fallbacks.

import { initUi, bindHandlers, setConnectionStatus, setAudioStatus, setSignalStrength, setBufferProgress, showError } from './ui.js';
import { initBluetooth, requestTvDevice, connectToTv, disconnectTv } from './bluetooth.js';
import { initAudio, setVolume, toggleMute, startMicFallback, playTestTone, stopAllAudio } from './audio.js';
import { log } from './utils.js';

let currentModeLabel = 'Auto (BT → Mic)';
let audioActive = false;

/**
 * initApp wires up everything:
 * - initializes UI components
 * - configures Bluetooth callbacks
 * - registers event handlers for buttons
 * - registers service worker for PWA
 */
export function initApp() {
  window.__TV_SOUND_DEBUG__ = false;

  initUi();
  initBluetooth({
    onConnectionChange: handleConnectionChange,
    onRssiChange: (value) => setSignalStrength(value),
    onError: (err) => handleFatalError(err)
  });

  bindHandlers({
    onFindTv: handleFindTv,
    onHearOnPhone: handleHearOnPhone,
    onToggleMute: () => toggleMute(),
    onVolumeChange: (v) => setVolume(v)
  });

  initAudio({
    onBufferProgress: (value) => setBufferProgress(value),
    onPlaybackError: (err) => handlePlaybackError(err)
  });

  registerServiceWorker();
}

/**
 * Button handler: user taps "FIND MY TV".
 * We invoke Web Bluetooth device picker; user must choose a TV device.
 */
async function handleFindTv() {
  try {
    const device = await requestTvDevice();
    setConnectionStatus({ status: 'selected', name: device.name || 'TV' });
  } catch (err) {
    if (err?.name === 'NotFoundError') {
      showError('No TVs found. Make sure your TV Bluetooth is ON and discoverable.');
    } else if (err?.name === 'NotAllowedError') {
      showError('Bluetooth permission denied. Please allow Bluetooth access and try again.');
    } else {
      showError(`Bluetooth error: ${err.message}`);
    }
    log('BT request error', err);
  }
}

/**
 * Button handler: user taps "HEAR ON PHONE".
 * We try this priority order:
 * 1) If a selected TV exists, attempt to connect and stream via BLE demo.
 * 2) If connection fails, fall back to microphone capture.
 * 3) Optionally, user may trigger test tone via a long press or via dev flag.
 */
async function handleHearOnPhone() {
  try {
    if (!audioActive) {
      // Try connecting to TV first (BLE demo path)
      try {
        await connectToTv();
        currentModeLabel = 'BLE demo (GATT packets)';
        setAudioStatus(true, currentModeLabel);
        audioActive = true;
        return;
      } catch (btErr) {
        log('BLE path failed, switching to mic', btErr);
        await startMicFallback();
        currentModeLabel = 'Mic fallback';
        setAudioStatus(true, currentModeLabel);
        audioActive = true;
      }
    } else {
      // Stop audio if already active
      await disconnectTv();
      await stopAllAudio();
      audioActive = false;
      currentModeLabel = 'Auto (BT → Mic)';
      setAudioStatus(false, currentModeLabel);
    }
  } catch (err) {
    handleFatalError(err);
  }
}

/**
 * Handle Bluetooth connection state changes from bluetooth.js and map them
 * to user-friendly UI labels and statuses.
 */
function handleConnectionChange(payload) {
  setConnectionStatus(payload);
}

/**
 * Playback-related errors from the audio pipeline:
 * if BLE streaming fails, automatically flip to mic fallback.
 */
async function handlePlaybackError(err) {
  log('Playback error', err);
  try {
    await startMicFallback();
    currentModeLabel = 'Mic fallback (auto)';
    setAudioStatus(true, currentModeLabel);
  } catch (inner) {
    handleFatalError(inner);
  }
}

/**
 * Catastrophic error: surface to the user and reset internal state.
 */
function handleFatalError(err) {
  log('Fatal error', err);
  showError(err.message || 'Unknown error');
}

/**
 * Setup service worker registration for offline caching and PWA behavior.
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        log('Service worker registration failed', err);
      });
    });
  }
}

// Optional: secret test-tone mode if you call this from dev tools.
window.__playTestTone = async () => {
  await playTestTone();
  audioActive = true;
  currentModeLabel = 'Local test tone';
  setAudioStatus(true, currentModeLabel);
};

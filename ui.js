// js/ui.js
// All DOM wiring, ARIA states, visual feedback, and simple battery indicator.

import { debounce } from './utils.js';

/**
 * UI module keeps references to buttons and status elements and exposes
 * small functions that the main app controller can call when Bluetooth or
 * audio state changes.
 */

let els = {};

export function initUi() {
  els.btnFindTv = document.getElementById('btn-find-tv');
  els.btnHearOnPhone = document.getElementById('btn-hear-on-phone');
  els.btnMute = document.getElementById('btn-mute');
  els.volumeSlider = document.getElementById('volume-slider');
  els.volumeValue = document.getElementById('volume-value');
  els.connectionStatus = document.getElementById('connection-status');
  els.audioStatus = document.getElementById('audio-status');
  els.signalStrength = document.getElementById('signal-strength');
  els.bufferProgress = document.getElementById('buffer-progress');
  els.batteryIndicator = document.getElementById('battery-indicator');
  els.modeIndicator = document.getElementById('mode-indicator');
  els.httpsWarning = document.getElementById('https-warning');
  els.browserWarning = document.getElementById('browser-warning');

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    els.httpsWarning.hidden = false;
  }

  if (!navigator.bluetooth) {
    els.browserWarning.hidden = false;
  }

  // Battery API is not available everywhere, so we use a simple fallback.
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      const updateBattery = () => {
        const pct = Math.round(battery.level * 100);
        els.batteryIndicator.textContent = `${pct}%`;
      };
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
    });
  } else {
    els.batteryIndicator.textContent = 'N/A';
  }
}

export function bindHandlers({ onFindTv, onHearOnPhone, onToggleMute, onVolumeChange }) {
  els.btnFindTv.addEventListener('click', () => onFindTv());
  els.btnHearOnPhone.addEventListener('click', () => onHearOnPhone());
  els.btnMute.addEventListener('click', () => {
    const muted = onToggleMute();
    els.btnMute.textContent = muted ? '🔊 UNMUTE' : '🔇 MUTE';
  });

  const debouncedVolume = debounce((value) => onVolumeChange(value), 30);
  els.volumeSlider.addEventListener('input', (e) => {
    const v = Number(e.target.value);
    els.volumeValue.textContent = `${v}%`;
    debouncedVolume(v);
  });

  // Keyboard accessibility: space/enter simulate click for buttons if not native.
  [els.btnFindTv, els.btnHearOnPhone, els.btnMute].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

export function setConnectionStatus(state) {
  const { status, name, attempt } = state;
  els.connectionStatus.classList.remove('status-disconnected', 'status-connecting', 'status-connected');
  let text = 'Disconnected';

  if (status === 'selected') {
    text = `Selected: ${name}`;
    els.btnHearOnPhone.disabled = false;
    els.btnHearOnPhone.classList.remove('disabled');
  } else if (status === 'connecting') {
    text = 'Connecting…';
    els.connectionStatus.classList.add('status-connecting');
  } else if (status === 'connected') {
    text = `Connected: ${name}`;
    els.connectionStatus.classList.add('status-connected');
  } else if (status === 'reconnecting') {
    text = `Reconnecting (${attempt})…`;
    els.connectionStatus.classList.add('status-connecting');
  } else if (status === 'disconnected') {
    text = 'Disconnected';
    els.btnHearOnPhone.disabled = true;
    els.btnHearOnPhone.classList.add('disabled');
    els.connectionStatus.classList.add('status-disconnected');
  }

  els.connectionStatus.textContent = text;
}

export function setAudioStatus(active, mode) {
  els.audioStatus.classList.remove('status-idle', 'status-active');
  if (active) {
    els.audioStatus.classList.add('status-active');
    els.audioStatus.textContent = 'Playing';
    els.btnHearOnPhone.textContent = '📱 PLAYING';
  } else {
    els.audioStatus.classList.add('status-idle');
    els.audioStatus.textContent = 'Idle';
    els.btnHearOnPhone.textContent = '🔊 2. HEAR ON PHONE';
  }

  if (mode) {
    els.modeIndicator.textContent = mode;
  }
}

export function setSignalStrength(value) {
  els.signalStrength.value = value;
}

export function setBufferProgress(value) {
  els.bufferProgress.value = value;
}

export function showError(message) {
  alert(message);
}

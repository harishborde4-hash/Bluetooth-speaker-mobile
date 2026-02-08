// js/bluetooth.js
// Web Bluetooth helper for scanning TVs via GATT filters, connecting,
// subscribing to a "fake" audio characteristic, and emitting demo PCM
// frames into the audio pipeline.
// NOTE: Real A2DP sink is not exposed to JS; browsers only support BLE GATT
// (control/data). This module shows the structure you would use if a TV
// exposed raw PCM samples via a GATT characteristic.

import { enqueueBleFrame, startBleStream } from './audio.js';
import { log, sleep } from './utils.js';

// Standard Generic Access service UUID (0x1800) used as sample filter.[web:9][web:12]
const GENERIC_ACCESS_UUID = '00001800-0000-1000-8000-00805f9b34fb';

const TV_FILTERS = [
  { services: [GENERIC_ACCESS_UUID] },
  { namePrefix: 'Samsung' },
  { namePrefix: 'LG TV' },
  { namePrefix: 'Sony' },
  { namePrefix: 'Android TV' }
];

// Internal state
let device = null;
let server = null;
let audioCharacteristic = null;
let onConnectionChangeCb = null;
let onRssiChangeCb = null;
let onErrorCb = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * Initialize the Bluetooth helper. We just stash callbacks so we can inform
 * the UI when connection state or RSSI changes, and when errors occur.
 */
export function initBluetooth({ onConnectionChange, onRssiChange, onError }) {
  onConnectionChangeCb = onConnectionChange || null;
  onRssiChangeCb = onRssiChange || null;
  onErrorCb = onError || null;
}

/**
 * Request a TV device from the browser using Web Bluetooth. This uses
 * filters targeting common TV names and the generic access service.
 * Returns the selected BluetoothDevice or throws if user cancels.
 */
export async function requestTvDevice() {
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth API not available in this browser.');
  }

  const options = {
    filters: TV_FILTERS,
    optionalServices: [GENERIC_ACCESS_UUID]
  };

  device = await navigator.bluetooth.requestDevice(options);
  device.addEventListener('gattserverdisconnected', handleDisconnected);

  if (onConnectionChangeCb) {
    onConnectionChangeCb({ status: 'selected', name: device.name || 'Unknown TV' });
  }

  return device;
}

/**
 * Connect to the selected TV device and attempt to discover a service and
 * characteristic that can be used as a "fake" audio stream. In practice,
 * we simply listen to notifications and treat the payload as PCM frames
 * for demonstration.
 */
export async function connectToTv() {
  if (!device) throw new Error('No TV device selected.');

  reconnectAttempts = 0;
  if (onConnectionChangeCb) {
    onConnectionChangeCb({ status: 'connecting', name: device.name });
  }

  server = await device.gatt.connect();
  if (onConnectionChangeCb) {
    onConnectionChangeCb({ status: 'connected', name: device.name });
  }

  // Discover primary services. Real TVs rarely expose user-friendly BLE
  // audio characteristics; this is purely conceptual for portfolio use.
  const service = await server.getPrimaryService(GENERIC_ACCESS_UUID);

  // In a real design, this UUID would belong to your custom firmware that
  // streams PCM chunks. Here we just grab the first characteristic.
  const characteristics = await service.getCharacteristics();
  audioCharacteristic = characteristics[0];

  await audioCharacteristic.startNotifications();
  audioCharacteristic.addEventListener('characteristicvaluechanged', handleAudioNotification);

  // Start the BLE audio pathway in audio.js
  await startBleStream();

  return { device, server };
}

/**
 * Handle incoming notification packets that we pretend represent PCM audio.
 * For demo: convert bytes to a small Float32Array and enqueue to the audio
 * pipeline. Real throughput over BLE is limited; full-quality 48 kHz stereo
 * PCM would not be realistic via GATT alone.[web:16]
 */
function handleAudioNotification(event) {
  const value = event.target.value;
  const len = value.byteLength;
  const floatFrame = new Float32Array((len / 2) * 2); // stereo interleaved

  for (let i = 0; i < len; i += 2) {
    const sample = value.getInt16(i, true) / 32768;
    const idx = (i / 2) * 2;
    floatFrame[idx] = sample;
    floatFrame[idx + 1] = sample;
  }

  enqueueBleFrame(floatFrame);

  // Fake "signal strength" from packet size.
  if (onRssiChangeCb) {
    const strength = Math.min(100, Math.max(5, (len / 20) * 10));
    onRssiChangeCb(Math.round(strength));
  }
}

/**
 * Auto-reconnect logic: when the device disconnects unexpectedly, try up to
 * 3 times with backoff. If all attempts fail, notify UI so it can switch
 * to fallback audio.
 */
async function handleDisconnected() {
  if (onConnectionChangeCb) {
    onConnectionChangeCb({ status: 'disconnected', name: device?.name });
  }

  if (!device || !device.gatt) return;

  while (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts += 1;
    try {
      if (onConnectionChangeCb) {
        onConnectionChangeCb({
          status: 'reconnecting',
          name: device.name,
          attempt: reconnectAttempts
        });
      }
      await sleep(1000 * reconnectAttempts);
      server = await device.gatt.connect();
      const service = await server.getPrimaryService(GENERIC_ACCESS_UUID);
      const characteristics = await service.getCharacteristics();
      audioCharacteristic = characteristics[0];
      await audioCharacteristic.startNotifications();
      audioCharacteristic.addEventListener('characteristicvaluechanged', handleAudioNotification);
      if (onConnectionChangeCb) {
        onConnectionChangeCb({ status: 'connected', name: device.name });
      }
      reconnectAttempts = 0;
      return;
    } catch (err) {
      log('Reconnect attempt failed', err);
    }
  }

  if (onErrorCb) {
    onErrorCb(new Error('Connection lost. Auto-reconnect failed.'));
  }
}

/**
 * Disconnect cleanly from the TV. This is called on page unload or when the
 * user explicitly wants to disconnect.
 */
export async function disconnectTv() {
  try {
    if (audioCharacteristic) {
      audioCharacteristic.removeEventListener('characteristicvaluechanged', handleAudioNotification);
    }
    if (device && device.gatt && device.gatt.connected) {
      await device.gatt.disconnect();
    }
  } catch (err) {
    if (onErrorCb) onErrorCb(err);
  } finally {
    device = null;
    server = null;
    audioCharacteristic = null;
    reconnectAttempts = 0;
    if (onConnectionChangeCb) {
      onConnectionChangeCb({ status: 'disconnected', name: null });
    }
  }
}

/**
 * Expose current device name for UI display.
 */
export function getCurrentDeviceName() {
  return device?.name || null;
}

# TV Sound to Phone

Turn your phone into a **demo private TV listener** using Web Bluetooth, Web Audio, and PWA.

> Important: Browsers only expose Bluetooth Low Energy GATT to JS, **not full A2DP sink audio**, so real TV audio over Bluetooth requires native OS support or a custom receiver device.[web:9][web:12][web:10][web:11]

## Features

- Web Bluetooth TV scanning with filters for Samsung / LG / Sony / Android TV name prefixes and Generic Access service.
- Auto-reconnect attempts (3x) with status updates.
- Web Audio pipeline (48 kHz, 1024-sample buffers, gain node, mute/volume).
- Fallback microphone streaming when BLE “audio” path fails.
- Bundled test tone loop for quick verification.
- Mobile-first UI with large buttons and color-coded statuses.
- Installable PWA with offline cache-first service worker.[web:14][web:17]

## File Structure

```text
tv-sound-to-phone/
├── index.html
├── css/style.css
├── js/app.js
├── js/bluetooth.js
├── js/audio.js
├── js/ui.js
├── js/utils.js
├── sw.js
├── manifest.json
├── icons/icon-192.png
├── icons/icon-512.png
├── audio/test-tone.mp3
└── README.md

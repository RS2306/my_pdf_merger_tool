# PDF Merger — PWA

This version adds:
- Web App Manifest
- Service Worker
- Offline app-shell caching
- Offline caching of pdf-lib CDN resource after first successful load
- Android install support
- iOS Add to Home Screen support
- Windows/Edge PWA installation support
- Android/iOS/desktop icons

## GitHub Pages

Put all files/folders in the same GitHub Pages repository:

index.html
script.js
styles.css
manifest.webmanifest
service-worker.js
icons/

Then enable:
Settings -> Pages -> Deploy from a branch -> main -> / (root)

Open the HTTPS GitHub Pages URL. The service worker and PWA features require HTTPS
(except localhost during development).

## Installation

Android/Chrome:
Use the browser's Install app / Add to Home screen option.

iPhone/iPad Safari:
Open the site -> Share -> Add to Home Screen.

Windows/Edge:
Open the site -> Edge menu -> Apps -> Install PDF Merger (wording can vary).

## Offline

The first visit must be online so the service worker can install and cache the app shell.
After that, the PDF merger UI and pdf-lib can be used offline. PDF files selected by the
user are processed locally in the browser and are not uploaded by this app.

# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - Initial Release

### Added

- **Client-Side PDF Parsing**: Robust extraction of transactions from bank statements using PDF.js inside Web Workers.
- **SMS Parsing Engine**: Ability to paste raw bank SMS messages for quick transaction entry.
- **Subscription Detection Algorithm**: Smart grouping of recurring transactions with a 5% variance tolerance.
- **Zero-Knowledge Vault**: AES-256-GCM encryption with PBKDF2 key derivation. All data is encrypted locally before being stored in IndexedDB.
- **Interactive Dashboard**: View active, dormant, and cancelled subscriptions. Track total spending and confidence scores.
- **Cancellation Assistant**: Database of 50+ merchants with known cancellation difficulties. Generates context-aware, dynamic emails (formal, casual, firm) to cancel hard-to-reach services.
- **Progressive Web App (PWA)**: Installable on mobile devices with native-like features:
  - Pull-to-refresh gestures.
  - Swipe-to-cancel interactions.
  - Haptic feedback.
  - Web Share API integration.
  - Offline fallback page support.
- **Dark Mode**: Fully responsive, system-aware theming using Tailwind CSS and next-themes.
- **Custom Error Handling**: React Error Boundary for graceful UI degradation and custom 404 Not Found page.

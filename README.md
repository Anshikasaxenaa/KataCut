<div align="center">
  <h1 style="font-size: 4em; font-weight: bold;">
    ₹ KataCut
  </h1>
  <p><strong>Privacy-first subscription tracker. Upload your bank statement, find forgotten subscriptions, cancel them. Your data never leaves your device.</strong></p>

  <p>
    <a href="https://your-vercel-url.vercel.app"><strong>View Live Demo</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
    <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
    <img src="https://img.shields.io/badge/Web_Crypto_API-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web Crypto API" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  </p>
</div>

## Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🔒 Privacy & Security](#-privacy--security)
- [🛠️ Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)

## ✨ Features

- 📄 **Bank statement PDF parsing**: 100% client-side parsing using PDF.js inside Web Workers.
- 📱 **SMS transaction import**: Paste raw SMS alerts for instant analysis.
- 🔍 **Smart subscription detection algorithm**: Uses Levenshtein distance and recurrence patterns to detect recurring charges.
- 🔐 **Zero-knowledge encryption**: AES-256-GCM encryption with PBKDF2 derived keys.
- 📊 **Beautiful dashboard**: Gain spending insights with clear charts and categorization.
- 🚫 **One-click cancellation assistant**: Context-aware email generation to cancel hard-to-find subscriptions.
- 📲 **PWA**: Install natively on your phone, complete with offline support and haptic feedback.
- 🌙 **Dark mode support**: Seamless system-aware theming.

## 🏗️ Architecture

```ascii
+-----------------------------------------------------------------------------------------+
|                                    USER'S BROWSER                                       |
|                                                                                         |
|  +--------------+       +---------------+       +---------------+      +-------------+  |
|  |              |       |               |       | Web Crypto API|      |             |  |
|  | PDF.js / SMS | ----> | Detection &   | ----> | (AES-256-GCM) | ---> | IndexedDB   |  |
|  | Parsing      |       | Normalization |       |               |      | (Local Data)|  |
|  +--------------+       +---------------+       +---------------+      +-------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
                                            |
                                            | (Anonymous Stats / Auth / Sync)
                                            v
+-----------------------------------------------------------------------------------------+
|                                      BACKEND                                            |
|                                                                                         |
|  +--------------------+             +------------------+             +---------------+  |
|  | Next.js API Routes |  -------->  | Mongoose Models  |  -------->  | MongoDB Atlas |  |
|  | (Edge / Serverless)|             | (Business Logic) |             | (Cloud DB)    |  |
|  +--------------------+             +------------------+             +---------------+  |
+-----------------------------------------------------------------------------------------+
```

> 🔒 **Financial data NEVER leaves the browser.** The server stores only your email hash, UI preferences, and completely anonymized/encrypted blobs if sync is enabled.

## 🔒 Privacy & Security

KataCut was built from the ground up for absolute paranoia-level privacy.

- **Encryption**: Data is encrypted using `AES-256-GCM`.
- **Key Derivation**: Your master password never leaves memory. It generates an encryption key via `PBKDF2` with 100,000 iterations and a random salt.
- **Data Flow**: PDF parsing happens in isolated Web Workers. Text extraction, regex matching, and database storage (`IndexedDB`) occur entirely on your local machine.
- **Server Data**: If you opt into sync, the server only receives AES-encrypted ciphertexts. We literally cannot see your transactions.
- **Open Source**: Don't trust us. Verify the source code yourself.

## 🛠️ Tech Stack

| Technology                   | Purpose              | Why                                                |
| ---------------------------- | -------------------- | -------------------------------------------------- |
| **Next.js 16 (App Router)**  | Frontend & Edge API  | Fast rendering, RSCs, seamless routing             |
| **TypeScript**               | Type Safety          | Catches errors early, superior DX                  |
| **Tailwind CSS + shadcn/ui** | Styling & Components | Rapid, consistent, and beautiful UI development    |
| **Web Crypto API**           | Security             | Native browser encryption without heavy polyfills  |
| **PDF.js**                   | PDF Parsing          | Robust client-side text extraction                 |
| **Framer Motion**            | Animations           | Smooth swipe-to-cancel and fluid layouts           |
| **MongoDB Atlas**            | Database             | Flexible NoSQL document storage                    |
| **Mongoose ODM**             | Data modeling        | Robust schemas and logic separation                |

## 📸 Screenshots

_(Placeholder for Screenshots)_

<div style="display: flex; gap: 10px;">
  <img src="public/screenshots/dashboard.png" width="200" alt="Dashboard View" />
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local instance)

### Clone and Install

```bash
git clone https://github.com/yourusername/katacut.git
cd katacut
npm install
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

| Variable              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL to your backend (e.g. `http://localhost:4000`) |
| `MONGODB_URI`         | MongoDB connection string                          |
| `RESEND_API_KEY`      | API key for transactional emails                   |
| `JWT_SECRET`          | Secret for signing user sessions                   |

### Database Setup

No manual database migrations are needed with MongoDB/Mongoose. Just ensure your `MONGODB_URI` is correctly pointing to your database.

### Run Development Servers

```bash
npm run dev
```

## 📁 Project Structure

```text
kata-cut/
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, api)
│   ├── components/         # Reusable UI components (shadcn, forms)
│   ├── hooks/              # Custom React hooks (useAuth, useVault)
│   ├── lib/                # Core business logic
│   │   ├── cancellation/   # Email generation, merchant database
│   │   ├── crypto/         # Web Crypto wrapper, PBKDF2 logic
│   │   ├── parsers/        # Regex banks, PDF worker logic
│   │   └── types/          # TypeScript interfaces
│   └── styles/             # Global CSS
├── public/                 # PWA icons, manifest, static assets
├── docs/                   # Deep-dive architectural documentation
├── scripts/                # Utility scripts (icon generation, etc.)
└── next.config.ts          # PWA and Next.js configuration
```

## 🗺️ Roadmap

- [ ] Support for **SBI, Axis, and Kotak** bank statements.
- [ ] Automatic **UPI AutoPay** detection via SMS.
- [ ] Push notification alerts for upcoming renewals (Backend Integration).
- [ ] Cross-device encrypted sync using Express/PostgreSQL.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

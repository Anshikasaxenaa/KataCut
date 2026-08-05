<div align="center">
  <h1 style="font-size: 4.5em; font-weight: 800; margin-bottom: 0;">
    KataCut ✂️
  </h1>
  <p style="font-size: 1.2em; color: #64748B;">
    <strong>A paranoid, privacy-first subscription tracker and cancellation assistant.</strong>
  </p>

  <p>
    <a href="https://your-vercel-url.vercel.app"><strong>View Live Demo</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
    <img src="https://img.shields.io/badge/Web_Crypto_API-FACC15?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Web Crypto API" />
  </p>
</div>

---

## 🔒 The Zero-Knowledge Promise

Most financial apps require you to link your bank account via Plaid, giving them full read access to your entire financial history. **We think that's insane.**

KataCut operates on a **zero-knowledge architecture**:
1. **Local Parsing**: You drop your bank statement PDF into the app. It is parsed entirely in your browser using `pdf.js` inside isolated Web Workers.
2. **Local AI Analysis**: The raw text is optionally analyzed to find subscriptions, but the results are only saved locally.
3. **Local Encryption**: All your financial data is encrypted in your browser using the native Web Crypto API (`AES-256-GCM`). 
4. **Cloud Sync (Optional)**: If you enable cross-device sync, only encrypted, indecipherable blobs are sent to our MongoDB servers. **We literally cannot read your data.**

## ✨ Core Features

- 🧠 **AI-Powered Discovery**: Powered by Google Gemini 1.5 Flash, KataCut intelligently parses messy bank statements and raw SMS messages to detect hidden subscriptions, billing frequencies, and amounts.
- ✂️ **1-Click Cancellation Assistant**: Generates context-aware, legally-sound cancellation emails for difficult merchants directly from the app.
- 🔐 **Military-Grade Encryption**: PBKDF2 derived keys and AES-256-GCM encryption ensure your master password is the only key to your vault.
- 📱 **Progressive Web App (PWA)**: Install it on your iOS or Android device. Works offline.
- 🌓 **Beautiful UI**: Built with Tailwind CSS v4 and Framer Motion for buttery-smooth micro-interactions.

## 🏗️ Architecture

```ascii
+-----------------------------------------------------------------------------------------+
|                                    USER'S BROWSER                                       |
|                                                                                         |
|  +--------------+       +---------------+       +---------------+      +-------------+  |
|  |              |       | Gemini AI API |       | Web Crypto API|      |             |  |
|  | PDF.js / SMS | ----> | Detection &   | ----> | (AES-256-GCM) | ---> | IndexedDB   |  |
|  | Parsing      |       | Normalization |       |               |      | (Local Data)|  |
|  +--------------+       +---------------+       +---------------+      +-------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
                                            |
                                            | (Anonymous Stats / Auth / Encrypted Sync)
                                            v
+-----------------------------------------------------------------------------------------+
|                                   VERCEL EDGE / CLOUD                                   |
|                                                                                         |
|  +--------------------+             +------------------+             +---------------+  |
|  | Next.js API Routes |  -------->  | Mongoose Models  |  -------->  | MongoDB Atlas |  |
|  | (Custom JWT Auth)  |             | (Business Logic) |             | (NoSQL DB)    |  |
|  +--------------------+             +------------------+             +---------------+  |
+-----------------------------------------------------------------------------------------+
```

## 🛠️ The Tech Stack

KataCut is built on a bleeding-edge, highly optimized stack:

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4, shadcn/ui, Base UI
- **Animations**: Framer Motion & tw-animate-css
- **Local Storage**: IndexedDB wrapper for local persistence

### Security & AI
- **Encryption**: Web Crypto API (Native browser execution)
- **AI Integration**: `@google/genai` (Gemini 1.5 Flash API)
- **Authentication**: Custom JWT Middleware + `@react-oauth/google` for identity verification

### Backend & Database
- **Backend API**: Next.js Serverless Route Handlers
- **Database**: MongoDB Atlas
- **ODM**: Mongoose 9.9.x
- **Email Delivery**: Resend

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB cluster (e.g., free tier on MongoDB Atlas)
- A Google Cloud project (for Google Auth Client ID)
- A Google AI Studio API Key (for Gemini)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/katacut.git
cd katacut
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/katacut

# Custom JWT Auth
JWT_SECRET=generate_a_random_secure_string

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# AI Analysis
GEMINI_API_KEY=your_gemini_api_key

# Email
RESEND_API_KEY=your_resend_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app. No manual database migrations are required with Mongoose!

## 🗺️ Roadmap

- [x] Migrate backend to MongoDB & Next.js App Router
- [x] Integrate Gemini AI for smart statement analysis
- [ ] Add visual spending charts to the dashboard
- [ ] Implement push notifications for upcoming renewals (PWA)
- [ ] Multi-device encrypted sync layer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

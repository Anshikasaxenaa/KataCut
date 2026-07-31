# KataCut Demo Script (5 Minutes)

This script is designed for a fast-paced, high-impact demonstration of KataCut's core features during technical interviews or portfolio showcases.

## Setup Before Demo

1. Ensure the app is running locally (`npm run dev`).
2. Have a mock HDFC/ICICI PDF statement ready. (Make sure it includes transactions for Netflix, Amazon Prime, Spotify, Swiggy One, and Cult.fit).
3. Clear `IndexedDB` to show the fresh setup state.

---

## The Demo

### 1. Introduction & The Privacy Pitch (0:00 - 0:45)

_(Start on the Landing Page)_
**Speaker:** "Welcome to KataCut. We all have subscription fatigue—forgotten gym memberships, trial periods that rolled over. KataCut helps you find and cancel them. But the differentiator here is **privacy**."
**Speaker:** "Financial data is highly sensitive. Other apps ask for your bank login credentials or upload your statements to their servers. KataCut doesn't. We do 100% of the processing locally in your browser."

### 2. Vault Creation (0:45 - 1:30)

_(Navigate to Dashboard. The Vault Setup screen appears)_
**Speaker:** "First, we create an encrypted vault. Your password generates a secure key using PBKDF2 with 100,000 iterations."
_(Enter a password)_
**Speaker:** "Once created, this key never leaves memory. It encrypts all your data using AES-256-GCM before it touches IndexedDB."

### 3. File Upload & Client-Side Parsing (1:30 - 2:30)

_(Click 'Upload Statement' and select the mock PDF)_
**Speaker:** "I'm uploading my bank statement now. Watch the network tab. No network requests are made. We use PDF.js running inside a Web Worker to extract the text without blocking the UI."
**Speaker:** "Our custom parsers use regex to identify transactions, dates, and amounts. It works instantly."

### 4. Dashboard & Detection Algorithm (2:30 - 3:30)

_(The Dashboard populates with Stats and Subscription Cards)_
**Speaker:** "Here is the dashboard. Our detection algorithm analyzes the parsed transactions. It uses string similarity and date recurrence logic to identify subscriptions. It found 5 active subscriptions."
_(Point to the cards)_
**Speaker:** "You can see Netflix, Amazon Prime, Spotify, Swiggy One, and... Cult.fit."

### 5. Dormant Warnings & Cancellation (3:30 - 4:30)

_(Highlight the Cult.fit card showing a red 'Dormant' status)_
**Speaker:** "Notice Cult.fit. Our algorithm flags it as 'Dormant' because there have been no recent transactions or activity detected for 90 days. I'm wasting ₹1,499 a month."
_(Click the 'Cancel' or swipe left to reveal the Cancel action)_
**Speaker:** "KataCut isn't just a tracker; it's an assistant. Clicking cancel brings up a context-aware cancellation flow. Because Cult.fit is notoriously hard to cancel online, KataCut automatically drafts a firm cancellation email for me."
_(Show the email draft modal and click send/open)_

### 6. PWA & Conclusion (4:30 - 5:00)

_(Open Chrome DevTools and show the App Manifest / Simulate Mobile View)_
**Speaker:** "Finally, KataCut is a fully offline-capable Progressive Web App. You can install it on your phone, and it works flawlessly on an airplane without internet."
**Speaker:** "That's KataCut. Absolute privacy, smart detection, and actionable insights."

---

## Anticipated Questions

**Q: How do you handle varied transaction names? (e.g., 'NETFLIX ENT' vs 'NFLX')**
**A:** "We normalize the strings by stripping special characters and common suffixes. Then we use Levenshtein distance for fuzzy matching to group them together."

**Q: What if the subscription amount changes due to a price hike?**
**A:** "The detection algorithm allows for a 5% variance in recurring amounts to account for slight changes, currency fluctuations, or GST adjustments."

**Q: Why use IndexedDB instead of LocalStorage?**
**A:** "LocalStorage is synchronous and limited to 5MB. Bank statements can contain thousands of transactions, easily exceeding 5MB. IndexedDB is asynchronous and scalable."

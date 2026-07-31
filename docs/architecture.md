# KataCut Architecture Document

This document provides a deep dive into the technical architecture, data flow, and cryptographic guarantees of KataCut.

## Data Flow Diagram

The following represents the lifecycle of a user's bank statement from upload to insights generation.

1. **User Action:** User drags and drops a PDF bank statement into the browser.
2. **Parsing (Client-side):**
   - File is passed to `PDF.js` running in a dedicated Web Worker (preventing UI blocking).
   - Text is extracted and fed into `parsers.ts`.
   - Regular expressions match bank-specific patterns (HDFC, ICICI).
3. **Normalization:** Extracted strings are converted into a standardized `NormalizedTransaction` object.
4. **Subscription Detection:**
   - `detection.ts` scans the normalized transactions.
   - It identifies recurring merchants using string similarity and calculates a `confidence` score based on date regularity and amount consistency.
5. **Encryption (Client-side):**
   - The transactions and subscriptions are serialized to JSON.
   - `Vault.ts` encrypts the JSON using `AES-256-GCM`.
6. **Storage:**
   - The encrypted blob is stored locally in the browser's `IndexedDB`.
7. **Rendering:**
   - The React UI retrieves the blob, decrypts it in-memory, and renders the Dashboard.

## Encryption Pipeline

Absolute privacy is guaranteed through zero-knowledge encryption.

1. **Passphrase:** User enters a master password.
2. **Salt Generation:** A secure random salt is generated via `crypto.getRandomValues()`.
3. **Key Derivation:** The password and salt are fed into `PBKDF2` (100,000 iterations, SHA-256).
4. **Encryption Key:** A 256-bit AES key is derived.
5. **Encryption:** Data is encrypted using `AES-256-GCM` with a random Initialization Vector (IV).
6. **Storage:** Only the `ciphertext`, `salt`, and `IV` are stored in IndexedDB. **The master password and AES key are immediately discarded from memory when the vault locks.**

## Detection Algorithm Pseudocode

```text
function detectSubscriptions(transactions):
  grouped = groupByMerchant(transactions, similarityThreshold=0.85) // Accounts for subtle name changes

  subscriptions = []
  for merchant in grouped:
    if length(merchant.txs) >= 2:
      // Calculate date intervals
      intervals = diffDaysBetweenTransactions(merchant.txs)
      frequency = inferFrequency(intervals) // e.g., ~30 days = monthly

      // Calculate amount variance
      // 5% tolerance allowed for GST changes or currency fluctuations
      variance = calculateVariance(merchant.txs.amounts)

      if isRecurringPattern(frequency, variance):
        confidence = calculateConfidence(frequency, variance)
        subscriptions.push(new Subscription(merchant, frequency, confidence))

  return subscriptions
```

## Database Schema (Express / PostgreSQL)

While KataCut currently operates entirely offline, the proposed sync backend utilizes the following schema via Drizzle ORM:

### `users` table

| Column       | Type      | Notes                                                   |
| ------------ | --------- | ------------------------------------------------------- |
| `id`         | UUID      | Primary Key                                             |
| `email_hash` | VARCHAR   | Bcrypt hash of email (we don't store plain text emails) |
| `created_at` | TIMESTAMP |                                                         |

### `vaults` table

| Column           | Type    | Notes                              |
| ---------------- | ------- | ---------------------------------- |
| `id`             | UUID    | Primary Key                        |
| `user_id`        | UUID    | Foreign Key -> users.id            |
| `encrypted_blob` | TEXT    | AES-256-GCM ciphertext from client |
| `iv`             | VARCHAR | Initialization Vector              |
| `salt`           | VARCHAR | PBKDF2 Salt                        |

## API Routes Documentation

### `POST /api/cancel/send-email`

Used to send a cancellation request to a merchant on behalf of the user via Resend API.

**Request:**

```json
{
  "to": "support@spotify.com",
  "subject": "Cancellation Request: Premium Subscription",
  "html": "<p>Please cancel my subscription immediately.</p>"
}
```

**Response (Success - 200 OK):**

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Decision Log

### Why client-side parsing?

Financial documents contain highly sensitive PII (Account Numbers, PAN, Addresses). Sending PDFs to a server requires trusting the server infrastructure. By parsing on the client using `PDF.js`, KataCut guarantees PII never traverses the network.

### Why AES-256-GCM?

GCM (Galois/Counter Mode) provides both confidentiality (encryption) and authenticity (tamper-proofing). It is widely supported natively in browsers via the Web Crypto API, eliminating the need for heavy external libraries like `crypto-js`.

### Why IndexedDB over localStorage?

`localStorage` is synchronous (blocking the main thread) and has a strict 5MB limit. Bank statements can generate thousands of transaction records quickly exceeding 5MB. `IndexedDB` is asynchronous and offers virtually unlimited storage.

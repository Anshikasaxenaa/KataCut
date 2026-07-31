/**
 * encryption.ts
 * 
 * Handles symmetric encryption and decryption of string data using AES-256-GCM.
 */

const IV_LENGTH = 12; // 96 bits is recommended for GCM

/**
 * Encrypts a plaintext string using the provided AES-GCM key.
 * 
 * @param data The plaintext string to encrypt.
 * @param key The CryptoKey used for encryption.
 * @returns A promise resolving to the encrypted ciphertext and the Initialization Vector (IV).
 */
export async function encrypt(data: string, key: CryptoKey): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Generate a cryptographically secure random IV for this encryption operation
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    encodedData
  );

  return { ciphertext, iv };
}

/**
 * Decrypts ciphertext back to a plaintext string using the provided AES-GCM key and IV.
 * 
 * @param ciphertext The encrypted data buffer.
 * @param iv The Initialization Vector used during encryption.
 * @param key The CryptoKey used for decryption.
 * @returns A promise resolving to the decrypted plaintext string.
 */
export async function decrypt(ciphertext: ArrayBuffer | Uint8Array, iv: Uint8Array, key: CryptoKey): Promise<string> {
  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    // A decryption failure usually means wrong key, corrupted data, or tampered ciphertext (auth tag mismatch)
    console.error("Decryption failed. Incorrect passphrase or corrupted data.");
    throw new Error("Failed to decrypt data. Invalid key or corrupted payload.");
  }
}

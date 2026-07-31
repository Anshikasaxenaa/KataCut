/**
 * key-derivation.ts
 * 
 * Handles the secure derivation of an AES-256-GCM key from a user's passphrase
 * using PBKDF2 (100,000 iterations, SHA-256).
 */

const ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_ALGO = "SHA-256";
const KEY_LENGTH = 256;
const KEY_ALGO = "AES-GCM";

/**
 * Validates a passphrase against strict requirements:
 * - Minimum 8 characters
 * - At least one number
 * - At least one special character
 */
export function validatePassphrase(passphrase: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (passphrase.length < 8) errors.push("Minimum 8 characters");
  if (!/[0-9]/.test(passphrase)) errors.push("At least one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(passphrase)) errors.push("At least one special character");
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Derives a CryptoKey from a passphrase and an optional salt.
 * If no salt is provided, a new random one is generated.
 * 
 * @param passphrase The user's secret passphrase
 * @param salt (Optional) The salt to use for derivation. If omitted, a new salt is generated.
 * @returns A promise resolving to an object containing the derived CryptoKey and the salt used.
 */
export async function deriveKey(passphrase: string, salt?: Uint8Array): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const encoder = new TextEncoder();
  const passphraseBytes = encoder.encode(passphrase);

  // Generate a random salt if not provided
  const actualSalt = salt || crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // Import the passphrase as raw key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passphraseBytes,
    { name: "PBKDF2" },
    false, // not extractable
    ["deriveBits", "deriveKey"]
  );

  // Derive the AES-GCM key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: actualSalt as BufferSource,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    keyMaterial,
    { name: KEY_ALGO, length: KEY_LENGTH },
    false, // not extractable for added security
    ["encrypt", "decrypt"]
  );

  return { key, salt: actualSalt };
}

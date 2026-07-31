/**
 * vault.ts
 *
 * Manages the active encryption key in memory and provides high-level
 * methods to seal and unseal JavaScript objects securely.
 */

import { deriveKey } from "./key-derivation";
import { encrypt, decrypt } from "./encryption";

export interface EncryptedBlob {
  salt: string; // base64 encoded salt
  iv: string; // base64 encoded initialization vector
  ciphertext: string; // base64 encoded ciphertext
  version: number; // format version
}

// Helper: Convert ArrayBuffer/Uint8Array to Base64 string
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  // Note: For very large buffers, String.fromCharCode.apply can exceed max call stack.
  // This iterative approach avoids that issue and is safe for browser use.
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper: Convert Base64 string to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

const AUTO_LOCK_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

class VaultManager {
  private key: CryptoKey | null = null;
  private salt: Uint8Array | null = null;
  private autoLockTimer: NodeJS.Timeout | null = null;

  // Listeners for lock state changes
  private listeners: Set<(isLocked: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Setup activity listeners to reset auto-lock timeout
      window.addEventListener("mousemove", this.resetAutoLockTimer.bind(this));
      window.addEventListener("keydown", this.resetAutoLockTimer.bind(this));
      window.addEventListener("click", this.resetAutoLockTimer.bind(this));
      window.addEventListener("scroll", this.resetAutoLockTimer.bind(this));
    }
  }

  public subscribe(listener: (isLocked: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const locked = this.isLocked();
    this.listeners.forEach((listener) => listener(locked));
  }

  private resetAutoLockTimer() {
    if (!this.key) return; // Only run timer if vault is unlocked

    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
    }

    this.autoLockTimer = setTimeout(() => {
      this.lock();
    }, AUTO_LOCK_TIMEOUT_MS);
  }

  /**
   * Sets up the vault with a new passphrase (first time setup).
   */
  public async setup(passphrase: string): Promise<void> {
    const { key, salt } = await deriveKey(passphrase);
    this.key = key;
    this.salt = salt;
    this.resetAutoLockTimer();
    this.notifyListeners();
  }

  /**
   * Unlocks the vault using the stored salt and a passphrase.
   */
  public async unlock(
    passphrase: string,
    storedSaltBase64: string,
  ): Promise<boolean> {
    try {
      const storedSalt = base64ToBuffer(storedSaltBase64);
      const { key } = await deriveKey(passphrase, storedSalt);

      // We don't technically know if the key is correct until we decrypt something.
      // But we will load it into memory. Incorrect keys will throw during `unseal`.
      this.key = key;
      this.salt = storedSalt;
      this.resetAutoLockTimer();
      this.notifyListeners();
      return true;
    } catch (e) {
      console.error("Failed to unlock vault", e);
      return false;
    }
  }

  /**
   * Locks the vault by clearing the key from memory.
   */
  public lock(): void {
    this.key = null;
    this.salt = null;
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
      this.autoLockTimer = null;
    }
    this.notifyListeners();
  }

  public isLocked(): boolean {
    return this.key === null;
  }

  /**
   * Serializes and encrypts an object into an EncryptedBlob.
   */
  public async seal<T>(data: T): Promise<EncryptedBlob> {
    if (!this.key || !this.salt) {
      throw new Error("Vault is locked. Cannot seal data.");
    }

    // 1. JSON stringify the object
    const jsonString = JSON.stringify(data);

    // 2. Encrypt the string
    const { ciphertext, iv } = await encrypt(jsonString, this.key);

    // 3. Package into base64 format for safe storage
    return {
      salt: bufferToBase64(this.salt),
      iv: bufferToBase64(iv),
      ciphertext: bufferToBase64(ciphertext),
      version: 1,
    };
  }

  /**
   * Decrypts and deserializes an EncryptedBlob back into the original object.
   */
  public async unseal<T>(blob: EncryptedBlob): Promise<T> {
    if (!this.key) {
      throw new Error("Vault is locked. Cannot unseal data.");
    }

    if (blob.version !== 1) {
      throw new Error(`Unsupported vault version: ${blob.version}`);
    }

    // 1. Decode base64 components
    const iv = base64ToBuffer(blob.iv);
    const ciphertext = base64ToBuffer(blob.ciphertext);

    // 2. Decrypt to string
    const jsonString = await decrypt(ciphertext, iv, this.key);

    // 3. Parse JSON
    return JSON.parse(jsonString) as T;
  }
}

// Export a singleton instance for the app to use
export const Vault = new VaultManager();

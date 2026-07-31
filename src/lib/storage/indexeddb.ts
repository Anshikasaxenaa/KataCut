/**
 * indexeddb.ts
 * 
 * Provides a Promise-based wrapper around the native IndexedDB API.
 * Handles the secure storage and retrieval of data by piping everything
 * through the Vault for encryption before it hits the disk.
 */

import { Vault, EncryptedBlob } from "../crypto/vault";

const DB_NAME = "katacut-vault";
const DB_VERSION = 1;

export type StoreName = "transactions" | "subscriptions" | "preferences" | "metadata";
const STORES: StoreName[] = ["transactions", "subscriptions", "preferences", "metadata"];

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initializes the IndexedDB database.
 */
function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        });
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        console.error("IndexedDB initialization error:", (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }
  return dbPromise;
}

/**
 * Encrypts and saves data to a specific store.
 */
export async function saveData<T>(storeName: StoreName, key: string, data: T): Promise<void> {
  const sealedData = await Vault.seal(data);
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(sealedData, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads and decrypts data from a specific store.
 * Returns null if the key is not found.
 */
export async function loadData<T>(storeName: StoreName, key: string): Promise<T | null> {
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = async () => {
      const result = request.result as EncryptedBlob | undefined;
      if (!result) {
        resolve(null);
        return;
      }
      
      try {
        const unsealedData = await Vault.unseal<T>(result);
        resolve(unsealedData);
      } catch (error) {
        console.error(`Failed to unseal data for key: ${key} in store: ${storeName}`, error);
        reject(error);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes a specific key from a store.
 */
export async function deleteData(storeName: StoreName, key: string): Promise<void> {
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clears all data across all stores.
 */
export async function clearAll(): Promise<void> {
  const db = await getDB();
  
  const promises = STORES.map(storeName => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });

  await Promise.all(promises);
}

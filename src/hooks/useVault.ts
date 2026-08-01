import { useState, useEffect } from "react";
import { Vault } from "@/lib/crypto/vault";

export function useVault() {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isSetup, setIsSetup] = useState<boolean>(false);

  useEffect(() => {
    // Check initial state
    setIsLocked(Vault.isLocked());
    
    // Determine if vault is setup by checking local storage for the salt
    if (typeof window !== "undefined") {
      const storedSalt = localStorage.getItem("katacut-vault-salt");
      setIsSetup(!!storedSalt);
    }

    // Subscribe to changes
    const unsubscribe = Vault.subscribe((locked) => {
      setIsLocked(locked);
      
      // Also update setup state if it changes
      if (typeof window !== "undefined") {
        const storedSalt = localStorage.getItem("katacut-vault-salt");
        setIsSetup(!!storedSalt);
      }
    });

    return () => unsubscribe();
  }, []);

  return { isLocked, isSetup };
}

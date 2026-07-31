"use client";

import { useState } from "react";
import { Vault } from "@/lib/crypto/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Unlock, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAll } from "@/lib/storage/indexeddb";

interface VaultLockScreenProps {
  saltBase64: string;
  onUnlock: () => void;
  onReset: () => void;
}

export function VaultLockScreen({
  saltBase64,
  onUnlock,
  onReset,
}: VaultLockScreenProps) {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnlock = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!passphrase) return;

    setIsUnlocking(true);
    setError(false);

    try {
      // Add slight delay to prevent brute-forcing timing and show UI state
      await new Promise((r) => setTimeout(r, 100));

      const unlocked = await Vault.unlock(passphrase, saltBase64);

      if (unlocked) {
        setSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        setError(true);
        setPassphrase("");
        setIsUnlocking(false);
      }
    } catch (err) {
      setError(true);
      setPassphrase("");
      setIsUnlocking(false);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure? This will delete all your encrypted data permanently. You will need to re-upload your bank statements.",
      )
    ) {
      await clearAll(); // Clear indexedDB
      localStorage.removeItem("katacut-vault-salt"); // Remove salt
      Vault.lock();
      onReset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Unlock className="w-6 h-6 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Lock className="w-6 h-6 text-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <CardTitle className="text-2xl text-zinc-100">
              Vault Locked
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              Enter your vault passphrase to unlock your financial data.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="password"
                  placeholder="Passphrase"
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500 h-12 text-lg px-4 ${error ? "border-rose-500 focus-visible:ring-rose-500" : "border-zinc-800"}`}
                  disabled={isUnlocking || success}
                  autoFocus
                />
              </motion.div>

              {error && (
                <p className="text-sm text-rose-500 font-medium text-center">
                  Incorrect passphrase. Please try again.
                </p>
              )}

              <Button
                type="submit"
                className={`w-full h-12 text-base transition-colors ${success ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                disabled={!passphrase || isUnlocking || success}
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Decrypting...
                  </>
                ) : success ? (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    Unlocked
                  </>
                ) : (
                  <>
                    Unlock Vault
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pt-2 pb-6">
            <button
              onClick={handleReset}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              Forgot passphrase? Reset and re-upload data
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

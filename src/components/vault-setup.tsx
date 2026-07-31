"use client";

import { useState, useEffect } from "react";
import { Vault, bufferToBase64 } from "@/lib/crypto/vault";
import { validatePassphrase } from "@/lib/crypto/key-derivation";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VaultSetupProps {
  onComplete: () => void;
}

export function VaultSetup({ onComplete }: VaultSetupProps) {
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation
  const hasMinLength = passphrase.length >= 8;
  const hasNumber = /[0-9]/.test(passphrase);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passphrase);
  const isMatch = passphrase === confirmPassphrase && passphrase.length > 0;

  const isValid =
    hasMinLength && hasNumber && hasSpecial && isMatch && understood;

  // Strength meter
  let strength = 0;
  if (hasMinLength) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecial) strength += 1;
  if (passphrase.length > 12) strength += 1;

  const strengthColor =
    strength <= 1
      ? "bg-red-500"
      : strength === 2 || strength === 3
        ? "bg-amber-500"
        : "bg-emerald-500";

  const strengthLabel =
    strength <= 1
      ? "Weak"
      : strength === 2 || strength === 3
        ? "Strong"
        : "Very Strong";

  const handleSetup = async () => {
    if (!isValid) return;

    setIsSettingUp(true);
    try {
      // Small delay to allow UI to show loading state (deriving key is CPU intensive)
      await new Promise((resolve) => setTimeout(resolve, 50));

      await Vault.setup(passphrase);

      // Store salt in localStorage (safe to store openly, needed to derive key again)
      // Note: Vault.setup sets Vault.salt, we need to extract it or we could have setup return it.
      // A cleaner way is to use a constant salt name
      // We will re-derive it here just to get the salt for localStorage
      // But actually, Vault.setup doesn't expose salt. Let's fix Vault to expose a getSaltBase64() or we just handle it differently.
      // Wait, we can get the salt from Vault if we add a getter, but since we didn't, let's just generate salt here and pass it, OR we can add getSalt to Vault.
      // Actually, since I wrote vault.ts without a getter, I'll modify vault.ts later. For now, we can use the `Vault.seal` to get the salt.
      // Let's just do a dummy seal to extract the salt.
      const dummyBlob = await Vault.seal({ init: true });
      localStorage.setItem("katacut-vault-salt", dummyBlob.salt);

      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error("Setup failed:", error);
      setIsSettingUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
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
                    <Shield className="w-6 h-6 text-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <CardTitle className="text-2xl text-zinc-100">
              Secure Your Vault
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              Your financial data stays on your device, encrypted with a
              passphrase only you know.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Create a passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                  disabled={isSettingUp || success}
                />

                {/* Strength Meter */}
                {passphrase.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                      />
                    </div>
                    <p
                      className={`text-xs text-right font-medium ${strengthColor.replace("bg-", "text-")}`}
                    >
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              <Input
                type="password"
                placeholder="Confirm passphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                disabled={isSettingUp || success}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-sm">
              <div
                className={`flex items-center gap-2 transition-colors ${hasMinLength ? "text-emerald-500" : "text-zinc-500"}`}
              >
                {hasMinLength ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>8+ characters</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-colors ${hasNumber ? "text-emerald-500" : "text-zinc-500"}`}
              >
                {hasNumber ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>1+ number</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-colors ${hasSpecial ? "text-emerald-500" : "text-zinc-500"}`}
              >
                {hasSpecial ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>1+ special character</span>
              </div>
              {confirmPassphrase.length > 0 && (
                <div
                  className={`flex items-center gap-2 transition-colors ${isMatch ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {isMatch ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>Passphrases match</span>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400 leading-relaxed">
                <strong className="font-semibold text-rose-500">
                  This passphrase cannot be recovered.
                </strong>{" "}
                If forgotten, your data is permanently lost. We have no way to
                reset it.
              </p>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="understand"
                checked={understood}
                onCheckedChange={(c) => setUnderstood(c === true)}
                className="mt-1 border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                disabled={isSettingUp || success}
              />
              <label
                htmlFor="understand"
                className="text-sm text-zinc-400 font-medium leading-tight cursor-pointer"
              >
                I understand that losing this passphrase means losing access to
                my data.
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={!isValid || isSettingUp || success}
              onClick={handleSetup}
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Securing Vault...
                </>
              ) : success ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Vault Unlocked
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Create Vault
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

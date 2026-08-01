import { useState, useEffect } from "react";
import { Vault } from "@/lib/crypto/vault";
import { loadData, saveData } from "@/lib/storage/indexeddb";
import { Subscription } from "@/lib/types/subscription";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      if (!Vault.isLocked()) {
        const data = await loadData<Subscription[]>("subscriptions", "latest");
        if (data) {
          setSubscriptions(data);
        } else {
          setSubscriptions([]);
        }
      } else {
        setSubscriptions([]);
      }
    } catch (e) {
      console.error("Failed to load subscriptions", e);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();

    // Listen for custom event when dropzone/sms paste saves new data
    const handleUpdate = () => fetchSubscriptions();
    window.addEventListener("subscriptionsUpdated", handleUpdate);
    
    // Listen for vault lock/unlock
    const unsubscribe = Vault.subscribe(() => fetchSubscriptions());

    return () => {
      window.removeEventListener("subscriptionsUpdated", handleUpdate);
      unsubscribe();
    };
  }, []);

  const summary = {
    totalMonthlySpend: subscriptions.reduce((acc, sub) => acc + (sub.frequency === "monthly" ? sub.amount : sub.amount / 12), 0),
    activeCount: subscriptions.filter(s => s.status === "active").length,
    dormantCount: subscriptions.filter(s => s.status === "dormant").length,
    potentialSavings: subscriptions.filter(s => s.status === "dormant").reduce((acc, sub) => acc + (sub.frequency === "monthly" ? sub.amount : sub.amount / 12), 0),
  };

  return { subscriptions, summary, isLoading, fetchSubscriptions };
}

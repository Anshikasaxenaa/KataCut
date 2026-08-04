"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Subscription = {
  name: string;
  cost: string;
  category: string;
  status: "keep" | "cancel" | "canceled";
  logo: string;
  color: string;
  desc: string;
};

type GlobalContextType = {
  subscriptions: Subscription[];
  setSubscriptions: (subs: Subscription[]) => void;
  potentialSavings: number;
  setPotentialSavings: (val: number) => void;
  dormantCount: number;
  setDormantCount: (val: number) => void;
  activeCount: number;
  setActiveCount: (val: number) => void;
  updateCounts: (subs: Subscription[]) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [dormantCount, setDormantCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  const updateCounts = (subs: Subscription[]) => {
    let savings = 0;
    let dormant = 0;
    let active = 0;
    
    subs.forEach(sub => {
      if (sub.status === "cancel" || sub.status === "canceled") {
        dormant += 1;
        // Strip out non-numeric characters to calculate savings
        const costNum = parseInt(sub.cost.replace(/[^\d]/g, ''), 10) || 0;
        savings += costNum;
      } else {
        active += 1;
      }
    });

    setPotentialSavings(savings);
    setDormantCount(dormant);
    setActiveCount(active);
  };

  return (
    <GlobalContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        potentialSavings,
        setPotentialSavings,
        dormantCount,
        setDormantCount,
        activeCount,
        setActiveCount,
        updateCounts
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}

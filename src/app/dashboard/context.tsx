"use client";

import { createContext, useContext, useState } from "react";

type DashboardContextType = {
  potentialSavings: number;
  setPotentialSavings: (val: number) => void;
  dormantCount: number;
  setDormantCount: (val: number) => void;
  activeCount: number;
  setActiveCount: (val: number) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [potentialSavings, setPotentialSavings] = useState(819);
  const [dormantCount, setDormantCount] = useState(2);
  const [activeCount, setActiveCount] = useState(7);

  return (
    <DashboardContext.Provider
      value={{
        potentialSavings,
        setPotentialSavings,
        dormantCount,
        setDormantCount,
        activeCount,
        setActiveCount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}

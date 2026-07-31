"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 text-center px-4"
    >
      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-base leading-relaxed mb-8">
        {description}
      </p>
      
      {action && (
        <div className="relative">
          {action}
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -left-12 -top-8 hidden md:block"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500/50">
              <path d="M35 5C25 5 15 15 15 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
              <path d="M10 20L15 25L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

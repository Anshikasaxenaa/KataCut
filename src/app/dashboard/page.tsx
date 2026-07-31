"use client";

import { useState, useEffect, useMemo } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTransactions, detectBank } from "@/lib/parsers";
import { NormalizedTransaction } from "@/lib/types/transaction";
import { Subscription, SubscriptionSummary } from "@/lib/types/subscription";
import { detectSubscriptions, getSubscriptionSummary } from "@/lib/detection";
import { TransactionsTable } from "@/components/transactions-table";
import { SmsPasteArea } from "@/components/sms-paste-area";
import { StatsCards } from "@/components/stats-cards";
import { SubscriptionGrid } from "@/components/subscription-grid";
import { CancellationHistory } from "@/components/cancellation-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBar, FilterOption } from "@/components/filter-bar";
import { SortDropdown, SortOption } from "@/components/sort-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, MessageSquare, Search, Loader2, Bell, BellOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// Crypto & Storage
import { Vault } from "@/lib/crypto/vault";
import { saveData, loadData } from "@/lib/storage/indexeddb";
import { VaultSetup } from "@/components/vault-setup";
import { VaultLockScreen } from "@/components/vault-lock-screen";
import { EncryptionIndicator } from "@/components/encryption-indicator";

export default function DashboardPage() {
  const { user } = useAuth();
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([]);
  const [detectedBank, setDetectedBank] = useState<string>("unknown");
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subSummary, setSubSummary] = useState<SubscriptionSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // UI State
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [activeSort, setActiveSort] = useState<SortOption>("Name (A-Z)");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // PWA & Mobile Features
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshControls = useAnimation();

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    
    if (Notification.permission === "granted") {
      alert("Notifications are already enabled! To disable, please use your browser settings.");
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        new Notification("KataCut", {
          body: "You will now receive alerts for upcoming renewals and savings!",
          icon: "/icons/icon-192x192.png"
        });
      }
    } else {
      alert("Notifications are blocked by your browser settings.");
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refreshControls.start({ y: 60, transition: { type: "spring", stiffness: 300, damping: 20 } });
    
    // Simulate refresh delay
    setTimeout(async () => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
      await refreshControls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }, 1500);
  };

  // Vault State
  const [vaultSalt, setVaultSalt] = useState<string | null>(null);
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(true);
  const [isVaultChecking, setIsVaultChecking] = useState(true);

  // Initialize Vault State
  useEffect(() => {
    const salt = localStorage.getItem("katacut-vault-salt");
    setVaultSalt(salt);

    const unsubscribe = Vault.subscribe((locked) => {
      setIsVaultLocked(locked);
      // Clear in-memory state on lock to ensure zero-knowledge
      if (locked) {
        setTransactions([]);
        setSubscriptions([]);
        setSubSummary(null);
      }
    });

    setIsVaultLocked(Vault.isLocked());
    setIsVaultChecking(false);

    return unsubscribe;
  }, []);

  // Load Data on Unlock
  useEffect(() => {
    if (!isVaultLocked && !isVaultChecking) {
      loadData<NormalizedTransaction[]>("transactions", "all").then(data => {
        if (data) {
          setTransactions(data);
        }
      });
    }
  }, [isVaultLocked, isVaultChecking]);
  
  useEffect(() => {
    if (extractedPdfText) {
      setIsProcessing(true);
      const bank = detectBank(extractedPdfText);
      setDetectedBank(bank);
      const parsed = parseTransactions(extractedPdfText, "pdf");
      
      setTransactions(prev => {
        const smsTx = prev.filter(t => t.source === "sms");
        const newTxs = [...parsed, ...smsTx];
        // Encrypt and save to IndexedDB
        saveData("transactions", "all", newTxs).catch(console.error);
        return newTxs;
      });
    } else {
       setTransactions(prev => prev.filter(t => t.source === "sms"));
    }
  }, [extractedPdfText]);

  const handleSmsParse = (smsText: string) => {
    setIsProcessing(true);
    const parsedSms = parseTransactions(smsText, "sms");
    setTransactions(prev => {
      const newTxs = [...prev, ...parsedSms];
      // Encrypt and save to IndexedDB
      saveData("transactions", "all", newTxs).catch(console.error);
      return newTxs;
    });
  };

  useEffect(() => {
    if (transactions.length > 0) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        const subs = detectSubscriptions(transactions);
        const summary = getSubscriptionSummary(subs);
        setSubscriptions(subs);
        setSubSummary(summary);
        setLastUpdated(new Date());
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSubscriptions([]);
      setSubSummary(null);
      setIsProcessing(false);
    }
  }, [transactions]);

  // Derived state for filtering and sorting
  const filteredAndSortedSubs = useMemo(() => {
    let result = [...subscriptions];
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.merchant.toLowerCase().includes(q));
    }
    
    // Filter
    if (activeFilter !== "All") {
      if (activeFilter === "Active") result = result.filter(s => s.status === "active");
      if (activeFilter === "Dormant") result = result.filter(s => s.status === "dormant");
      if (activeFilter === "Expiring Soon") result = result.filter(s => s.status === "expiring_soon");
    }
    
    // Sort
    result.sort((a, b) => {
      switch (activeSort) {
        case "Name (A-Z)":
          return a.merchant.localeCompare(b.merchant);
        case "Amount (High to Low)":
          return b.amount - a.amount;
        case "Amount (Low to High)":
          return a.amount - b.amount;
        case "Next Billing":
          if (!a.nextBilling) return 1;
          if (!b.nextBilling) return -1;
          return a.nextBilling.getTime() - b.nextBilling.getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [subscriptions, activeFilter, activeSort, searchQuery]);

  const filterOptions = [
    { label: "All" as FilterOption, count: subscriptions.length },
    { label: "Active" as FilterOption, count: subscriptions.filter(s => s.status === "active").length },
    { label: "Dormant" as FilterOption, count: subscriptions.filter(s => s.status === "dormant").length },
    { label: "Expiring Soon" as FilterOption, count: subscriptions.filter(s => s.status === "expiring_soon").length },
  ];

  const confidenceScore = transactions.length > 0 
    ? transactions.reduce((acc, t) => acc + t.confidence, 0) / transactions.length 
    : 1;
    
  const bankDisplayName = detectedBank === "hdfc" ? "HDFC Bank Statement" : 
                          detectedBank === "icici" ? "ICICI Bank Statement" : "Unknown Format";

  const firstName = user?.email?.split('@')[0] || "User";
  const formattedTime = lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Render Lock/Setup screens if vault is not ready
  if (isVaultChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!vaultSalt) {
    return <VaultSetup onComplete={() => {
      setVaultSalt(localStorage.getItem("katacut-vault-salt"));
      setIsVaultLocked(Vault.isLocked());
    }} />;
  }

  if (isVaultLocked) {
    return <VaultLockScreen 
      saltBase64={vaultSalt} 
      onUnlock={() => setIsVaultLocked(false)} 
      onReset={() => {
        setVaultSalt(null);
        setTransactions([]);
        setSubscriptions([]);
      }} 
    />;
  }

  return (
    <AuthGuard>
      <motion.div 
        animate={refreshControls}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100) {
            handleRefresh();
          } else {
            refreshControls.start({ y: 0 });
          }
        }}
        className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 pb-24 md:pb-8 touch-pan-x"
      >
        {isRefreshing && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
          </div>
        )}
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* TOP BAR */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight"
              >
                Hello, <span className="text-indigo-600 dark:text-indigo-400 capitalize">{firstName}</span>
              </motion.h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Last updated today at {formattedTime}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleNotifications}
                className={notificationsEnabled ? "text-emerald-600" : "text-zinc-400"}
                title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </Button>
              <EncryptionIndicator />
              <Button variant="outline" size="sm" onClick={() => setShowUpload(!showUpload)} className="hidden sm:flex bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <FileText className="w-4 h-4 mr-2" />
                Upload Statement
              </Button>
              <Button size="sm" onClick={() => setShowUpload(!showUpload)} className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Paste SMS
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 pb-6 border-b border-zinc-200 dark:border-zinc-800/50">
                  <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">PDF Statement Parsing (Mock)</CardTitle>
                      <CardDescription>Paste your extracted PDF text to test.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full min-h-[100px] p-3 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                        placeholder="Paste HDFC or ICICI statement text here..."
                        value={extractedPdfText}
                        onChange={(e) => setExtractedPdfText(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  <div>
                    <SmsPasteArea onParse={handleSmsParse} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STATS ROW */}
          {(subSummary || isProcessing) && (
            <section>
              <h2 className="sr-only">Statistics</h2>
              {isProcessing && !subSummary ? (
                 <div className="h-[120px] rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Analyzing transactions...
                 </div>
              ) : (
                subSummary && <StatsCards summary={subSummary} />
              )}
            </section>
          )}

          {/* MAIN CONTENT AREA */}
          <section className="space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <TabsTrigger value="active">Active & Dormant</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancellation History</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <FilterBar 
                    options={filterOptions} 
                    activeFilter={activeFilter} 
                    onFilterChange={setActiveFilter} 
                  />
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 h-9"
                      />
                    </div>
                    <SortDropdown 
                      activeSort={activeSort}
                      onSortChange={setActiveSort}
                    />
                  </div>
                </div>

                <SubscriptionGrid 
                  subscriptions={filteredAndSortedSubs} 
                  isLoading={isProcessing} 
                />
              </TabsContent>

              <TabsContent value="cancelled" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <CancellationHistory />
              </TabsContent>
            </Tabs>
          </section>

          {/* TRANSACTIONS TABLE (Hidden by default to focus on subs, but kept for debug/viewing) */}
          {!isProcessing && transactions.length > 0 && (
            <section className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Raw Transactions</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    {transactions.length} transactions processed.
                  </p>
                </div>
                
                {extractedPdfText && (
                  <Badge variant="outline" className={`px-3 py-1 ${detectedBank === 'unknown' ? 'border-amber-500 text-amber-600 bg-amber-50 dark:border-amber-500/30 dark:text-amber-500 dark:bg-amber-500/10' : 'border-indigo-200 text-indigo-700 bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:bg-indigo-500/10'}`}>
                    Detected: {bankDisplayName}
                  </Badge>
                )}
              </div>

              {confidenceScore < 0.7 && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-500 mb-6">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">We had some trouble parsing this statement format. Some transactions or amounts might be inaccurate. Please verify manually.</p>
                </div>
              )}

              <TransactionsTable transactions={transactions} />
            </section>
          )}
        </div>
        <BottomNav />
      </motion.div>
    </AuthGuard>
  );
}

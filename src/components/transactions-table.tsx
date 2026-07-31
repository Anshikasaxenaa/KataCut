"use client";

import { useState, useMemo } from "react";
import { NormalizedTransaction } from "@/lib/types/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, ArrowUpDown } from "lucide-react";

interface TransactionsTableProps {
  transactions: NormalizedTransaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [filterType, setFilterType] = useState<"all" | "debit" | "credit">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.rawDescription.toLowerCase().includes(q),
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, filterType, searchQuery, sortField, sortDirection]);

  const paginatedTransactions = filteredAndSorted.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Date",
      "Merchant",
      "Description",
      "Type",
      "Amount",
      "Source",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredAndSorted.map(
        (t) =>
          `"${t.date.toISOString().split("T")[0]}","${t.merchant}","${t.rawDescription.replace(/"/g, '""')}","${t.type}",${t.amount},"${t.source}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `katacut_transactions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (transactions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          value={filterType}
          onValueChange={(val) => {
            setFilterType(val as any);
            setPage(1);
          }}
        >
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="debit">Debits</TabsTrigger>
            <TabsTrigger value="credit">Credits</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search merchant..."
              className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={exportCSV}
            title="Export CSV"
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        Showing {filteredAndSorted.length} transactions
      </div>

      <div className="rounded-md border border-zinc-800 overflow-hidden bg-zinc-900/50">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort("date")}
                  className="-ml-3 hover:bg-zinc-800 text-zinc-400"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort("amount")}
                  className="-mr-3 hover:bg-zinc-800 text-zinc-400"
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-zinc-500"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <TableCell className="text-zinc-300 font-medium">
                    {tx.date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-100">
                      {tx.merchant}
                    </div>
                    <div className="text-xs text-zinc-500 md:hidden mt-1 truncate max-w-[200px]">
                      {tx.rawDescription}
                    </div>
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell text-zinc-400 text-sm max-w-[300px] truncate"
                    title={tx.rawDescription}
                  >
                    {tx.rawDescription}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tx.type === "credit"
                          ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                          : "border-rose-500/30 text-rose-500 bg-rose-500/10"
                      }
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${tx.type === "credit" ? "text-emerald-400" : "text-zinc-100"}`}
                  >
                    {tx.type === "credit" ? "+" : ""}₹
                    {tx.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

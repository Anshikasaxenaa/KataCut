"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // We log the error here. In a production setting with a real backend,
    // this would be sent to an error reporting service (Sentry, LogRocket, etc.)
    // However, to preserve zero-knowledge privacy, we scrub sensitive data or only log locally.
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
            We encountered an unexpected error. Your vault data is safe, but the
            app needs to reload.
          </p>
          <Button
            onClick={this.handleRetry}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload App
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

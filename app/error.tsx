"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Captured error:", error);
  }, [error]);

  return (
    /* REMOVED <html> and <body> */
    <div className="flex items-center justify-center p-4 min-h-[60vh]">
      <div className="max-w-lg w-full bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-tesla font-semibold text-gray-900 dark:text-white mb-3">
          Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {error.digest && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-tesla-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-tesla-gray-700 transition-colors duration-200 font-medium">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

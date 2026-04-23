"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/store-screenshots")) {
    return <>{children}</>;
  }
  return (
    <>
      <div className="relative z-10 mx-auto min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex flex-col items-center">
        <header className="mb-8 w-full max-w-6xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 sm:mt-6">
          <div className="w-full flex justify-center sm:justify-start">
            <Link
              href="/"
              className="inline-flex rounded-2xl items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Brewery home"
            >
              <span className="flex flex-col items-center sm:items-start">
                <Logo size="md" />
                <span
                  className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--accent-amber)]"
                  style={{ fontFamily: "var(--font-sans-ui)" }}
                >
                  Est. 2026
                </span>
              </span>
            </Link>
          </div>

          <div className="w-full flex justify-center sm:justify-end items-center gap-4 px-4 sm:px-0">
            <a
              href="https://buymeacoffee.com/damonphoenix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-amber)] transition-colors flex items-center gap-1.5"
            >
              <Coffee className="h-4 w-4" />
              Tip the Brewer
            </a>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}

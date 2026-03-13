"use client";

import { useState } from "react";
import { GeneratedAsset } from "@/types";
import { trackEvent } from "@/lib/analytics";
import { downloadAllAsZip } from "@/lib/zipBuilder";

interface DownloadControlsProps {
  assets: GeneratedAsset[];
}

export default function DownloadControls({ assets }: DownloadControlsProps) {
  const [downloading, setDownloading] = useState(false);

  if (assets.length === 0) return null;

  async function handleDownloadZip() {
    setDownloading(true);
    try {
      await downloadAllAsZip(assets);
      trackEvent("download_assets_zip", {
        asset_count: assets.length,
      });
    } catch {
      alert("Failed to create zip file. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {assets.length} assets ready
          </h3>
          <p className="text-xs text-dim mt-0.5">
            Includes correct Android resource directory structure
          </p>
        </div>
        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="w-full sm:w-auto rounded-lg bg-success px-6 py-2.5 text-sm font-semibold text-background transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] hover:bg-[#3ee8a8] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {downloading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating ZIP...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download ZIP
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

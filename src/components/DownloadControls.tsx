"use client";

import { useState } from "react";
import { GeneratedAsset } from "@/types";
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
    } catch {
      alert("Failed to create zip file. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button
        onClick={handleDownloadZip}
        disabled={downloading}
        className="w-full sm:w-auto rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? "Creating ZIP..." : `Download All as ZIP (${assets.length} files)`}
      </button>
      <span className="text-xs text-muted-foreground">
        Includes correct Android folder structure
      </span>
    </div>
  );
}

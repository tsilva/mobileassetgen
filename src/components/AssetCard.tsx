"use client";

import { GeneratedAsset } from "@/types";
import { downloadSingleAsset } from "@/lib/zipBuilder";

interface AssetCardProps {
  asset: GeneratedAsset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const { spec, dataUrl } = asset;
  const isSmall = spec.width <= 96;

  return (
    <div className="group rounded-lg border border-border-subtle bg-surface overflow-hidden card-hover">
      <div className="checkerboard flex items-center justify-center p-4 min-h-[100px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt={spec.name}
          width={isSmall ? spec.width * 2 : Math.min(spec.width, 200)}
          height={isSmall ? spec.height * 2 : Math.min(spec.height, 200)}
          className={`transition-transform duration-200 group-hover:scale-105 ${isSmall ? "pixelated" : ""}`}
          style={
            isSmall
              ? { imageRendering: "pixelated" }
              : { maxWidth: "100%", height: "auto" }
          }
        />
      </div>
      <div className="px-3 py-2.5 border-t border-border-subtle bg-surface">
        <p className="text-[11px] font-mono text-dim truncate leading-tight">
          {spec.zipPath}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] font-mono text-dim tabular-nums">
            {spec.width}&times;{spec.height}
          </span>
          <button
            onClick={() => downloadSingleAsset(asset)}
            className="opacity-0 group-hover:opacity-100 text-[11px] font-medium text-accent hover:text-accent-hover transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

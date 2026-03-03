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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="checkerboard flex items-center justify-center p-4 min-h-[100px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt={spec.name}
          width={isSmall ? spec.width * 2 : Math.min(spec.width, 200)}
          height={isSmall ? spec.height * 2 : Math.min(spec.height, 200)}
          className={isSmall ? "pixelated" : ""}
          style={
            isSmall
              ? { imageRendering: "pixelated" }
              : { maxWidth: "100%", height: "auto" }
          }
        />
      </div>
      <div className="px-3 py-2 border-t border-border">
        <p className="text-xs font-mono text-muted-foreground truncate">
          {spec.zipPath}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {spec.width}x{spec.height}
          </span>
          <button
            onClick={() => downloadSingleAsset(asset)}
            className="text-xs text-primary hover:text-primary-hover transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

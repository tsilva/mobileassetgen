"use client";

import { GeneratedAsset } from "@/types";
import { AssetCategory } from "@/types";
import {
  categoryOrder,
  categoryDisplayInfo,
} from "@/config/assetConfig";
import AssetCard from "./AssetCard";

interface AssetPreviewProps {
  assets: GeneratedAsset[];
}

const categoryIcons: Record<AssetCategory, string> = {
  "play-store": "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27z",
  "launcher-icons": "M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z",
  "round-icons": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  "notification-icons": "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  "feature-graphic": "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z",
};

export default function AssetPreview({ assets }: AssetPreviewProps) {
  if (assets.length === 0) return null;

  const assetsByCategory = new Map<AssetCategory, GeneratedAsset[]>();
  for (const asset of assets) {
    const cat = asset.spec.category;
    if (!assetsByCategory.has(cat)) {
      assetsByCategory.set(cat, []);
    }
    assetsByCategory.get(cat)!.push(asset);
  }

  return (
    <div className="space-y-10">
      {categoryOrder.map((category, catIdx) => {
        const categoryAssets = assetsByCategory.get(category);
        if (!categoryAssets || categoryAssets.length === 0) return null;

        const info = categoryDisplayInfo[category];

        return (
          <div
            key={category}
            className="animate-fade-in-up"
            style={{ animationDelay: `${catIdx * 80}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d={categoryIcons[category]} />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold font-display tracking-tight">
                  {info.label}
                </h3>
                <p className="text-xs text-dim">
                  {info.description}
                </p>
              </div>
            </div>
            <div
              className={
                category === "feature-graphic"
                  ? "grid grid-cols-1 gap-3"
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
              }
            >
              {categoryAssets.map((asset) => (
                <AssetCard key={asset.spec.id} asset={asset} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

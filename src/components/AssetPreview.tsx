"use client";

import { GeneratedAsset } from "@/types";
import { AssetCategory } from "@/types";
import {
  categoryOrder,
  categoryDisplayInfo,
  getSpecsByCategory,
} from "@/config/assetConfig";
import AssetCard from "./AssetCard";

interface AssetPreviewProps {
  assets: GeneratedAsset[];
}

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
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const categoryAssets = assetsByCategory.get(category);
        if (!categoryAssets || categoryAssets.length === 0) return null;

        const info = categoryDisplayInfo[category];

        return (
          <div key={category}>
            <div className="mb-3">
              <h3 className="text-lg font-semibold">{info.label}</h3>
              <p className="text-sm text-muted-foreground">
                {info.description}
              </p>
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

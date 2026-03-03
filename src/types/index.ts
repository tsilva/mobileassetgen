export type AssetTransform = "resize" | "circle-crop" | "silhouette";

export type AssetCategory =
  | "launcher-icons"
  | "round-icons"
  | "play-store"
  | "feature-graphic"
  | "notification-icons";

export type SourceImage = "logo" | "feature";

export interface AssetSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  category: AssetCategory;
  source: SourceImage;
  transform: AssetTransform;
  zipPath: string;
}

export interface GeneratedAsset {
  spec: AssetSpec;
  dataUrl: string;
}

export type GenerationPhase =
  | "idle"
  | "generating-logo"
  | "processing-assets"
  | "generating-feature"
  | "processing-feature"
  | "complete"
  | "error";

export interface GenerationState {
  phase: GenerationPhase;
  assets: GeneratedAsset[];
  logoDataUrl: string | null;
  featureDataUrl: string | null;
  error: string | null;
}

export type GenerationAction =
  | { type: "START_GENERATION" }
  | { type: "LOGO_GENERATED"; dataUrl: string }
  | { type: "ASSETS_PROCESSED"; assets: GeneratedAsset[] }
  | { type: "FEATURE_GENERATED"; dataUrl: string }
  | { type: "FEATURE_PROCESSED"; assets: GeneratedAsset[] }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

export interface CategoryDisplayInfo {
  label: string;
  description: string;
}

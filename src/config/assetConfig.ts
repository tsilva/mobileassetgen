import { AssetCategory, AssetSpec, CategoryDisplayInfo } from "@/types";

const densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"] as const;
const launcherSizes = [48, 72, 96, 144, 192];
const notificationSizes = [24, 36, 48, 72, 96];

function makeLauncherIcons(): AssetSpec[] {
  return densities.map((density, i) => ({
    id: `launcher-${density}`,
    name: `ic_launcher.png`,
    width: launcherSizes[i],
    height: launcherSizes[i],
    category: "launcher-icons" as AssetCategory,
    source: "logo" as const,
    transform: "resize" as const,
    zipPath: `mipmap-${density}/ic_launcher.png`,
  }));
}

function makeRoundIcons(): AssetSpec[] {
  return densities.map((density, i) => ({
    id: `round-${density}`,
    name: `ic_launcher_round.png`,
    width: launcherSizes[i],
    height: launcherSizes[i],
    category: "round-icons" as AssetCategory,
    source: "logo" as const,
    transform: "circle-crop" as const,
    zipPath: `mipmap-${density}/ic_launcher_round.png`,
  }));
}

function makeNotificationIcons(): AssetSpec[] {
  return densities.map((density, i) => ({
    id: `notification-${density}`,
    name: `ic_notification.png`,
    width: notificationSizes[i],
    height: notificationSizes[i],
    category: "notification-icons" as AssetCategory,
    source: "logo" as const,
    transform: "silhouette" as const,
    zipPath: `drawable-${density}/ic_notification.png`,
  }));
}

export const assetSpecs: AssetSpec[] = [
  ...makeLauncherIcons(),
  ...makeRoundIcons(),
  {
    id: "play-store-icon",
    name: "play_store_icon.png",
    width: 512,
    height: 512,
    category: "play-store",
    source: "logo",
    transform: "resize",
    zipPath: "play_store_icon.png",
  },
  {
    id: "feature-graphic",
    name: "feature_graphic.png",
    width: 1024,
    height: 500,
    category: "feature-graphic",
    source: "feature",
    transform: "resize",
    zipPath: "feature_graphic.png",
  },
  ...makeNotificationIcons(),
];

export const categoryDisplayInfo: Record<AssetCategory, CategoryDisplayInfo> = {
  "launcher-icons": {
    label: "Launcher Icons",
    description: "Standard app launcher icons for all screen densities",
  },
  "round-icons": {
    label: "Round Icons",
    description: "Circular launcher icons for devices that use round icons",
  },
  "play-store": {
    label: "Play Store Icon",
    description: "High-resolution icon for Google Play Store listing",
  },
  "feature-graphic": {
    label: "Feature Graphic",
    description: "Promotional banner displayed on your Play Store page",
  },
  "notification-icons": {
    label: "Notification Icons",
    description: "White silhouette icons used in the notification bar",
  },
};

export const categoryOrder: AssetCategory[] = [
  "play-store",
  "launcher-icons",
  "round-icons",
  "notification-icons",
  "feature-graphic",
];

export function getSpecsByCategory(
  category: AssetCategory
): AssetSpec[] {
  return assetSpecs.filter((s) => s.category === category);
}

export function getLogoSpecs(): AssetSpec[] {
  return assetSpecs.filter((s) => s.source === "logo");
}

export function getFeatureSpecs(): AssetSpec[] {
  return assetSpecs.filter((s) => s.source === "feature");
}

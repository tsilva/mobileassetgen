import { AssetSpec, GeneratedAsset } from "@/types";

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

export function resizeImage(
  img: HTMLImageElement,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // If aspect ratios differ, crop from center
  const srcAspect = img.width / img.height;
  const dstAspect = width / height;

  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (srcAspect > dstAspect) {
    // Source is wider — crop sides
    sw = img.height * dstAspect;
    sx = (img.width - sw) / 2;
  } else if (srcAspect < dstAspect) {
    // Source is taller — crop top/bottom
    sh = img.width / dstAspect;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

export function circleCropImage(
  img: HTMLImageElement,
  size: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Clip to circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw image centered
  const scale = size / Math.min(img.width, img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

  return canvas.toDataURL("image/png");
}

function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  return Math.sqrt(
    (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
  );
}

export function silhouetteImage(
  img: HTMLImageElement,
  size: number
): string {
  // First resize to target size
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const scale = size / Math.min(img.width, img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  // Sample corner pixels to detect background color
  const corners = [
    0, // top-left
    (size - 1) * 4, // top-right
    (size * (size - 1)) * 4, // bottom-left
    (size * size - 1) * 4, // bottom-right
  ];

  let bgR = 0,
    bgG = 0,
    bgB = 0;
  let count = 0;
  for (const idx of corners) {
    if (data[idx + 3] > 128) {
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      count++;
    }
  }

  if (count > 0) {
    bgR = Math.round(bgR / count);
    bgG = Math.round(bgG / count);
    bgB = Math.round(bgB / count);
  }

  const threshold = 100;

  // Convert: background → transparent, foreground → white
  for (let i = 0; i < data.length; i += 4) {
    const dist = colorDistance(
      data[i],
      data[i + 1],
      data[i + 2],
      bgR,
      bgG,
      bgB
    );

    if (dist < threshold) {
      // Background pixel → transparent
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else {
      // Foreground pixel → white, with graduated alpha
      const alpha = Math.min(255, Math.round((dist / threshold) * 255));
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function processAsset(
  sourceDataUrl: string,
  spec: AssetSpec
): Promise<GeneratedAsset> {
  const img = await loadImage(sourceDataUrl);

  let dataUrl: string;
  switch (spec.transform) {
    case "resize":
      dataUrl = resizeImage(img, spec.width, spec.height);
      break;
    case "circle-crop":
      dataUrl = circleCropImage(img, spec.width);
      break;
    case "silhouette":
      dataUrl = silhouetteImage(img, spec.width);
      break;
    default:
      throw new Error(`Unknown transform: ${spec.transform}`);
  }

  return { spec, dataUrl };
}

export async function processAllAssets(
  sourceDataUrl: string,
  specs: AssetSpec[]
): Promise<GeneratedAsset[]> {
  return Promise.all(specs.map((spec) => processAsset(sourceDataUrl, spec)));
}

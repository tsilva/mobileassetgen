import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratedAsset } from "@/types";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(",")[1];
}

export async function downloadAllAsZip(
  assets: GeneratedAsset[]
): Promise<void> {
  const zip = new JSZip();

  for (const asset of assets) {
    zip.file(asset.spec.zipPath, dataUrlToBase64(asset.dataUrl), {
      base64: true,
    });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "android-assets.zip");
}

export function downloadSingleAsset(asset: GeneratedAsset): void {
  const blob = dataUrlToBlob(asset.dataUrl);
  saveAs(blob, asset.spec.name);
}

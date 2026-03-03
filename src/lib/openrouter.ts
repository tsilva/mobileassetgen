const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-3.1-flash-image-preview";

interface GenerateImageOptions {
  aspectRatio?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImageUrl(data: any): string | null {
  const choice = data.choices?.[0];
  const message = choice?.message;

  // Format 1: message.images[] array (current OpenRouter format)
  const images = message?.images;
  if (Array.isArray(images) && images.length > 0) {
    const url = images[0]?.image_url?.url;
    if (url) {
      return url.startsWith("data:") ? url : `data:image/png;base64,${url}`;
    }
  }

  // Format 2: content as array of parts with image_url type
  const content = message?.content;
  if (Array.isArray(content)) {
    const imagePart = content.find(
      (p: { type?: string }) => typeof p === "object" && p.type === "image_url"
    );
    if (imagePart?.image_url?.url) {
      const url = imagePart.image_url.url as string;
      return url.startsWith("data:") ? url : `data:image/png;base64,${url}`;
    }

    // Format 3: inline_data format
    const inlineDataPart = content.find(
      (p: { type?: string }) => typeof p === "object" && p.type === "inline_data"
    );
    if (inlineDataPart?.inline_data?.data) {
      const mime = inlineDataPart.inline_data.mime_type || "image/png";
      return `data:${mime};base64,${inlineDataPart.inline_data.data}`;
    }
  }

  return null;
}

export async function generateImage(
  apiKey: string,
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  const { aspectRatio = "1:1" } = options;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      modalities: ["image", "text"],
      image_config: {
        aspect_ratio: aspectRatio,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `API request failed (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.error?.message || message;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  const data = await response.json();

  // Check for safety filter / content blocking
  const choice = data.choices?.[0];
  const finishReason = choice?.finish_reason;
  const nativeFinishReason = choice?.native_finish_reason;
  if (finishReason === "content_filter" || nativeFinishReason === "SAFETY") {
    throw new Error(
      "The image was blocked by the model's safety filter. Try a different description."
    );
  }

  const imageUrl = extractImageUrl(data);
  if (imageUrl) {
    return imageUrl;
  }

  throw new Error(
    `No image found in API response. The model may have returned text only. Raw: ${JSON.stringify(data).slice(0, 300)}`
  );
}

export function buildLogoPrompt(userPrompt: string): string {
  return `Generate a mobile app icon/logo based on this description: "${userPrompt}".
Requirements:
- Clean, simple design suitable for a mobile app icon
- Centered composition with good padding from edges
- Bold colors and clear shapes that remain recognizable at small sizes
- No text or letters in the icon
- Solid background color (not transparent)
- Professional, modern app icon style`;
}

export function buildFeaturePrompt(userPrompt: string): string {
  return `Generate a wide promotional banner/feature graphic for a mobile app. The app concept: "${userPrompt}".
Requirements:
- Landscape orientation, wide banner format
- Professional marketing-style graphic
- Can include the app concept visually but keep it clean
- Bold, eye-catching design with vibrant colors
- No text or words in the image
- Suitable as a Google Play Store feature graphic`;
}

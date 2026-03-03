"use client";

import { useReducer, useState, useCallback } from "react";
import {
  GenerationState,
  GenerationAction,
  GeneratedAsset,
} from "@/types";
import { getLogoSpecs, getFeatureSpecs } from "@/config/assetConfig";
import {
  generateImage,
  buildLogoPrompt,
  buildFeaturePrompt,
} from "@/lib/openrouter";
import { processAllAssets } from "@/lib/imageProcessor";
import Header from "@/components/Header";
import ApiKeyInput from "@/components/ApiKeyInput";
import PromptForm from "@/components/PromptForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AssetPreview from "@/components/AssetPreview";
import DownloadControls from "@/components/DownloadControls";

const initialState: GenerationState = {
  phase: "idle",
  assets: [],
  logoDataUrl: null,
  featureDataUrl: null,
  error: null,
};

function reducer(
  state: GenerationState,
  action: GenerationAction
): GenerationState {
  switch (action.type) {
    case "START_GENERATION":
      return {
        ...initialState,
        phase: "generating-logo",
      };
    case "LOGO_GENERATED":
      return {
        ...state,
        phase: "processing-assets",
        logoDataUrl: action.dataUrl,
      };
    case "ASSETS_PROCESSED":
      return {
        ...state,
        phase: "generating-feature",
        assets: action.assets,
      };
    case "FEATURE_GENERATED":
      return {
        ...state,
        phase: "processing-feature",
        featureDataUrl: action.dataUrl,
      };
    case "FEATURE_PROCESSED":
      return {
        ...state,
        phase: "complete",
        assets: [...state.assets, ...action.assets],
      };
    case "ERROR":
      return {
        ...state,
        phase: "error",
        error: action.message,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  const isGenerating =
    state.phase !== "idle" &&
    state.phase !== "complete" &&
    state.phase !== "error";

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim() || !prompt.trim()) return;

    dispatch({ type: "START_GENERATION" });

    try {
      // Step 1: Generate logo
      const logoPrompt = buildLogoPrompt(prompt);
      const logoDataUrl = await generateImage(apiKey, logoPrompt);
      dispatch({ type: "LOGO_GENERATED", dataUrl: logoDataUrl });

      // Step 2: Process all logo-derived assets
      const logoSpecs = getLogoSpecs();
      const logoAssets = await processAllAssets(logoDataUrl, logoSpecs);
      dispatch({ type: "ASSETS_PROCESSED", assets: logoAssets });

      // Step 3: Generate feature graphic
      const featurePrompt = buildFeaturePrompt(prompt);
      const featureDataUrl = await generateImage(apiKey, featurePrompt, {
        aspectRatio: "16:9",
      });
      dispatch({ type: "FEATURE_GENERATED", dataUrl: featureDataUrl });

      // Step 4: Process feature graphic
      const featureSpecs = getFeatureSpecs();
      const featureAssets = await processAllAssets(
        featureDataUrl,
        featureSpecs
      );
      dispatch({ type: "FEATURE_PROCESSED", assets: featureAssets });
    } catch (err) {
      dispatch({
        type: "ERROR",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }, [apiKey, prompt]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Header />

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <ApiKeyInput value={apiKey} onChange={setApiKey} />
            <PromptForm
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              disabled={!apiKey.trim() || !prompt.trim() || isGenerating}
              generating={isGenerating}
            />
          </div>

          <ProgressIndicator phase={state.phase} />

          {state.phase === "error" && state.error && (
            <div className="rounded-lg border border-error/50 bg-error/10 p-4">
              <p className="text-sm text-error">{state.error}</p>
              <button
                onClick={() => dispatch({ type: "RESET" })}
                className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {state.assets.length > 0 && (
            <>
              <DownloadControls assets={state.assets} />
              <AssetPreview assets={state.assets} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

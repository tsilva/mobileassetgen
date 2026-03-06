"use client";

import { useReducer, useState, useCallback, useEffect } from "react";
import { GenerationState, GenerationAction } from "@/types";
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
  platform: "android",
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
    case "SET_PLATFORM":
      return { ...state, platform: action.platform };
    default:
      return state;
  }
}

const STORAGE_KEY = "mobileassetgen-api-key";

function getInitialApiKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY) || "";
  }
  return "";
}

export default function Home() {
  const [apiKey, setApiKey] = useState(getInitialApiKey);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setIsLoaded(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [apiKey, isLoaded]);

  const isGenerating =
    state.phase !== "idle" &&
    state.phase !== "complete" &&
    state.phase !== "error";

  const hasKey = !!apiKey.trim();
  const showKeyInput = !hasKey || isEditingKey;

  const handleSettingsClick = useCallback(() => {
    setIsEditingKey(true);
  }, []);

  const handleKeyChange = useCallback((key: string) => {
    setApiKey(key);
    if (!key.trim()) {
      setIsEditingKey(true);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim() || !prompt.trim()) return;

    dispatch({ type: "START_GENERATION" });

    try {
      const logoPrompt = buildLogoPrompt(prompt);
      const logoDataUrl = await generateImage(apiKey, logoPrompt);
      dispatch({ type: "LOGO_GENERATED", dataUrl: logoDataUrl });

      const logoSpecs = getLogoSpecs();
      const logoAssets = await processAllAssets(logoDataUrl, logoSpecs);
      dispatch({ type: "ASSETS_PROCESSED", assets: logoAssets });

      const featurePrompt = buildFeaturePrompt(prompt);
      const featureDataUrl = await generateImage(apiKey, featurePrompt, {
        aspectRatio: "16:9",
      });
      dispatch({ type: "FEATURE_GENERATED", dataUrl: featureDataUrl });

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
    <div className="min-h-screen bg-background dot-grid relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <Header onSettingsClick={handleSettingsClick} showSettings={hasKey && !isEditingKey} />

        <div className="space-y-5">
          {/* Input card with gradient border */}
          <div
            className="animate-fade-in-up rounded-xl bg-surface p-6 sm:p-7 space-y-6 gradient-border"
            style={{ animationDelay: "240ms" }}
          >
            <ApiKeyInput value={apiKey} onChange={handleKeyChange} isEditing={showKeyInput} />
            {showKeyInput && <div className="h-px bg-border-subtle" />}
            <PromptForm
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              disabled={!apiKey.trim() || !prompt.trim() || isGenerating}
              generating={isGenerating}
              platform={state.platform}
              onPlatformChange={(platform) => dispatch({ type: "SET_PLATFORM", platform })}
            />
          </div>

          <ProgressIndicator phase={state.phase} />

          {state.phase === "error" && state.error && (
            <div className="rounded-xl border border-error/30 bg-error/5 p-5 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-error leading-relaxed">{state.error}</p>
                  <button
                    onClick={() => dispatch({ type: "RESET" })}
                    className="mt-2.5 text-sm text-muted hover:text-accent transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {state.assets.length > 0 && (
            <div className="space-y-8">
              <DownloadControls assets={state.assets} />
              <AssetPreview assets={state.assets} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          className="animate-fade-in-up mt-20 text-center"
          style={{ animationDelay: "320ms" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <p className="text-xs text-dim">
            All processing happens locally in your browser.
            No images are stored on any server.
          </p>
        </footer>
      </div>
    </div>
  );
}

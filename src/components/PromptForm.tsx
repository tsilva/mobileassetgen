"use client";

import { Platform } from "@/types";

interface PromptFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  generating: boolean;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export default function PromptForm({
  prompt,
  onPromptChange,
  onGenerate,
  disabled,
  generating,
  platform,
  onPlatformChange,
}: PromptFormProps) {
  const platforms: { value: Platform; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    {
      value: "android",
      label: "Android",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 16v-6a7 7 0 0 1 14 0v6" />
          <path d="M3 16h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
          <path d="M8 22v-4" />
          <path d="M16 22v-4" />
          <path d="M10 4v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
        </svg>
      ),
    },
    {
      value: "ios",
      label: "iOS (Not available yet)",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-1.5 0-2.5.5-3 1.5-.5-1-1.5-1.5-3-1.5-2.5 0-4.5 2-4.5 4.5 0 3 2.5 6 6 10 3.5-4 6-7 6-10 0-2.5-2-4.5-4.5-4.5-1 0-1.5.5-2 1-.5-.5-1-1-2-1z" />
          <path d="M12 21c3.5-4 6-7 6-10 0-2.5-2-4.5-4.5-4.5-1.5 0-2.5.5-3 1.5-.5-1-1.5-1.5-3-1.5-2.5 0-4.5 2-4.5 4.5 0 3 2.5 6 6 10z" />
        </svg>
      ),
      disabled: true,
    },
    {
      value: "web",
      label: "Web (Not available yet)",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      disabled: true,
    },
  ];

  const isAndroid = platform === "android";

  return (
    <div className="space-y-4">
      {/* Platform Selector */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Target Platform
        </label>
        <div className="relative">
          <select
            value={platform}
            onChange={(e) => onPlatformChange(e.target.value as Platform)}
            className="w-full appearance-none rounded-lg border border-border-subtle bg-elevated px-4 py-3 pl-11 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          >
            {platforms.map((p) => (
              <option key={p.value} value={p.value} disabled={p.disabled}>
                {p.label}
              </option>
            ))}
          </select>
          {/* Selected platform icon */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {platforms.find((p) => p.value === platform)?.icon}
          </div>
          {/* Chevron */}
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="space-y-2.5">
        <label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium text-foreground">
          <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Describe your app icon
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder='e.g. "A modern fitness app with a running figure silhouette in gradient blue and purple"'
          rows={3}
          className="w-full rounded-lg border border-border-subtle bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none transition-colors"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || !isAndroid}
        className={`
          w-full rounded-lg px-5 py-3 text-sm font-semibold transition-all
          disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
          ${generating
            ? "animate-shimmer text-background cursor-wait"
            : "bg-accent text-background hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(232,152,42,0.25)] active:scale-[0.98]"
          }
        `}
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Forging Assets...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Generate Assets
          </span>
        )}
      </button>
    </div>
  );
}

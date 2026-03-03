"use client";

interface PromptFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  generating: boolean;
}

export default function PromptForm({
  prompt,
  onPromptChange,
  onGenerate,
  disabled,
  generating,
}: PromptFormProps) {
  return (
    <div className="space-y-4">
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
        disabled={disabled}
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

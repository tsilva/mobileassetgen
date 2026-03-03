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
    <div className="space-y-2">
      <label htmlFor="prompt" className="block text-sm font-medium">
        Describe your app icon
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder='e.g. "A modern fitness app with a running figure silhouette in gradient blue and purple"'
        rows={3}
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      <button
        onClick={onGenerate}
        disabled={disabled}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
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
            Generating...
          </span>
        ) : (
          "Generate Assets"
        )}
      </button>
    </div>
  );
}

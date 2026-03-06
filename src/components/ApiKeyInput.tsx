"use client";

interface ApiKeyInputProps {
  value: string;
  onChange: (key: string) => void;
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function ApiKeyInput({ value, onChange, isEditing = true, onEdit }: ApiKeyInputProps) {
  const loaded = typeof window !== "undefined";

  if (!loaded) return null;

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span>API key saved</span>
        <span className="text-dim">•</span>
        <button 
          onClick={onEdit}
          className="text-accent hover:text-accent/80 transition-colors"
        >
          Click to change
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <label htmlFor="api-key" className="flex items-center gap-2 text-sm font-medium text-foreground">
        <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        OpenRouter API Key
      </label>
      <input
        id="api-key"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="sk-or-..."
        className="w-full rounded-lg border border-border-subtle bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
      />
      <p className="flex items-center gap-1.5 text-xs text-dim">
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Stored locally in your browser. Never sent to our servers.
      </p>
    </div>
  );
}

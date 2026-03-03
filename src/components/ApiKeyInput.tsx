"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mobileassetgen-api-key";

interface ApiKeyInputProps {
  value: string;
  onChange: (key: string) => void;
}

export default function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      onChange(stored);
    }
    setLoaded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loaded) return;
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [value, loaded]);

  return (
    <div className="space-y-2">
      <label htmlFor="api-key" className="block text-sm font-medium">
        OpenRouter API Key
      </label>
      <input
        id="api-key"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="sk-or-..."
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="text-xs text-muted-foreground">
        Your key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
}

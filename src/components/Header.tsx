"use client";

export default function Header() {
  return (
    <header className="relative text-center mb-16 pt-6">
      <div className="hero-glow" />

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface text-xs font-medium text-muted mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Android Asset Forge
        </div>
      </div>

      <h1
        className="animate-fade-in-up font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]"
        style={{ animationDelay: "80ms" }}
      >
        Mobile Asset
        <br />
        <span className="text-accent">Generator</span>
      </h1>

      <p
        className="animate-fade-in-up mt-5 text-muted max-w-md mx-auto text-lg leading-relaxed"
        style={{ animationDelay: "160ms" }}
      >
        Transform a single text prompt into every image asset
        your Android app needs to launch.
      </p>
    </header>
  );
}

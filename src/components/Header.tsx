"use client";

export default function Header() {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Mobile Asset Generator
      </h1>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Generate all image assets required to publish an Android app.
        Provide your OpenRouter API key and describe your app icon.
      </p>
    </header>
  );
}

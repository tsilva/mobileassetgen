"use client";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetIdOrEventName: string | Date,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function isGaEnabled() {
  return GA_MEASUREMENT_ID.length > 0;
}

export function trackPageView(url: string) {
  if (!isGaEnabled() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (!isGaEnabled() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, params);
}

import type { Lang } from "./i18n";

export type AnalyticsEvent = "page_view" | "click" | "add_to_cart" | "order_now" | "checkout";

export async function track(event: AnalyticsEvent, payload: { path: string; lang: Lang; product_slug?: string; meta?: any }) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, ...payload }),
    });
  } catch {
    // ignore
  }
}

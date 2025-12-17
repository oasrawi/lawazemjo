"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, cn } from "./ui";
import type { Lang } from "@/lib/i18n";
import { dir, isLang, t } from "@/lib/i18n";
import { cartCount, readCart } from "@/lib/cart";
import { track } from "@/lib/analytics";

function getLangFromSearch(): Lang {
  if (typeof window === "undefined") return "en";
  const params = new URLSearchParams(window.location.search);
  const l = params.get("lang");
  if (isLang(l)) return l;
  const stored = window.localStorage.getItem("whatsapp_catalog_lang");
  if (isLang(stored)) return stored;
  return "en";
}

function withLangLocal(path: string, lang: Lang) {
  const hasQuery = path.includes("?");
  return `${path}${hasQuery ? "&" : "?"}lang=${lang}`;
}

export function SiteShell({
  children,
  logoUrl,
  social,
  theme,
}: {
  children: React.ReactNode;
  logoUrl?: string | null;
  social?: { instagram?: string; tiktok?: string; snapchat?: string; x?: string } | null;
  theme?: { primary?: string; secondary?: string } | null;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const l = getLangFromSearch();
    setLang(l);
    window.localStorage.setItem("whatsapp_catalog_lang", l);
  }, []);

  useEffect(() => {
    const refresh = () => setCount(cartCount(readCart()));
    refresh();
    window.addEventListener("cart:changed", refresh);
    return () => window.removeEventListener("cart:changed", refresh);
  }, []);

  useEffect(() => {
    if (!theme) return;
    const r = document.documentElement;
    if (theme.primary) r.style.setProperty("--primary", theme.primary);
    if (theme.secondary) r.style.setProperty("--secondary", theme.secondary);
  }, [theme]);

  useEffect(() => {
    track("page_view", { path: window.location.pathname, lang });
  }, [lang]);

  const dict = useMemo(() => t(lang), [lang]);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "ar" : "en";
    setLang(next);
    window.localStorage.setItem("whatsapp_catalog_lang", next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState({}, "", url.toString());
  };

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966580488915";
  const waSupportUrl = `https://wa.me/${wa}`;

  return (
    <div className="min-h-screen" dir={dir(lang)}>
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href={withLangLocal("/", lang)} className="no-underline">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-xl object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-black/10" />
              )}
              <span className="text-sm font-extrabold tracking-tight">{process.env.NEXT_PUBLIC_SITE_NAME || "My Store"}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href={withLangLocal("/cart", lang)} className="no-underline">
              <Button variant="outline" className="relative">
                {dict.cart}
                {count > 0 ? (
                  <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--secondary)] px-2 text-xs font-extrabold text-white">
                    {count}
                  </span>
                ) : null}
              </Button>
            </Link>

            <Button variant="ghost" onClick={toggleLang} aria-label="Switch language">
              {lang === "en" ? "AR" : "EN"}
            </Button>

            <Link href="/admin" className="no-underline">
              <Button variant="ghost">{dict.admin}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-center justify-center gap-4 pt-6">
          {social?.instagram ? <SocialIcon href={social.instagram} label="Instagram" /> : null}
          {social?.tiktok ? <SocialIcon href={social.tiktok} label="TikTok" /> : null}
          {social?.snapchat ? <SocialIcon href={social.snapchat} label="Snapchat" /> : null}
          {social?.x ? <SocialIcon href={social.x} label="X" /> : null}
        </div>
      </footer>

      <a
        href={waSupportUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--secondary)] text-white shadow-lg no-underline",
          "hover:opacity-90 active:scale-[0.99]"
        )}
        aria-label="WhatsApp Support"
        onClick={() => track("click", { path: "/support", lang, meta: { target: "whatsapp_support" } })}
      >
        <span className="text-xl font-black">WA</span>
      </a>
    </div>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/5 text-xs font-bold no-underline hover:bg-black/10"
      aria-label={label}
      title={label}
    >
      {label[0]}
    </a>
  );
}

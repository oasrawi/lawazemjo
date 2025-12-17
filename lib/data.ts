import { supabaseServer } from "./supabase";

export type Settings = {
  logoUrl?: string | null;
  theme?: { primary?: string; secondary?: string } | null;
  social?: { instagram?: string; tiktok?: string; snapchat?: string; x?: string } | null;
};

export type Product = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category: "firewoods" | "other";
  price_jod: number;
  in_stock: boolean;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export async function getSettings(): Promise<Settings> {
  const sb = supabaseServer();
  const { data } = await sb.from("settings").select("key,value").in("key", ["branding", "social"]).throwOnError();
  const map = new Map<string, any>();
  (data ?? []).forEach((r: any) => map.set(r.key, r.value));
  const branding = map.get("branding") ?? {};
  const social = map.get("social") ?? {};
  return {
    logoUrl: branding.logoUrl ?? null,
    theme: branding.theme ?? null,
    social: social ?? null,
  };
}

export async function listProducts(opts?: { category?: "firewoods" | "other"; q?: string; inStockOnly?: boolean }) {
  const sb = supabaseServer();
  let query = sb.from("products").select("*").order("created_at", { ascending: false });
  if (opts?.category) query = query.eq("category", opts.category);
  if (opts?.inStockOnly) query = query.eq("in_stock", true);
  if (opts?.q) query = query.ilike("title_en", `%${opts.q}%`).or(`title_ar.ilike.%${opts.q}%`);
  const { data } = await query.throwOnError();
  return (data ?? []).map(normalizeProduct);
}

export async function getProductBySlug(slug: string) {
  const sb = supabaseServer();
  const { data } = await sb.from("products").select("*").eq("slug", slug).maybeSingle().throwOnError();
  return data ? normalizeProduct(data) : null;
}

function normalizeProduct(row: any): Product {
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    price_jod: Number(row.price_jod ?? 0),
  } as Product;
}

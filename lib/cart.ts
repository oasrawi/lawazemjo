import type { Lang } from "./i18n";

export type CartItem = {
  slug: string;
  title_en: string;
  title_ar: string;
  price_jod: number;
  qty: number;
};

const KEY = "whatsapp_catalog_cart_v1";
const NOTES_KEY = "whatsapp_catalog_notes_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:changed"));
}

export function readNotes(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NOTES_KEY) ?? "";
}

export function writeNotes(v: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTES_KEY, v);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cur = readCart();
  const idx = cur.findIndex((x) => x.slug === item.slug);
  if (idx >= 0) cur[idx].qty += qty;
  else cur.push({ ...item, qty });
  writeCart(cur);
}

export function setQty(slug: string, qty: number) {
  const cur = readCart();
  const idx = cur.findIndex((x) => x.slug === slug);
  if (idx < 0) return;
  cur[idx].qty = Math.max(1, Math.min(99, qty));
  writeCart(cur);
}

export function removeFromCart(slug: string) {
  writeCart(readCart().filter((x) => x.slug !== slug));
}

export function cartCount(items: CartItem[]) {
  return items.reduce((a, b) => a + b.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((a, b) => a + b.qty * b.price_jod, 0);
}

export function whatsappMessageForSingle(lang: Lang, item: CartItem, notes?: string) {
  if (lang === "ar") {
    const lines = ["السلام عليكم، أريد طلب:", `${item.title_ar} — ${formatJOD(item.price_jod)} دينار`];
    if (notes?.trim()) lines.push(`ملاحظات التوصيل: ${notes.trim()}`);
    return lines.join("\n");
  }
  const lines = ["Hi! I want to order:", `${item.title_en} — ${formatJOD(item.price_jod)} JOD`];
  if (notes?.trim()) lines.push(`Delivery notes: ${notes.trim()}`);
  return lines.join("\n");
}

export function whatsappMessageForCart(lang: Lang, items: CartItem[], notes?: string) {
  const total = cartTotal(items);
  if (lang === "ar") {
    const lines = ["السلام عليكم، أريد طلب هذه المنتجات:"];
    for (const it of items) lines.push(`- ${it.title_ar} x${it.qty} — ${formatJOD(it.price_jod * it.qty)} دينار`);
    lines.push(`الإجمالي: ${formatJOD(total)} دينار`);
    if (notes?.trim()) lines.push(`ملاحظات التوصيل: ${notes.trim()}`);
    return lines.join("\n");
  }
  const lines = ["Hi! I want to order these items:"];
  for (const it of items) lines.push(`- ${it.title_en} x${it.qty} — ${formatJOD(it.price_jod * it.qty)} JOD`);
  lines.push(`Total: ${formatJOD(total)} JOD`);
  if (notes?.trim()) lines.push(`Delivery notes: ${notes.trim()}`);
  return lines.join("\n");
}

export function formatJOD(v: number) {
  return (Math.round(v * 100) / 100).toFixed(2);
}

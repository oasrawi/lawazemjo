"use client";

import { Button } from "@/components/ui";
import { addToCart, formatJOD, whatsappMessageForSingle, readNotes } from "@/lib/cart";
import type { Lang } from "@/lib/i18n";
import { track } from "@/lib/analytics";

export default function ClientActions({
  lang,
  slug,
  title_en,
  title_ar,
  price_jod,
  in_stock,
}: {
  lang: Lang;
  slug: string;
  title_en: string;
  title_ar: string;
  price_jod: number;
  in_stock: boolean;
}) {
  const onAdd = () => {
    if (!in_stock) return;
    addToCart({ slug, title_en, title_ar, price_jod });
    track("add_to_cart", { path: `/products/${slug}`, lang, product_slug: slug });
  };

  const onOrder = () => {
    if (!in_stock) return;
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966580488915";
    const notes = readNotes();
    const msg = encodeURIComponent(
      whatsappMessageForSingle(lang, { slug, title_en, title_ar, price_jod, qty: 1 }, notes)
    );
    track("order_now", { path: `/products/${slug}`, lang, product_slug: slug });
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <>
      <Button variant="outline" onClick={onAdd} disabled={!in_stock}>
        {lang === "ar" ? "أضف للسلة" : "Add to cart"}
      </Button>
      <Button onClick={onOrder} disabled={!in_stock}>
        {lang === "ar" ? "اطلب الآن" : "Order now"}
      </Button>
    </>
  );
}

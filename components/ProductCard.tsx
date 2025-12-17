"use client";

import Link from "next/link";
import { Badge, Button, Card } from "./ui";
import type { Product } from "@/lib/data";
import type { Lang } from "@/lib/i18n";
import { addToCart, formatJOD } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { withLang } from "./SiteShell";

export function ProductCard({ p, lang }: { p: Product; lang: Lang }) {
  const title = lang === "ar" ? p.title_ar : p.title_en;
  const price = formatJOD(p.price_jod);

  const onAdd = () => {
    if (!p.in_stock) return;
    addToCart({ slug: p.slug, title_en: p.title_en, title_ar: p.title_ar, price_jod: p.price_jod });
    track("add_to_cart", { path: "/products", lang, product_slug: p.slug });
  };

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966580488915";
  const msg = encodeURIComponent(
    lang === "ar"
      ? `السلام عليكم، أريد طلب:\n${p.title_ar} — ${price} دينار`
      : `Hi! I want to order:\n${p.title_en} — ${price} JOD`
  );
  const waUrl = `https://wa.me/${wa}?text=${msg}`;

  const onOrderNow = () => {
    if (!p.in_stock) return;
    track("order_now", { path: "/products", lang, product_slug: p.slug });
    window.open(waUrl, "_blank");
  };

  return (
    <Card className="overflow-hidden">
      <Link href={withLang(`/products/${p.slug}`, lang)} className="no-underline">
        <div className="aspect-[4/3] w-full bg-black/5">
          {p.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images[0]} alt={title} className="h-full w-full object-cover" />
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold leading-snug">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-black/70">
              {price} {lang === "ar" ? "دينار" : "JOD"}
            </p>
          </div>
          {!p.in_stock ? <Badge>{lang === "ar" ? "غير متوفر" : "Out of stock"}</Badge> : null}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onAdd} disabled={!p.in_stock}>
            {lang === "ar" ? "أضف للسلة" : "Add to cart"}
          </Button>
          <Button onClick={onOrderNow} disabled={!p.in_stock}>
            {lang === "ar" ? "اطلب الآن" : "Order now"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

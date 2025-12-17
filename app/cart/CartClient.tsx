"use client";

import { Badge, Button, Card, Input } from "@/components/ui";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  cartTotal,
  formatJOD,
  readCart,
  readNotes,
  removeFromCart,
  setQty,
  whatsappMessageForCart,
  writeNotes,
} from "@/lib/cart";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { withLang } from "@/components/SiteShell";

export default function CartClient({ lang }: { lang: Lang }) {
  const dict = useMemo(() => t(lang), [lang]);
  const [items, setItems] = useState(readCart());
  const [notes, setNotes] = useState(readNotes());

  useEffect(() => {
    const refresh = () => setItems(readCart());
    window.addEventListener("cart:changed", refresh);
    return () => window.removeEventListener("cart:changed", refresh);
  }, []);

  const total = cartTotal(items);

  const onCheckout = () => {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966580488915";
    const msg = encodeURIComponent(whatsappMessageForCart(lang, items, notes));
    track("checkout", { path: "/cart", lang });
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-extrabold tracking-tight">{dict.cart}</h1>
        <Link href={withLang("/products", lang)} className="text-sm font-bold">
          {dict.continueShopping}
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="p-5">
          <p className="text-sm font-semibold">{dict.emptyCart}</p>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="grid gap-3">
            {items.map((it) => (
              <div key={it.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 p-3">
                <div>
                  <p className="text-sm font-extrabold">{lang === "ar" ? it.title_ar : it.title_en}</p>
                  <p className="mt-1 text-sm text-black/70">
                    {formatJOD(it.price_jod)} {lang === "ar" ? "دينار" : "JOD"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setQty(it.slug, it.qty - 1)}>-</Button>
                  <Badge>{dict.qty}: {it.qty}</Badge>
                  <Button variant="outline" onClick={() => setQty(it.slug, it.qty + 1)}>+</Button>
                  <Button variant="ghost" onClick={() => removeFromCart(it.slug)}>{dict.delete}</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-sm font-extrabold">{dict.deliveryNotes}</label>
            <Input
              className="mt-2"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                writeNotes(e.target.value);
              }}
              placeholder={lang === "ar" ? "مثال: الموقع، وقت مناسب..." : "e.g. location, preferred time..."}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-extrabold">
              {lang === "ar" ? "الإجمالي" : "Total"}: {formatJOD(total)} {lang === "ar" ? "دينار" : "JOD"}
            </p>
            <Button onClick={onCheckout}>{dict.checkout}</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

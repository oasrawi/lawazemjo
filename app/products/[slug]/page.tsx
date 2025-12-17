import { SiteShell } from "@/components/SiteShell";
import { Badge, Card } from "@/components/ui";
import { getProductBySlug, getSettings } from "@/lib/data";
import Link from "next/link";
import { formatJOD } from "@/lib/cart";
import ClientActions from "./ClientActions";
import { withLang } from "@/lib/links";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const pms = await params;
  const sp = await searchParams;

  const settings = await getSettings();
  const lang = (sp.lang === "ar" ? "ar" : "en") as "en" | "ar";

  const p = await getProductBySlug(pms.slug);

  if (!p) {
    return (
      <SiteShell logoUrl={settings.logoUrl} social={settings.social} theme={settings.theme}>
        <Card className="p-5">
          <p className="text-sm font-semibold">{lang === "ar" ? "المنتج غير موجود" : "Product not found"}</p>
          <Link href={withLang("/products", lang)} className="text-sm font-bold">
            {lang === "ar" ? "عودة" : "Back"}
          </Link>
        </Card>
      </SiteShell>
    );
  }

  const title = lang === "ar" ? p.title_ar : p.title_en;
  const desc = lang === "ar" ? p.description_ar : p.description_en;
  const price = formatJOD(p.price_jod);

  return (
    <SiteShell logoUrl={settings.logoUrl} social={settings.social} theme={settings.theme}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Link href={withLang("/products", lang)} className="text-sm font-bold">
            {lang === "ar" ? "← كل المنتجات" : "← All products"}
          </Link>
          {!p.in_stock ? <Badge>{lang === "ar" ? "غير متوفر" : "Out of stock"}</Badge> : null}
        </div>

        <Card className="overflow-hidden">
          <div className="aspect-[4/3] w-full bg-black/5">
            {p.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt={title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="p-5">
            <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm font-semibold text-black/70">
              {price} {lang === "ar" ? "دينار" : "JOD"}
            </p>
            {desc ? <p className="mt-3 text-sm text-black/70 whitespace-pre-line">{desc}</p> : null}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <ClientActions
                lang={lang}
                slug={p.slug}
                title_en={p.title_en}
                title_ar={p.title_ar}
                price_jod={p.price_jod}
                in_stock={p.in_stock}
              />
            </div>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}

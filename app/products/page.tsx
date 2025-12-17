import { SiteShell } from "@/components/SiteShell";
import { Card, Input, Select } from "@/components/ui";
import { listProducts, getSettings } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { withLang } from "@/lib/links";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; category?: string; q?: string; inStock?: string }>;
}) {
  const sp = await searchParams;

  const settings = await getSettings();
  const lang = (sp.lang === "ar" ? "ar" : "en") as "en" | "ar";

  const category =
    sp.category === "firewoods"
      ? "firewoods"
      : sp.category === "other"
      ? "other"
      : undefined;

  const q = sp.q ?? "";
  const inStockOnly = sp.inStock === "1";

  const products = await listProducts({ category: category as any, q: q || undefined, inStockOnly });

  const labels =
    lang === "ar"
      ? { title: "المنتجات", all: "كل المنتجات", fire: "حطب", other: "منتجات أخرى", inStock: "المتوفر فقط", search: "بحث" }
      : { title: "Products", all: "All Products", fire: "Firewoods", other: "Other Products", inStock: "In stock only", search: "Search" };

  return (
    <SiteShell logoUrl={settings.logoUrl} social={settings.social} theme={settings.theme}>
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-xl font-extrabold tracking-tight">{labels.title}</h1>
          <Link href={withLang("/", lang)} className="text-sm font-semibold">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
        </div>

        <Card className="p-4">
          <form className="grid gap-3 md:grid-cols-3" action="/products" method="get">
            <input type="hidden" name="lang" value={lang} />
            <div className="md:col-span-2">
              <Input name="q" defaultValue={q} placeholder={labels.search} />
            </div>
            <Select name="category" defaultValue={category ?? ""}>
              <option value="">{labels.all}</option>
              <option value="firewoods">{labels.fire}</option>
              <option value="other">{labels.other}</option>
            </Select>

            <label className="flex items-center gap-2 text-sm font-semibold text-black/70">
              <input name="inStock" value="1" defaultChecked={inStockOnly} type="checkbox" className="h-4 w-4" />
              {labels.inStock}
            </label>

            <div className="md:col-span-2" />
            <button className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-90">
              {lang === "ar" ? "تطبيق" : "Apply"}
            </button>
          </form>
        </Card>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} lang={lang} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

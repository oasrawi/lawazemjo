import { SiteShell } from "@/components/SiteShell";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { withLang } from "@/lib/links";

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const settings = await getSettings();
  const lang = (sp.lang === "ar" ? "ar" : "en") as "en" | "ar";

  const labels =
    lang === "ar"
      ? { all: "كل المنتجات", fire: "حطب", other: "منتجات أخرى" }
      : { all: "All Products", fire: "Firewoods", other: "Other Products" };

  return (
    <SiteShell logoUrl={settings.logoUrl} social={settings.social} theme={settings.theme}>
      <div className="grid gap-6">
        <Card className="p-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">{lang === "ar" ? "مرحباً" : "Welcome"}</h1>
            <p className="text-sm text-black/70">{lang === "ar" ? "اختر قسم المنتجات" : "Choose a product section"}</p>
          </div>

          <div className="mt-5 grid gap-3">
            <Link href={withLang("/products", lang)} className="no-underline">
              <Button className="w-full py-5 text-base">{labels.all}</Button>
            </Link>

            <Link href={withLang("/products?category=firewoods", lang)} className="no-underline">
              <Button variant="outline" className="w-full py-5 text-base">{labels.fire}</Button>
            </Link>

            <Link href={withLang("/products?category=other", lang)} className="no-underline">
              <Button variant="outline" className="w-full py-5 text-base">{labels.other}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}

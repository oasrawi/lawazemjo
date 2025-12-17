import { SiteShell } from "@/components/SiteShell";
import CartClient from "./CartClient";
import { getSettings } from "@/lib/data";

export default async function CartPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const lang = (sp.lang === "ar" ? "ar" : "en") as "en" | "ar";
  const settings = await getSettings();

  return (
    <SiteShell logoUrl={settings.logoUrl} social={settings.social} theme={settings.theme}>
      <CartClient lang={lang} />
    </SiteShell>
  );
}

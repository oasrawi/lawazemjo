import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await listProducts();
  const items: MetadataRoute.Sitemap = [
    { url: base + "/", lastModified: new Date() },
    { url: base + "/products", lastModified: new Date() },
    { url: base + "/cart", lastModified: new Date() },
  ];
  for (const p of products) items.push({ url: `${base}/products/${p.slug}`, lastModified: new Date(p.updated_at) });
  return items;
}

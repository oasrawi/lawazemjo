"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button, Card, Input, Select } from "@/components/ui";

type Product = {
  id?: string;
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
};

const empty: Product = {
  slug: "",
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  category: "other",
  price_jod: 0,
  in_stock: true,
  images: [],
  featured: false,
};

export default function AdminProducts() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [cur, setCur] = useState<Product>(empty);
  const [status, setStatus] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setStatus(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `p-${cur.slug || "product"}-${Date.now()}.${ext}`;
    const bucket = "product-images";
    const up = await sb.storage.from(bucket).upload(path, file, { upsert: true });
    if (up.error) return setStatus(up.error.message);
    const pub = sb.storage.from(bucket).getPublicUrl(path);
    setCur((c) => ({ ...c, images: [...(c.images ?? []), pub.data.publicUrl] }));
    setStatus("Image uploaded");
  };

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) window.location.href = "/admin/login";
    });
  }, [sb]);

  const load = async () => {
    const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    else setItems((data as any) ?? []);
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const save = async () => {
    setStatus(null);
    if (!cur.slug.trim()) return setStatus("Slug is required");

    const payload = {
      ...cur,
      images: cur.images ?? [],
      price_jod: Number(cur.price_jod ?? 0),
      updated_at: new Date().toISOString(),
    } as any;

    const { error } = cur.id
      ? await sb.from("products").update(payload).eq("id", cur.id)
      : await sb.from("products").insert(payload);

    if (error) setStatus(error.message);
    else {
      setStatus("Saved");
      setCur(empty);
      load();
    }
  };

  const del = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this product?")) return;
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) setStatus(error.message);
    else load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/admin")}>Back</Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Add / Edit</h2>
          <div className="mt-3 grid gap-2">
            <Input value={cur.slug} onChange={(e) => setCur({ ...cur, slug: e.target.value })} placeholder="slug (unique)" />
            <Input value={cur.title_en} onChange={(e) => setCur({ ...cur, title_en: e.target.value })} placeholder="Title EN" />
            <Input value={cur.title_ar} onChange={(e) => setCur({ ...cur, title_ar: e.target.value })} placeholder="Title AR" />
            <Input value={cur.description_en} onChange={(e) => setCur({ ...cur, description_en: e.target.value })} placeholder="Description EN" />
            <Input value={cur.description_ar} onChange={(e) => setCur({ ...cur, description_ar: e.target.value })} placeholder="Description AR" />

            <Select value={cur.category} onChange={(e) => setCur({ ...cur, category: e.target.value as any })}>
              <option value="firewoods">Firewoods</option>
              <option value="other">Other Products</option>
            </Select>

            <Input
              value={String(cur.price_jod)}
              onChange={(e) => setCur({ ...cur, price_jod: Number(e.target.value) })}
              placeholder="Price (JOD)"
              type="number"
              step="0.01"
            />

            <div className="grid gap-2">
              <Input
                value={(cur.images ?? []).join(",")}
                onChange={(e) =>
                  setCur({
                    ...cur,
                    images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="Images (URLs) — or upload below"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
              <p className="text-xs text-black/60">
                Create a PUBLIC Supabase bucket named <b>product-images</b>.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={cur.in_stock} onChange={(e) => setCur({ ...cur, in_stock: e.target.checked })} />
              In stock
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={cur.featured} onChange={(e) => setCur({ ...cur, featured: e.target.checked })} />
              Featured
            </label>

            {status ? <p className="text-sm font-semibold">{status}</p> : null}
            <Button onClick={save}>Save</Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Your products</h2>
          <div className="mt-3 grid gap-2">
            {items.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 p-3">
                <div>
                  <p className="text-sm font-extrabold">{p.title_en}</p>
                  <p className="text-xs text-black/70">{p.slug} • {p.category} • {p.in_stock ? "In stock" : "Out"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCur({ ...p, images: Array.isArray(p.images) ? p.images : [] })}>Edit</Button>
                  <Button variant="ghost" onClick={() => del(p.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

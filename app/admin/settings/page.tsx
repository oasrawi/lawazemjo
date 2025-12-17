"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";

type Branding = { logoUrl?: string; theme?: { primary?: string; secondary?: string } };
type Social = { instagram?: string; tiktok?: string; snapchat?: string; x?: string };

export default function AdminSettings() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [user, setUser] = useState<any>(null);
  const [branding, setBranding] = useState<Branding>({ logoUrl: "", theme: { primary: "#111827", secondary: "#0ea5e9" } });
  const [social, setSocial] = useState<Social>({ instagram: "", tiktok: "", snapchat: "", x: "" });
  const [status, setStatus] = useState<string | null>(null);

  const uploadLogo = async (file: File) => {
    setStatus(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `logo-${Date.now()}.${ext}`;
    const bucket = "branding";
    const up = await sb.storage.from(bucket).upload(path, file, { upsert: true });
    if (up.error) return setStatus(up.error.message);
    const pub = sb.storage.from(bucket).getPublicUrl(path);
    setBranding((b) => ({ ...b, logoUrl: pub.data.publicUrl }));
    setStatus("Logo uploaded");
  };

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) window.location.href = "/admin/login";
    });
  }, [sb]);

  const load = async () => {
    const { data, error } = await sb.from("settings").select("key,value").in("key", ["branding", "social"]);
    if (error) return setStatus(error.message);
    const map = new Map<string, any>();
    (data ?? []).forEach((r: any) => map.set(r.key, r.value));
    setBranding(map.get("branding") ?? branding);
    setSocial(map.get("social") ?? social);
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const save = async () => {
    setStatus(null);
    const upsert = async (key: string, value: any) =>
      sb.from("settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    const a = await upsert("branding", branding);
    if (a.error) return setStatus(a.error.message);
    const b = await upsert("social", social);
    if (b.error) return setStatus(b.error.message);

    setStatus("Saved");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-extrabold">Branding & Social</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/admin")}>Back</Button>
      </div>

      <div className="mt-6 grid gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Branding</h2>
          <div className="mt-3 grid gap-2">
            <div className="grid gap-2">
              <Input value={branding.logoUrl ?? ""} onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })} placeholder="Logo URL (auto-filled if you upload)" />
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
              <p className="text-xs text-black/60">Create a PUBLIC Supabase bucket named <b>branding</b>.</p>
            </div>

            <Input value={branding.theme?.primary ?? ""} onChange={(e) => setBranding({ ...branding, theme: { ...(branding.theme ?? {}), primary: e.target.value } })} placeholder="Primary color (hex)" />
            <Input value={branding.theme?.secondary ?? ""} onChange={(e) => setBranding({ ...branding, theme: { ...(branding.theme ?? {}), secondary: e.target.value } })} placeholder="Secondary color (hex)" />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Social icons</h2>
          <div className="mt-3 grid gap-2">
            <Input value={social.instagram ?? ""} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} placeholder="Instagram URL" />
            <Input value={social.tiktok ?? ""} onChange={(e) => setSocial({ ...social, tiktok: e.target.value })} placeholder="TikTok URL" />
            <Input value={social.snapchat ?? ""} onChange={(e) => setSocial({ ...social, snapchat: e.target.value })} placeholder="Snapchat URL" />
            <Input value={social.x ?? ""} onChange={(e) => setSocial({ ...social, x: e.target.value })} placeholder="X (Twitter) URL" />
          </div>
        </Card>

        {status ? <p className="text-sm font-semibold">{status}</p> : null}
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}

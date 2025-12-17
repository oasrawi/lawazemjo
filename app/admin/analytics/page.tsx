"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button, Card, Select } from "@/components/ui";

type Row = { event: string; path: string; lang: string; product_slug: string | null; created_at: string };

export default function AdminAnalytics() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [user, setUser] = useState<any>(null);
  const [days, setDays] = useState("7");
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) window.location.href = "/admin/login";
    });
  }, [sb]);

  const load = async () => {
    setStatus(null);
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await sb
      .from("analytics_events")
      .select("event,path,lang,product_slug,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) setStatus(error.message);
    else setRows((data as any) ?? []);
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, days]);

  const summary = useMemo(() => {
    const byEvent = new Map<string, number>();
    const byPath = new Map<string, number>();
    for (const r of rows) {
      byEvent.set(r.event, (byEvent.get(r.event) ?? 0) + 1);
      byPath.set(r.path, (byPath.get(r.path) ?? 0) + 1);
    }
    const topPaths = [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    return { byEvent, topPaths };
  }, [rows]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-extrabold">Analytics</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/admin")}>Back</Button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Select value={days} onChange={(e) => setDays(e.target.value)}>
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </Select>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>

      {status ? <p className="mt-3 text-sm font-semibold">{status}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Events</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {["page_view", "add_to_cart", "order_now", "checkout", "click"].map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="font-semibold">{k}</span>
                <span className="font-extrabold">{summary.byEvent.get(k) ?? 0}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-extrabold">Top pages</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {summary.topPaths.map(([p, n]) => (
              <div key={p} className="flex items-center justify-between gap-3">
                <span className="truncate font-semibold">{p}</span>
                <span className="font-extrabold">{n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-sm font-extrabold">Recent activity (last 500)</h2>
        <div className="mt-3 grid gap-2 text-xs">
          {rows.slice(0, 30).map((r, idx) => (
            <div key={idx} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 p-3">
              <span className="font-bold">{new Date(r.created_at).toLocaleString()}</span>
              <span className="font-extrabold">{r.event}</span>
              <span className="font-semibold">{r.path}</span>
              <span className="font-semibold">{r.lang}</span>
              {r.product_slug ? <span className="font-semibold">{r.product_slug}</span> : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

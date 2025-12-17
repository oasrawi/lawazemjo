"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";
import { Button, Card } from "@/components/ui";

export default function AdminHome() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const signOut = async () => {
    await sb.auth.signOut();
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-5">
          <h1 className="text-xl font-extrabold">Admin</h1>
          <p className="mt-2 text-sm text-black/70">Please sign in to edit products, theme, and view analytics.</p>
          <Link href="/admin/login" className="no-underline">
            <Button className="mt-4 w-full">Sign in</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Admin</h1>
          <p className="text-sm text-black/70">Signed in as {user.email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/products" className="no-underline">
          <Card className="p-5 hover:bg-black/5">
            <p className="text-sm font-extrabold">Products</p>
            <p className="mt-1 text-sm text-black/70">Add / edit products, stock, images.</p>
          </Card>
        </Link>
        <Link href="/admin/settings" className="no-underline">
          <Card className="p-5 hover:bg-black/5">
            <p className="text-sm font-extrabold">Branding & Social</p>
            <p className="mt-1 text-sm text-black/70">Logo + colors + social icon links.</p>
          </Card>
        </Link>
        <Link href="/admin/analytics" className="no-underline">
          <Card className="p-5 hover:bg-black/5">
            <p className="text-sm font-extrabold">Analytics</p>
            <p className="mt-1 text-sm text-black/70">Basic page views and actions.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

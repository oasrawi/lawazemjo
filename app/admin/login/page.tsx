"use client";

import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";

export default function AdminLogin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const signIn = async () => {
    setMsg(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else window.location.href = "/admin";
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-5">
        <h1 className="text-xl font-extrabold">Sign in</h1>
        <p className="mt-1 text-sm text-black/70">Use the admin user you created in Supabase Auth.</p>
        <div className="mt-4 grid gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          {msg ? <p className="text-sm font-semibold text-red-600">{msg}</p> : null}
          <Button onClick={signIn}>Sign in</Button>
        </div>
      </Card>
    </div>
  );
}

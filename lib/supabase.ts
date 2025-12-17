import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseBrowser = () => createClient(url, anon);

export const supabaseServer = () => {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) return createClient(url, anon);
  return createClient(url, service);
};

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase";

const schema = z.object({
  event: z.enum(["page_view", "click", "add_to_cart", "order_now", "checkout"]),
  path: z.string().min(1),
  lang: z.enum(["en", "ar"]),
  product_slug: z.string().optional(),
  meta: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

    const sb = supabaseServer(); // uses service role if provided, else anon
    await sb.from("analytics_events").insert({
      event: parsed.data.event,
      path: parsed.data.path,
      lang: parsed.data.lang,
      product_slug: parsed.data.product_slug ?? null,
      meta: parsed.data.meta ?? {},
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // don't break UX
  }
}

# WhatsApp Catalog (EN/AR) + Admin Editor + Basic Analytics (Next.js 15)

## What this is
- Mobile-first catalog website (English + Arabic RTL)
- Categories: Firewoods, Other Products (+ All Products view)
- Cart + WhatsApp checkout (no payments)
- Admin editor: products, stock, colors, social icons
- Basic analytics dashboard

## 1) Supabase setup
1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` (Supabase SQL editor).
3. In **Authentication**, create an admin user (email/password).
4. In **Storage**, create PUBLIC buckets:
   - `branding` (logo uploads)
   - `product-images` (product photos)

## 2) Local setup
```bash
cp .env.example .env.local
npm i
npm run dev
```

Set these in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended)
- `NEXT_PUBLIC_WHATSAPP_NUMBER=966580488915`
- `NEXT_PUBLIC_SITE_NAME=Your Brand Name`
- `NEXT_PUBLIC_SITE_URL` (your deployed URL)

## 3) Use the editor
- `/admin` → sign in
- Products: `/admin/products`
- Branding + social: `/admin/settings`
- Analytics: `/admin/analytics`

## 4) Deploy + Wix domain
- Push to GitHub
- Deploy on Vercel (Framework: Next.js)
- Add env vars in Vercel (same names as .env)
- Connect your Wix-bought domain in Vercel → Domains, then copy DNS records into Wix DNS.

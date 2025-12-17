# WhatsApp Catalog (EN/AR) + Admin Editor + Basic Analytics

## What this is
- Mobile-first catalog website (English + Arabic RTL)
- Categories: Firewoods, Other Products (+ All Products)
- Cart + WhatsApp checkout (no payments)
- Admin editor: products, stock, colors, social icons
- Basic analytics: page views + add-to-cart + order-now + checkout

## Prereqs
- Node 18+
- A Supabase project

## 1) Supabase setup
1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` (SQL editor).
3. In **Authentication**, create an admin user (email/password).
4. In **Storage**, create buckets (optional for now):
   - `product-images`
   - `branding`

> Note: In this starter, admin uses Auth "authenticated" RLS checks. You can later harden policies to only allow your user.

## 2) Local setup
```bash
cp .env.example .env.local
npm i
npm run dev
```

Set these in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended so `/api/track` always inserts even if anon key changes)
- `NEXT_PUBLIC_WHATSAPP_NUMBER=966580488915`
- `NEXT_PUBLIC_SITE_NAME=Your Brand Name`
- Optional: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

## 3) Add products
Open:
- http://localhost:3000/admin
Login → Products → add items

## 4) Change logo/colors/social
Admin → Branding & Social

## 5) Deploy + domain
- Push to GitHub
- Deploy on Vercel
- Add env vars in Vercel
- Connect your purchased domain in Vercel settings

## Notes
- Currency is shown as JOD.
- WhatsApp messages include product names (and cart contents).

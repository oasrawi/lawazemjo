# WhatsApp Catalog (EN/AR) + Admin Editor + Basic Analytics (Next.js 15)

This is a mobile-first product catalog with:
- English + Arabic (RTL)
- Categories: Firewoods, Other Products, All Products
- Cart + WhatsApp checkout (no online payments)
- Admin editor: products, stock, logo, colors, social icons
- Basic analytics dashboard

## Supabase (free)
1) Create a Supabase project
2) Run `supabase/schema.sql` in SQL editor
3) Auth → create admin user (email/password)
4) Storage → create PUBLIC buckets:
   - `branding`
   - `product-images`

## Vercel deploy
Add env vars in Vercel Project Settings:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (recommended)
- NEXT_PUBLIC_WHATSAPP_NUMBER=966580488915
- NEXT_PUBLIC_SITE_NAME=Your Brand Name
- NEXT_PUBLIC_SITE_URL=https://YOURDOMAIN

Then redeploy.

## Admin
- /admin (login)
- /admin/products
- /admin/settings
- /admin/analytics

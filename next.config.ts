import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow Supabase storage URLs
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;

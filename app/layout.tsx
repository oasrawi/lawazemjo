import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_SITE_NAME || "My Store", template: "%s • " + (process.env.NEXT_PUBLIC_SITE_NAME || "My Store") },
  description: "WhatsApp ordering catalog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

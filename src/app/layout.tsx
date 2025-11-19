import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Project Manager | Caltrans, Grants & Engagement Platform",
  description:
    "Multi-tenant planning management SaaS with Caltrans LAPM tracking, grant workflows, CEQA compliance, and community engagement tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const appSans = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
});

const appMono = JetBrains_Mono({
  variable: "--font-app-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Manager | Caltrans, Grants & Engagement Platform",
  description:
    "Multi-tenant planning management SaaS with Caltrans LAPM tracking, grant workflows, CEQA compliance, and community engagement tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", appSans.variable, appMono.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

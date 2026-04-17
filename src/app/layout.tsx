import type { Metadata } from "next";
import { AnalyticsRouteTracker } from "@/components/analytics/analytics-route-tracker";
import { prototypeMono, prototypeSans } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medscape AI Prototype Workspace",
  description: "Figma-driven prototyping workspace for product features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${prototypeSans.variable} ${prototypeMono.variable} antialiased`}>
        <AnalyticsRouteTracker />
        {children}
      </body>
    </html>
  );
}

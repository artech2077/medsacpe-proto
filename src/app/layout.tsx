import type { Metadata } from "next";
import { AnalyticsRouteTracker } from "@/components/analytics/analytics-route-tracker";
import { prototypeDisplay, prototypeMono, prototypeSans } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medscape AI",
  description: "Figma-driven prototyping workspace for product features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${prototypeSans.variable} ${prototypeMono.variable} ${prototypeDisplay.variable} antialiased`}>
        <AnalyticsRouteTracker />
        {children}
      </body>
    </html>
  );
}

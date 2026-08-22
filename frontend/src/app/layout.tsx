import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/shared/app-providers";

export const metadata: Metadata = {
  title: { default: "GlobeTrotter", template: "%s · GlobeTrotter" },
  description: "A calmer way to plan unforgettable journeys.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

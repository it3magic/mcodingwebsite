import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "M Coding | BMW & MINI Specialist Ireland | Servicing, Coding, Remapping",
  description: "Ireland's first complete BMW & MINI specialist. BMW-registered servicing, coding, performance remapping, and OEM retrofitting. Expert care for your BMW or MINI.",
  keywords: "BMW specialist Ireland, BMW coding Ireland, BMW remap Ireland, MINI coding Ireland, BMW retrofitting Ireland, BMW servicing Ireland, MINI specialist Ireland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans">
        <ClientBody>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClientBody>
      </body>
    </html>
  );
}

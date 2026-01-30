import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Headlight Comparison Template | M Coding Ireland",
  description: "BMW F10 Pre-LCI Xenon Headlight Comparison - Non-Adaptive vs Adaptive",
};

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="antialiased font-sans bg-[#121212]">
        {children}
      </body>
    </html>
  );
}

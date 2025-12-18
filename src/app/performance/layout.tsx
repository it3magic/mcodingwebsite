import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Remapping | BMW & MINI ECU Tuning Ireland",
  description: "Expert BMW & MINI performance remapping and ECU tuning. Safe, reliable power gains with Stage 1 & Stage 2 remaps, transmission tuning, and custom performance solutions.",
  keywords: "BMW remap Ireland, MINI remap, ECU tuning, performance tuning, Stage 1 remap, Stage 2 remap, BMW tuning, MINI tuning, XHP transmission, DPF delete, EGR delete",
  openGraph: {
    title: "BMW & MINI Performance Remapping | M Coding Ireland",
    description: "Expert BMW & MINI performance remapping and ECU tuning. Safe, reliable power gains with custom performance solutions.",
    url: "https://m-coding.ie/performance",
    type: "website",
    images: [
      {
        url: "/newservice-hero.jpg",
        width: 1200,
        height: 630,
        alt: "M Coding Performance Remapping - BMW & MINI Specialist",
      },
    ],
  },
};

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

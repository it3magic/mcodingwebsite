import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | BMW & MINI Servicing, Coding, Remapping",
  description: "Expert BMW & MINI services: premium servicing, advanced coding, performance remapping, and OEM retrofitting. BMW-registered specialist in Ireland.",
  keywords: "BMW servicing Ireland, MINI servicing, BMW coding, MINI coding, BMW remap, performance tuning, BMW retrofitting, BMW diagnostic, XHP transmission, region change",
  openGraph: {
    title: "BMW & MINI Services | M Coding Ireland",
    description: "Expert BMW & MINI services: premium servicing, advanced coding, performance remapping, and OEM retrofitting.",
    url: "https://m-coding.ie/services",
    type: "website",
    images: [
      {
        url: "/newservice-hero.jpg",
        width: 1200,
        height: 630,
        alt: "M Coding Services - BMW & MINI Specialist",
      },
    ],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

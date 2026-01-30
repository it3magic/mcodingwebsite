import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://m-coding.ie'),
  title: {
    default: "M Coding | BMW & MINI Specialist Ireland | Servicing, Coding, Remapping",
    template: "%s | M Coding Ireland"
  },
  description: "Ireland's first complete BMW & MINI specialist. BMW-registered servicing, coding, performance remapping, and OEM retrofitting. Expert care for your BMW or MINI.",
  keywords: "BMW specialist Ireland, BMW coding Ireland, BMW remap Ireland, MINI coding Ireland, BMW retrofitting Ireland, BMW servicing Ireland, MINI specialist Ireland, BMW region change, XHP transmission, Apple CarPlay BMW, BMW headlight repair, ambient lighting BMW",
  authors: [{ name: "M Coding Ireland" }],
  creator: "M Coding Ireland",
  publisher: "M Coding Ireland",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://m-coding.ie',
    siteName: 'M Coding Ireland',
    title: 'M Coding | BMW & MINI Specialist Ireland',
    description: "Ireland's first complete BMW & MINI specialist. BMW-registered servicing, coding, performance remapping, and OEM retrofitting.",
    images: [
      {
        url: '/m-logo.png',
        width: 1200,
        height: 630,
        alt: 'M Coding Ireland - BMW & MINI Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M Coding | BMW & MINI Specialist Ireland',
    description: "Ireland's first complete BMW & MINI specialist. BMW-registered servicing, coding, performance remapping, and OEM retrofitting.",
    images: ['/m-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you set them up
    google: 'JtITfLrejjQV9Qx3-jUSXTiV122ebEZFMrVBhWIzksM',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": "M Coding Ireland",
    "image": "https://m-coding.ie/m-logo.png",
    "description": "Ireland's first complete BMW & MINI specialist. BMW-registered servicing, coding, performance remapping, and OEM retrofitting.",
    "url": "https://m-coding.ie",
    "telephone": "+353876096830",
    "email": "mcodingireland@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ardfinnan",
      "addressLocality": "Ardfinnan",
      "addressRegion": "Co. Tipperary",
      "postalCode": "E91YX50",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.3537",
      "longitude": "-7.8976"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "€€",
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "BMW Servicing",
          "description": "Professional BMW servicing using premium oils and high-quality filters"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "BMW Coding",
          "description": "Advanced coding services to unlock features and customize settings"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Performance Remapping",
          "description": "Safe, reliable ECU tuning for optimized power delivery and efficiency"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "OEM Retrofitting",
          "description": "Factory-quality upgrades and retrofits using genuine BMW parts"
        }
      }
    ],
    "sameAs": [
      "https://www.facebook.com/mcodingireland"
    ]
  };

  // Aggregate review schema for star ratings in search results
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "M Coding Ireland",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "27",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Michael Brennan"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Ireland's best BMW specialist, hands down. From servicing to coding, they do it all. Transparent pricing, excellent communication, and expert knowledge. 5 stars!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Daniel Nieroda"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "I always use Mcoding for all my BMWs. They've been taking care of my cars for a long time, always making sure everything is in top condition and serviced on time. Reliable, professional, and truly passionate about what they do."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Joan Lestor-O'Connell"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Extremely professional and knowledgeable service. The team went above and beyond to explain everything and ensure my BMW was running perfectly."
      }
    ]
  };

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-D07C7WVDEH"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D07C7WVDEH');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans">
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
        <ClientBody>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatBot />
        </ClientBody>
        {/* Hidden Netlify form for blog newsletter */}
        <form name="blog-newsletter" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="blog-newsletter" />
          <input type="hidden" name="bot-field" />
          <input type="email" name="email" />
        </form>
      </body>
    </html>
  );
}

import { Metadata } from "next";
import { products } from "../products-data";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | M Coding Ireland",
      description: "The requested product could not be found.",
    };
  }

  const title = product.seoTitle || `${product.name} | M Coding Ireland`;
  const description = product.seoDescription || product.description;
  const keywords = product.seoKeywords?.join(", ") || product.category;
  const imageUrl = product.images[0]?.startsWith("/")
    ? `https://m-coding.ie${product.images[0]}`
    : product.images[0];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://m-coding.ie/products/${product.slug}`,
      siteName: "M Coding Ireland",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_IE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://m-coding.ie/products/${product.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}

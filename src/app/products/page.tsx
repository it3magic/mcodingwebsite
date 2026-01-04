import Link from "next/link";
import { ProductCard } from "./product-card";
import { products } from "./products-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | BMW & MINI Parts & Accessories",
  description: "Shop premium BMW and MINI parts, accessories, and performance upgrades. Region change, Apple CarPlay, XHP transmission, headlight repair, ambient lighting, and more.",
  keywords: "BMW parts Ireland, MINI accessories, BMW performance parts, BMW region change, Apple CarPlay BMW, XHP transmission, BMW headlight repair, ambient lighting BMW, BMW reversing camera",
  openGraph: {
    title: "BMW & MINI Products | M Coding Ireland",
    description: "Premium BMW and MINI parts, accessories, and performance upgrades. Region change, Apple CarPlay, XHP transmission, and more.",
    url: "https://m-coding.ie/products",
    type: "website",
    images: [
      {
        url: "/products3-hero.jpg",
        width: 1200,
        height: 630,
        alt: "M Coding Products - BMW & MINI Parts",
      },
    ],
  },
};


export default function ProductsPage() {
  // Generate ItemList Schema (JSON-LD) for product catalog
  const itemListSchema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "name": "BMW & MINI Parts & Accessories",
    "description": "Premium BMW and MINI parts, accessories, and performance upgrades",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "image": product.images[0],
        "description": product.description,
        "url": `https://m-coding.ie/products/${product.slug}`,
        "offers": {
          "@type": "Offer",
          "price": product.price.replace(/[€,]/g, '').split(' ')[0].trim(),
          "priceCurrency": "EUR",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
        }
      }
    }))
  };

  return (
    <div className="pt-20">
      {/* JSON-LD Schema Markup for Product Catalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero - Full Width with Products Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/products3-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Shop Now</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Premium BMW & MINI
              <br />
              <span className="text-gradient">Parts & Accessories</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              High-quality products and performance upgrades to enhance your BMW or MINI experience
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          {/* Featured Products */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(p => p.featured).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* All Products */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              All <span className="text-gradient">Products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl z-10" />
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for expert advice on the right parts and accessories for your BMW or MINI
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
          >
            <span>Contact Us</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

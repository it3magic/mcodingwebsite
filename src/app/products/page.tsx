import Link from "next/link";
import { ProductCard } from "./product-card";
import { products } from "./products-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | M Coding BMW & MINI Parts & Accessories",
  description: "Shop premium BMW and MINI parts, accessories, and performance upgrades at M Coding Ireland.",
  keywords: "BMW parts Ireland, MINI accessories, BMW performance parts, M Coding shop",
};


export default function ProductsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-black to-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full">
              <span className="text-sm font-semibold text-gradient">Shop Now</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              BMW & MINI <span className="text-gradient">Products</span>
            </h1>
            <p className="text-xl text-gray-300">
              Premium parts, accessories, and performance upgrades for your BMW or MINI
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-zinc-950">
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

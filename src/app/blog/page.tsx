import Link from "next/link";
import { blogPosts, getAllCategories } from "./blog-data";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import BlogNewsletter from "@/components/blog-newsletter";

export const metadata: Metadata = {
  title: "Blog | BMW & MINI Servicing Tips & Guides",
  description: "Expert advice on BMW servicing, coding, performance remapping, and importing vehicles to Ireland. Tips from M Coding Ireland specialists.",
  keywords: "BMW blog, BMW tips, BMW servicing guide, BMW coding, BMW import guide, performance remapping",
  openGraph: {
    title: "BMW & MINI Blog | M Coding Ireland",
    description: "Expert advice on BMW servicing, coding, performance remapping, and importing vehicles to Ireland.",
    url: "https://m-coding.ie/blog",
    siteName: "M Coding Ireland",
    images: [
      {
        url: "https://m-coding.ie/m-logo.png",
        width: 1200,
        height: 630,
        alt: "M Coding Ireland - BMW & MINI Specialists",
      },
    ],
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMW & MINI Blog | M Coding Ireland",
    description: "Expert advice on BMW servicing, coding, performance remapping, and importing vehicles to Ireland.",
    images: ["https://m-coding.ie/m-logo.png"],
    creator: "@mcodingireland",
  },
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const categories = getAllCategories();
  const params = await searchParams;
  const selectedCategory = params?.category;

  // Filter posts by category if one is selected
  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase())
    : blogPosts;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Expert Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              BMW & MINI
              <br />
              <span className="text-gradient">Tips & Guides</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Expert advice on servicing, coding, performance, and everything BMW
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-zinc-950 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category.toLowerCase()}`}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory?.toLowerCase() === category.toLowerCase()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Featured Image */}
                <div className="relative h-64 bg-zinc-800/50 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-8">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(post.publishDate).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-6">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                      >
                        <Tag size={12} />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Posts Message (if filtering results in empty) */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No blog posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <BlogNewsletter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Expert BMW Service?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            From servicing to coding to performance - we're Ireland's BMW & MINI specialists
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
            >
              <span>View Services</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 border border-white/20 text-white text-lg font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { getBlogPostBySlug, blogPosts } from "../blog-data";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, User } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import BlogNewsletter from "@/components/blog-newsletter";
import BlogSocialShare from "@/components/blog-social-share";

// Helper function to generate IDs from heading text for anchor links
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts
    .filter((post) => post && post.slug)
    .map((post) => ({
      slug: post.slug,
    }));
}

// Don't generate pages for slugs not returned by generateStaticParams
export const dynamicParams = false;

// Generate metadata for social sharing
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://m-coding.ie/blog/${post.slug}`;
  const imageUrl = `https://m-coding.ie${post.featuredImage}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      siteName: 'M Coding Ireland',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_IE',
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.lastModified,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: '@mcodingireland',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // Generate Article Schema (JSON-LD) for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://m-coding.ie${post.featuredImage}`,
    "datePublished": post.publishDate,
    "dateModified": post.lastModified,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://m-coding.ie"
    },
    "publisher": {
      "@type": "Organization",
      "name": "M Coding Ireland",
      "logo": {
        "@type": "ImageObject",
        "url": "https://m-coding.ie/m-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://m-coding.ie/blog/${post.slug}`
    },
    "keywords": post.tags.join(", "),
    "articleSection": post.category
  };

  // Generate BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://m-coding.ie"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://m-coding.ie/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://m-coding.ie/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="pt-20 min-h-screen bg-black">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-zinc-950 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{new Date(post.publishDate).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 bg-zinc-800/50 rounded-xl overflow-hidden mb-12">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <ReactMarkdown
                components={{
                  h1: ({node, children, ...props}) => {
                    const text = children?.toString() || '';
                    const id = generateId(text);
                    return <h1 id={id} className="text-4xl font-bold text-white mt-8 mb-4 scroll-mt-24" {...props}>{children}</h1>;
                  },
                  h2: ({node, children, ...props}) => {
                    const text = children?.toString() || '';
                    const id = generateId(text);
                    return <h2 id={id} className="text-3xl font-bold text-white mt-8 mb-4 scroll-mt-24" {...props}>{children}</h2>;
                  },
                  h3: ({node, children, ...props}) => {
                    const text = children?.toString() || '';
                    const id = generateId(text);
                    return <h3 id={id} className="text-2xl font-bold text-white mt-6 mb-3 scroll-mt-24" {...props}>{children}</h3>;
                  },
                  p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="border-t border-white/10 pt-8 mb-12">
              <h3 className="text-lg font-semibold text-white mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300"
                  >
                    <Tag size={16} />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Share */}
            <BlogSocialShare
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <BlogNewsletter />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">
                Related <span className="text-gradient">Articles</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="relative h-48 bg-zinc-800/50 overflow-hidden">
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                        {relatedPost.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(relatedPost.publishDate).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                        <span>Read More</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Expert BMW Service?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get in touch for professional servicing, coding, and performance upgrades
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
          >
            <span>Contact Us</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

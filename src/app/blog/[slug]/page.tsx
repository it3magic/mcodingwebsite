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
                  strong: ({node, children, ...props}) => {
                    // Check if the strong element contains a link - if so, render just the children (link will be styled as button)
                    const hasLink = node?.children?.some((child: { type?: string; tagName?: string }) => child.type === 'element' && child.tagName === 'a');
                    if (hasLink) {
                      return <>{children}</>;
                    }
                    return <strong className="text-white font-bold" {...props}>{children}</strong>;
                  },
                  a: ({node, href, children, ...props}) => {
                    const linkText = children?.toString() || '';
                    const isCtaLink = linkText.includes('View') || linkText.includes('Contact') || linkText.includes('Book') || linkText.includes('Get') || linkText.includes('Learn') || linkText.includes('Read') || linkText.includes('See') || linkText.includes('Explore') || linkText.includes('Discover') || linkText.includes('Check');
                    const isWhatsAppLink = href?.includes('wa.me');

                    // Render as WhatsApp button
                    if (isWhatsAppLink && href) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/20 no-underline my-2"
                          {...props}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          {children}
                        </a>
                      );
                    }

                    // Render as gradient button for CTA-style links
                    if (isCtaLink && href) {
                      return (
                        <a
                          href={href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 no-underline my-2"
                          {...props}
                        >
                          {children}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                      );
                    }
                    return <a className="text-blue-400 hover:text-blue-300 underline" href={href} {...props}>{children}</a>;
                  },
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

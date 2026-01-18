"use client";

import { useState } from "react";
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle, Link as LinkIcon, Check } from "lucide-react";

interface BlogSocialShareProps {
  title: string;
  slug: string;
  excerpt: string;
}

export default function BlogSocialShare({ title, slug, excerpt }: BlogSocialShareProps) {
  const [copied, setCopied] = useState(false);

  // Build the full URL
  const url = `https://m-coding.ie/blog/${slug}`;

  // Encode for URL parameters
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt);

  // Social sharing URLs
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0ARead more: ${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-red-900/10 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Share2 className="text-blue-400" size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">Share this article</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 hover:border-[#1877F2]/50 rounded-lg transition-all"
        >
          <Facebook size={18} className="text-[#1877F2]" />
          <span className="text-sm font-medium text-[#1877F2] group-hover:text-white transition-colors">
            Facebook
          </span>
        </a>

        {/* Twitter/X */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 rounded-lg transition-all"
        >
          <Twitter size={18} className="text-[#1DA1F2]" />
          <span className="text-sm font-medium text-[#1DA1F2] group-hover:text-white transition-colors">
            Twitter
          </span>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/30 hover:border-[#0A66C2]/50 rounded-lg transition-all"
        >
          <Linkedin size={18} className="text-[#0A66C2]" />
          <span className="text-sm font-medium text-[#0A66C2] group-hover:text-white transition-colors">
            LinkedIn
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 hover:border-[#25D366]/50 rounded-lg transition-all"
        >
          <MessageCircle size={18} className="text-[#25D366]" />
          <span className="text-sm font-medium text-[#25D366] group-hover:text-white transition-colors">
            WhatsApp
          </span>
        </a>

        {/* Email */}
        <a
          href={shareLinks.email}
          className="group flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all"
        >
          <Mail size={18} className="text-purple-400" />
          <span className="text-sm font-medium text-purple-400 group-hover:text-white transition-colors">
            Email
          </span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Copied!
              </span>
            </>
          ) : (
            <>
              <LinkIcon size={18} className="text-gray-400 group-hover:text-white" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                Copy Link
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

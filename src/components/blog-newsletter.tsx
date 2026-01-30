"use client";

import { useState } from "react";

export default function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleValidation = (e: React.FormEvent<HTMLFormElement>) => {
    // Basic client-side validation before native form submission
    if (!email || !email.includes("@")) {
      e.preventDefault();
      setError("Please enter a valid email address");
      return false;
    }
    // Let the native form submission happen
    return true;
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-red-900/20 rounded-lg border border-zinc-800 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Subscribe to Our Blog</h3>
        <p className="text-zinc-400 mb-6">
          Get the latest BMW tips, coding guides, and performance insights delivered to your inbox.
        </p>

        <form
          name="blog-newsletter"
          method="POST"
          action="/newsletter-success.html"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleValidation}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          {/* Netlify form detection fields */}
          <input type="hidden" name="form-name" value="blog-newsletter" />

          {/* Honeypot for spam protection */}
          <p style={{ display: "none" }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-600 text-white"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
          >
            Subscribe
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        <p className="text-zinc-500 text-xs mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}

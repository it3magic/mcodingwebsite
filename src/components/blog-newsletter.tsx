"use client";

import { useState } from "react";

export default function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("form-name", "blog-newsletter");
      params.append("email", email);

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-red-900/20 rounded-lg border border-zinc-800 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Subscribe to Our Blog</h3>
        <p className="text-zinc-400 mb-6">
          Get the latest BMW tips, coding guides, and performance insights delivered to your inbox.
        </p>

        {submitted ? (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <p className="text-green-400 font-medium">
              ✓ Thank you for subscribing! You've been added to our mailing list and will receive updates about our latest BMW tips and guides.
            </p>
            <p className="text-green-300 text-sm mt-2">
              Note: You won't receive an automatic confirmation email, but your subscription has been recorded successfully.
            </p>
          </div>
        ) : (
          <form
            name="blog-newsletter"
            method="POST"
            action="/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            {/* Netlify form fields */}
            <input type="hidden" name="form-name" value="blog-newsletter" />
            <input type="hidden" name="bot-field" />

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        )}

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

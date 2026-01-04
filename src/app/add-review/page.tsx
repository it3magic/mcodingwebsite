"use client";

import { Star, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AddReviewPage() {
  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    rating: 5,
    review: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Add Your Review | M Coding Ireland";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build WhatsApp message with review data
    let message = `*New Review Submission from Website*\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Vehicle:* ${formData.vehicle}\n`;
    message += `*Rating:* ${formData.rating} stars\n`;

    if (formData.email) {
      message += `*Email:* ${formData.email}\n`;
    }

    message += `\n*Review:*\n${formData.review}`;

    // WhatsApp URL with Ireland country code (+353)
    const phoneNumber = "353876096830";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show success message
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        vehicle: "",
        rating: 5,
        review: "",
        email: "",
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingClick = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="container mx-auto px-4 lg:px-8 py-24">
        {/* Back Button */}
        <Link
          href="/about#testimonials"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to About</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Share Your Experience</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Add Your <span className="text-gradient">Review</span>
            </h1>
            <p className="text-xl text-gray-400">
              We'd love to hear about your experience with M Coding
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <h3 className="text-green-500 font-bold text-lg">Thank you for your review!</h3>
                  <p className="text-gray-300 text-sm">Your review has been sent via WhatsApp. We'll verify and publish it soon!</p>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Smith"
                />
              </div>

              {/* Vehicle */}
              <div>
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Vehicle *
                </label>
                <input
                  type="text"
                  id="vehicle"
                  name="vehicle"
                  required
                  value={formData.vehicle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., BMW M4, MINI Cooper S, BMW 320d"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your Rating *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${
                          star <= formData.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-600'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.rating} out of 5 stars
                </p>
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  id="review"
                  name="review"
                  required
                  value={formData.review}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your experience with M Coding..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share details about the service you received, quality of work, communication, etc.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
              >
                Submit Review
              </button>

              <p className="text-sm text-gray-400 text-center">
                Your review will be sent to us via WhatsApp for verification before publishing
              </p>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Why Your Review Matters</h3>
            <p className="text-sm text-gray-300 mb-3">
              Your feedback helps us improve our services and helps other BMW & MINI owners make informed decisions.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Be honest and specific about your experience</li>
              <li>• Mention the service you received and your vehicle</li>
              <li>• All reviews are verified before publishing</li>
              <li>• We may feature your review on our website and social media</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

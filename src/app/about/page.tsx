"use client";

import { Shield, Award, Users, Target, CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// Note: Metadata should be in a separate server component, but for now using document.title in useEffect
export default function AboutPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    document.title = "About M Coding | Ireland's First Complete BMW & MINI Specialist";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Learn about M Coding Ireland - Ireland's first BMW-registered specialist. Expert team, state-of-the-art facility, and 100% customer satisfaction since 2019.");
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = "Learn about M Coding Ireland - Ireland's first BMW-registered specialist. Expert team, state-of-the-art facility, and 100% customer satisfaction since 2019.";
      document.head.appendChild(meta);
    }
  }, []);

  const testimonials = [
    {
      name: "Michael Brennan",
      vehicle: "BMW 320D",
      rating: 5,
      text: "Ireland's best BMW specialist, hands down. From servicing to coding, they do it all. Transparent pricing, excellent communication, and expert knowledge. 5 stars!",
      date: "3 weeks ago"
    },
    {
      name: "Daniel Nieroda",
      vehicle: "BMW 840d",
      rating: 5,
      text: "I always use Mcoding for all my BMWs – and I've had quite a few over the years! They've been taking care of my cars for a long time, always making sure everything is in top condition and serviced on time. Reliable, professional, and truly passionate about what they do. Highly recommended!",
      date: "6 months ago"
    },
    {
      name: "Joan Lestor-O'Connell",
      vehicle: "BMW 216D",
      rating: 5,
      text: "Bestest auto mechanic I have ever come across was very good at explaining to me what the problem/issue was with my car. Updated me with the progress of the work he is doing and graciously advised on having my car checked if I notice anything wrong. Will definitely go back and use his services. Thank You M Coding!!!",
      date: "4 months ago"
    },
    {
      name: "Vladyslav Koniukhov",
      vehicle: "BMW 640D",
      rating: 5,
      text: "5 stars. Got the full service, then took my car ( broken coolant pipe) fixed the issue even sooner than I expected. The place is clean and well equipped and the owner is professional . Can highly recommend 👍",
      date: "7 months ago"
    },
    {
      name: "Naveed Ur Rehman",
      vehicle: "BMW 530E",
      rating: 5,
      text: "Got full service done on my G30 at M Coding. Overall had an awesome experience there. The place is so nice and clean and Maciek is amazing to deal with and he really knows everything about BMWs. I had lot of my questions answered during the service instead of him forcing the customer to go away till he is finished like most of the other garages. Also got fixed one of the long pending issues in my car as complimentary. I highly recommend M Coding for any kind of work on BMWs.",
      date: "1 year ago"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="pt-20">
     {/* Hero - Full Width with About Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/about-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">About M Coding</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ireland's First Complete
              <br />
              <span className="text-gradient">BMW & MINI Specialist</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Setting a new standard for BMW and MINI care in Ireland through expertise,
              innovation, and unwavering commitment to quality.
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

      {/* Our Story */}
      <section className="py-24 bg-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Pioneering Excellence in <span className="text-gradient">BMW & MINI Care</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  M Coding represents a groundbreaking approach to BMW and MINI servicing in Ireland. We were the first business in the country to bring together BMW-registered servicing, advanced coding, performance remapping, and OEM retrofitting under one specialized brand.
                </p>
                <p>
                  Our BMW registration isn't just a credential—it's a commitment to maintaining the
                  manufacturer standards and precision engineering that make BMW and MINI vehicles exceptional.
                  Every service, every modification, and every line of code is executed with factory-level expertise.
                </p>
                <p>
                  We exclusively focus on BMW and MINI vehicles because specialization breeds excellence. Our deep knowledge of these brands enables us to deliver services that general garages simply cannot match—from unlocking hidden features to safe performance gains that respect your vehicle's engineering integrity.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "BMW Registered", description: "Enjoy Dealer-Level Servicing, History and Warranty record" },
                { icon: Award, title: "Expert Team", description: "Specialized BMW & MINI knowledge" },
                { icon: Users, title: "Customer First", description: "Dedicated to your satisfaction" },
                { icon: Target, title: "Precision Focus", description: "100% BMW & MINI focused" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center"
                >
                  <item.icon className="text-blue-500 mx-auto mb-3" size={32} />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Sets Us <span className="text-gradient">Apart</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A complete solution designed exclusively for BMW and MINI owners
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                title: "Complete Integration",
                description: "Unlike facilities that offer only servicing or only coding, M Coding provides everything your BMW or MINI needs under one roof—from routine maintenance to advanced software customization.",
              },
              {
                title: "BMW Registration & Expertise",
                description: "Our official BMW registration demonstrates our commitment to manufacturer standards. We maintain the same level of quality and expertise you'd expect from a dealership, with the personalized service of a specialist.",
              },
              {
                title: "Premium Quality Standards",
                description: "We use only premium oils and top-grade filters in our servicing. Every product is carefully selected to meet or exceed manufacturer specifications, protecting your vehicle's performance and longevity.",
              },
              {
                title: "Advanced Technology",
                description: "Our state-of-the-art diagnostic and coding equipment enables us to perform advanced modifications, feature activations, and performance tuning that preserve your vehicle's warranty and integrity.",
              },
              {
                title: "OEM-Level Modifications",
                description: "Whether you're adding new features or upgrading existing systems, we ensure factory-quality integration using genuine or OEM-equivalent parts for seamless performance.",
              },
              {
                title: "Exclusive Focus",
                description: "100% dedicated to BMW and MINI vehicles. This specialization allows our team to maintain cutting-edge knowledge of every model, generation, and system across both brands.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="testimonials" className="py-24 bg-black relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our <span className="text-gradient">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real feedback from BMW and MINI owners across Ireland
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Carousel Container */}
            <div className="relative">
              {/* Testimonial Card */}
              <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 border border-white/20 rounded-2xl p-8 md:p-12">
                {/* Star Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500" size={24} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-center mb-8">
                  <p className="text-xl md:text-2xl text-white leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                </blockquote>

                {/* Customer Info */}
                <div className="text-center">
                  <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                    <p className="text-lg font-bold text-white mb-1">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-sm text-gradient font-semibold">
                      {testimonials[currentTestimonial].vehicle}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {testimonials[currentTestimonial].date}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={24} />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Review Links */}
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">See more reviews on</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="https://www.google.com/search?q=m+coding+ireland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white font-semibold"
                >
                  Google Reviews
                </a>
                <a
                  href="https://www.facebook.com/mcodingireland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white font-semibold"
                >
                  Facebook Reviews
                </a>
              </div>
            </div>

            {/* Add a Review Button */}
            <div className="text-center mt-8">
              <p className="text-gray-400 mb-4">Had a great experience with M Coding?</p>
              <Link
                href="/add-review"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
              >
                <Star className="fill-white" size={20} />
                <span>Add Your Review</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Expertise",
                description: "Deep specialization in BMW and MINI vehicles, backed by official registration and continuous training.",
              },
              {
                title: "Quality",
                description: "Premium parts, manufacturer-standard procedures, and meticulous attention to every detail.",
              },
              {
                title: "Innovation",
                description: "Staying at the forefront of coding, remapping, and retrofitting technology for both brands.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center bg-zinc-900/50 border border-white/10 rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

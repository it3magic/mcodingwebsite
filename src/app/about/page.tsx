import { Shield, Award, Users, Target, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About M Coding | Ireland's First Complete BMW & MINI Specialist",
  description: "Learn about M Coding, Ireland's first BMW-registered specialist offering complete BMW & MINI servicing, coding, remapping, and retrofitting solutions.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-black to-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full">
              <span className="text-sm font-semibold text-gradient">About M Coding</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ireland's First Complete
              <br />
              <span className="text-gradient">BMW & MINI Specialist</span>
            </h1>
            <p className="text-xl text-gray-300">
              Setting a new standard for BMW and MINI care in Ireland through expertise,
              innovation, and unwavering commitment to quality.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-zinc-950">
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
                  We exclusively focus on BMW and MINI vehicles because specialization breeds excellence.
                  Our team's deep knowledge of these brands enables us to deliver services that general
                  garages simply cannot match—from unlocking hidden features to safe performance gains
                  that respect your vehicle's engineering integrity.
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
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black">
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

      {/* Values */}
      <section className="py-24 bg-black">
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

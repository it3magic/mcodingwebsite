"use client";

import { Gauge, CheckCircle, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import RemapCalculator from "../components/RemapCalculator";

export default function PerformancePage() {
  return (
    <div className="pt-20">
      {/* Hero - Full Width with Performance Background */}
      <section className="relative py-24 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-zinc-950 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/performance-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-blue-600/20 border border-red-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Performance Tuning</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              BMW & MINI
              <br />
              <span className="text-gradient">Performance Remapping</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Safe, reliable ECU remapping that unlocks your vehicle's true potential
              while maintaining reliability and drivability.
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

      {/* Remap Calculator */}
      <RemapCalculator />

      {/* Performance Remapping Details */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-red-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex p-3 bg-red-500/10 rounded-lg mb-6">
                <Gauge className="text-red-500" size={40} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Performance <span className="text-gradient">Remapping</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Safe, reliable ECU remapping that unlocks your vehicle's true potential
                while maintaining reliability and drivability.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Stage 1 & Stage 2 ECU Tuning",
                  "Transmission Remaps",
                  "Improved Throttle Response",
                  "Fuel Efficiency Optimization",
                  "Turbo Boost Optimization",
                  "AdBlue Solutions",
                  "DPF & EGR Solutions",
                  "XHP Remaps",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Safe & Reliable Tuning</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Conservative Approach:</strong> We prioritize
                  reliability over maximum gains, ensuring your engine operates safely within
                  its design parameters.
                </p>
                <p>
                  <strong className="text-white">Vehicle-Specific Tuning:</strong> Each remap is
                  optimized for your specific vehicle model, engine variant, and performance requirements.
                </p>
                <p>
                  <strong className="text-white">Quality Testing:</strong> Comprehensive testing
                  ensures smooth power delivery and proper operation across all conditions.
                </p>
                <p>
                  <strong className="text-white">Reversible:</strong> We can restore your original
                  software at any time if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Remapping */}
      <section className="py-24 bg-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient">M Coding Remaps</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert performance tuning with a focus on reliability and drivability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Proven Power Gains",
                description: "Significant increases in horsepower and torque across the entire power band for better acceleration and overtaking.",
                color: "red",
              },
              {
                icon: Gauge,
                title: "Improved Drivability",
                description: "Enhanced throttle response and smoother power delivery make your vehicle more enjoyable to drive every day.",
                color: "purple",
              },
              {
                icon: CheckCircle,
                title: "Fuel Efficiency",
                description: "Optimized fuel maps can improve economy, especially when driving conservatively with the extra torque available.",
                color: "blue",
              },
              {
                icon: Zap,
                title: "Safe Parameters",
                description: "All remaps stay within safe engine limits with proper safety margins to ensure long-term reliability.",
                color: "red",
              },
              {
                icon: Gauge,
                title: "Emission Solutions",
                description: "Professional DPF, EGR, Swirl Flap, and AdBlue solutions to optimize performance while maintaining reliability.",
                color: "purple",
              },
              {
                icon: CheckCircle,
                title: "Full Reversibility",
                description: "Original file backed up and can be restored at any time, perfect for warranty or resale situations.",
                color: "blue",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-red-500/10"
              >
                <div className={`inline-flex p-3 bg-${feature.color}-500/10 rounded-lg mb-4`}>
                  <feature.icon className={`text-${feature.color}-500`} size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Unlock Your Vehicle's Potential?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your performance goals and schedule your remap
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-red-500/30"
          >
            <span>Book Your Remap</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

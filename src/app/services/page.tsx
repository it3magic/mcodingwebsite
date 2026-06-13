"use client";

import {
  Wrench,
  Code,
  Gauge,
  Puzzle,
  CheckCircle,
  Check,
  ArrowRight,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import ServicePackagePopup from "../components/ServicePackagePopup";
import { useState } from "react";
import {
  SERVICE_PACKAGES,
  packageEstimate,
  getEngine,
  REFERENCE_ENGINE_ID,
} from "./service-config";

const PKG_STYLES: Record<string, { card: string; icon: string; check: string }> = {
  interim: {
    card: "border-white/10 bg-zinc-900/50 hover:border-blue-500/40 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-blue-500/10",
    icon: "bg-blue-500/15 text-blue-400",
    check: "text-blue-400",
  },
  major: {
    card: "border-white/10 bg-zinc-900/50 hover:border-purple-500/40 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-purple-500/10",
    icon: "bg-purple-500/15 text-purple-400",
    check: "text-purple-400",
  },
  premium: {
    card: "border-red-500/30 bg-gradient-to-br from-red-600/10 via-purple-600/10 to-blue-600/10 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20",
    icon: "bg-red-500/15 text-red-400",
    check: "text-red-400",
  },
  platinum: {
    card: "border-white/10 bg-zinc-900/50 hover:border-cyan-500/40 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-cyan-500/10",
    icon: "bg-cyan-500/15 text-cyan-400",
    check: "text-cyan-400",
  },
};

export default function ServicesPage() {
  const [showPopup, setShowPopup] = useState(false);
  const refEngine = getEngine(REFERENCE_ENGINE_ID);

  return (
    <div className="pt-20">
      {/* Service Package Popup */}
      <ServicePackagePopup show={showPopup} onClose={() => setShowPopup(false)} />

      {/* Hero - Full Width with Workshop Background */}
      <section className="relative py-24 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-zinc-950 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/Service2-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Our Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Complete BMW & MINI
              <br />
              <span className="text-gradient">Care Solutions</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              From routine maintenance to advanced performance optimization,
              we provide everything your BMW or MINI needs.
            </p>

            {/* Quick Service Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <Link
                href="#pricing"
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
              >
                <Wrench className="text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" size={32} />
                <div className="text-white font-semibold text-sm">Servicing</div>
              </Link>
              <Link
                href="/performance"
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/30 hover:border-red-500/50 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
                style={{ animationDelay: '0.5s' }}
              >
                <Gauge className="text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" size={32} />
                <div className="text-white font-semibold text-sm">Remapping</div>
              </Link>
              <Link
                href="#retrofitting"
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
                style={{ animationDelay: '1s' }}
              >
                <Puzzle className="text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" size={32} />
                <div className="text-white font-semibold text-sm">Retrofitting</div>
              </Link>
              <Link
                href="#coding"
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
                style={{ animationDelay: '1.5s' }}
              >
                <Code className="text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" size={32} />
                <div className="text-white font-semibold text-sm">Coding</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages & Pricing - MOVED TO TOP */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-zinc-950 to-black relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Service <span className="text-gradient">Packages</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A rough guide to where prices start. For exact, model-specific pricing, build your
              service in the configurator. Prices shown exclude VAT.
            </p>
          </div>

          {refEngine && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {SERVICE_PACKAGES.map((pkg) => {
                const est = packageEstimate(refEngine, pkg);
                const from = Math.round(est.subtotal / 5) * 5;
                const styles = PKG_STYLES[pkg.id];
                return (
                  <Link
                    key={pkg.id}
                    href={`/services/configure?package=${pkg.id}`}
                    className={`group relative flex flex-col rounded-xl border p-5 transition-all ${styles.card}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-red-500/30">
                        Popular
                      </span>
                    )}
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                      >
                        <Wrench size={16} />
                      </span>
                      <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                    </div>
                    <div className="mb-3">
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">From</p>
                      <p className="text-2xl font-bold text-white">
                        €{from}
                        {est.hasPoa && (
                          <span className="align-top text-base font-bold text-amber-300">+</span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500">ex VAT</p>
                    </div>
                    <ul className="space-y-1.5">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check
                            className={`mt-0.5 flex-shrink-0 ${styles.check}`}
                            size={13}
                            strokeWidth={3}
                          />
                          <span className="text-xs leading-snug text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold text-gray-300 transition-colors group-hover:text-white">
                      Build this
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Configure for your car CTA */}
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 p-6 text-center md:flex-row md:gap-8 md:p-8 md:text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 shadow-lg shadow-blue-500/30">
                <SlidersHorizontal className="text-white" size={26} />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl md:text-2xl font-bold text-white">
                  Configure for your car
                </h3>
                <p className="text-sm text-gray-300">
                  The prices above are rough starting points. Pick your exact engine, oil and extras
                  for accurate, model-specific pricing.
                </p>
              </div>
              <Link
                href="/services/configure"
                className="group inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:opacity-90"
              >
                <span>Build your service</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Pricing Note + Help */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm max-w-3xl mx-auto mb-8">
              Starting prices are a rough guide based on a 520d (F10, N47). Your exact price depends
              on your model, engine and oil capacity — newer models such as the G30 are typically a
              little higher, and some items (e.g. the cabin filter) are confirmed on booking. Use the
              configurator above or contact us for a precise quote.
            </p>

            {/* Help Box */}
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <HelpCircle className="text-blue-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Not Sure Which Service?</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Let us help you determine the right service package for your vehicle
                </p>
                <button
                  onClick={() => setShowPopup(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/30"
                >
                  Get Service Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BMW & MINI Servicing */}
      <section id="servicing" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative scroll-mt-20">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex p-3 bg-blue-500/10 rounded-lg mb-6">
                <Wrench className="text-blue-500" size={40} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                BMW & MINI <span className="text-gradient">Servicing</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Professional servicing that maintains manufacturer standards while using only
                premium oils and high-quality filters. Our BMW registration ensures your vehicle
                receives the expert care it deserves.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Premium Oil & Filter Changes",
                  "ZF Transmission Service (100-120k km intervals)",
                  "Intake Walnut Blasting",
                  "Differential & Transferbox Service",
                  "Complete Engine Maintenance",
                  "Comprehensive Vehicle Checks",
                  "Electrical System Diagnostics",
                  "DPF Cleaning Service",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Our Servicing?</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Premium Quality:</strong> We use only top-grade oils
                  and filters that meet or exceed manufacturer specifications.
                </p>
                <p>
                  <strong className="text-white">BMW Registration:</strong> Official registration ensures
                  we maintain dealership-level standards and expertise.
                </p>
                <p>
                  <strong className="text-white">Vehicle Integrity:</strong> Every service is performed
                  with meticulous attention to preserving your vehicle's performance and value.
                </p>
                <p>
                  <strong className="text-white">Transparent Pricing:</strong> Clear, competitive pricing
                  with no hidden fees or unnecessary upselling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Remapping - Link to Dedicated Page */}
      <section id="remapping" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative scroll-mt-20">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-red-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/performance"
            className="block max-w-5xl mx-auto group"
          >
            <div className="bg-gradient-to-br from-red-600/20 via-purple-600/20 to-blue-600/20 border-2 border-red-500/40 rounded-2xl p-12 hover:from-red-600/30 hover:via-purple-600/30 hover:to-blue-600/30 hover:border-red-500/60 transition-all shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 hover:scale-[1.02] duration-300">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="p-6 bg-red-500/20 rounded-2xl group-hover:bg-red-500/30 transition-all group-hover:scale-110 duration-300">
                    <Gauge className="text-red-400 group-hover:text-red-300 transition-colors" size={64} />
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 group-hover:text-gradient transition-all">
                    Performance Remapping
                  </h2>
                  <p className="text-xl text-gray-300 mb-6 group-hover:text-white transition-colors">
                    Unlock your BMW or MINI's true potential with safe, reliable ECU remapping
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">Stage 1 & 2</div>
                      <div className="text-sm text-gray-400">ECU Tuning</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">XHP</div>
                      <div className="text-sm text-gray-400">Transmission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">DPF/EGR</div>
                      <div className="text-sm text-gray-400">Solutions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">Calculator</div>
                      <div className="text-sm text-gray-400">Power Gains</div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-red-500/50">
                    <ArrowRight className="text-white" size={32} />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-center text-gray-300 group-hover:text-white transition-colors font-medium">
                  Click to explore our remap calculator, performance packages, and detailed information →
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* OEM Modifications & Retrofitting */}
      <section id="retrofitting" className="py-24 bg-gradient-to-b from-zinc-950 to-black relative scroll-mt-20">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-zinc-900/50 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Factory-Quality Integration</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  We specialize in retrofitting genuine BMW and MINI parts or quality aftermarket components that integrate seamlessly with your vehicle's existing systems.
                </p>
                <p>
                  From adding Apple CarPlay to installing adaptive cruise control systems or upgrading your sound system to Harman Kardon, every modification is performed to factory standards with proper coding and calibration.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex p-3 bg-blue-500/10 rounded-lg mb-6">
                <Puzzle className="text-blue-500" size={40} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                OEM Modifications & <span className="text-gradient">Retrofitting</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Professional installation of OEM parts and upgrades that maintain your
                vehicle's factory appearance and functionality.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Apple CarPlay & Android Auto",
                  "Reversing Cameras and Driver Assistance Systems",
                  "Harman Kardon Retrofits",
                  "Ambient Lighting Installation",
                  "Heated Seats & Steering Wheel",
                  "Adaptive Headlight Retrofit",
                  "Digital Instrument Clusters",
                  "M Performance Parts Installation",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coding & Software Customisation */}
      <section id="coding" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative scroll-mt-20">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-zinc-900/50 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Unlock Your Vehicle's Potential</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Modern BMW and MINI vehicles have numerous features and capabilities hidden in
                  their software. Our advanced coding services can activate these features and
                  customize your vehicle's behavior to match your preferences.
                </p>
                <p>
                  From enabling digital Speed Limit Info to changing region settings and activating navigation features, we can safely modify your vehicle's software while maintaining full functionality and reliability.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex p-3 bg-purple-500/10 rounded-lg mb-6">
                <Code className="text-purple-500" size={40} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Coding & Software <span className="text-gradient">Customisation</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Advanced coding and software modifications to unlock hidden features,
                customize settings, and enhance your vehicle's capabilities.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Feature Activation & Enabling",
                  "Navigation and Region Changes",
                  "Navigation & Maps Updates",
                  "Digital Speedometer Activation",
                  "Start/Stop Behavior Customization",
                  "Lighting & Comfort Settings",
                  "Safety Feature Configuration",
                  "iDrive & Display Customization",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Enhance Your BMW or MINI?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your requirements and schedule your service
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
          >
            <span>Book Your Service</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Wrench, Code, Gauge, Puzzle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | BMW & MINI Servicing, Coding, Remapping | M Coding Ireland",
  description: "Expert BMW & MINI services: premium servicing, advanced coding, performance remapping, and OEM retrofitting. BMW-registered specialist in Ireland.",
  keywords: "BMW servicing Ireland, MINI servicing, BMW coding, MINI coding, BMW remap, performance tuning, BMW retrofitting",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero - Full Width with Workshop Background */}
      <section className="relative py-24 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/servicing-workshop.jpg')`,
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
                <Wrench className="text-blue-500 mx-auto mb-2" size={32} />
                <div className="text-white font-semibold text-sm">Servicing</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
                <Code className="text-purple-500 mx-auto mb-2" size={32} />
                <div className="text-white font-semibold text-sm">Coding</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
                <Gauge className="text-red-500 mx-auto mb-2" size={32} />
                <div className="text-white font-semibold text-sm">Remapping</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
                <Puzzle className="text-blue-500 mx-auto mb-2" size={32} />
                <div className="text-white font-semibold text-sm">Retrofitting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-24">
            {/* BMW & MINI Servicing */}
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
                    "Transmission Service",
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

            {/* Coding & Software */}
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

            {/* Performance Remapping */}
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
                    <strong className="text-white">Tailored Solutions:</strong> Every remap is
                    customized to your specific vehicle, driving style, and performance goals.
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

            {/* OEM Retrofitting */}
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

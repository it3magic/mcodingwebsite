import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Gauge, Wrench, Shield, Zap, Code } from "lucide-react";
import WhatsAppWidget from "./components/WhatsAppWidget";
import NotificationBanner from "@/components/notification-banner";

export default function Home() {
  return (
    <div className="pt-20">
      <WhatsAppWidget />
      <NotificationBanner />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/bmw-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full">
            <span className="text-sm font-semibold text-gradient">First of Its Kind in Ireland</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Premium BMW & MINI
            <br />
            <span className="text-gradient">Specialist</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ireland's first* complete BMW & MINI solution combining BMW-registered servicing, advanced coding, remapping, and OEM retrofitting under one expert brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/services#pricing"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30 flex items-center space-x-2"
            >
              <span>Book Your BMW or MINI Service</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Explore Services
            </Link>
            <Link
              href="/performance"
              className="group px-8 py-4 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white text-lg font-semibold rounded-lg hover:from-red-800 hover:via-red-700 hover:to-orange-700 transition-all shadow-xl shadow-red-600/50 hover:shadow-2xl hover:shadow-red-600/60 flex items-center space-x-2 border border-red-500/50"
            >
              <Gauge className="group-hover:scale-110 group-hover:rotate-12 transition-transform" size={20} />
              <span>Performance Remapping</span>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/bmw-registration"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
            >
              <Shield className="text-blue-500 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <div className="text-3xl font-bold text-white mb-2">BMW Approved</div>
              <div className="text-sm text-gray-400">Registered and Fully Insured Specialist</div>
            </Link>
            <Link
              href="/about#testimonials"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/30 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
              style={{ animationDelay: '0.5s' }}
            >
              <Star className="text-yellow-500 fill-yellow-500 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <div className="text-3xl font-bold text-white mb-2">100% Satisfaction</div>
              <div className="text-sm text-gray-400">Consistant 5-Star Reviews on Google and Facebook</div>
            </Link>
            <Link
              href="/about"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/30 transition-all cursor-pointer group animate-subtle-pulse hover:animate-none"
              style={{ animationDelay: '1s' }}
            >
              <Zap className="text-red-500 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <div className="text-3xl font-bold text-white mb-2">Ireland's First</div>
              <div className="text-sm text-gray-400">One-Stop Shop for all BMW and MINI needs, since 2019</div>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Why M Coding Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient">M Coding</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The first BMW-registered specialist in Ireland offering a complete suite of services since 2019
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "BMW Registered",
                description: "Official BMW registration ensures manufacturer-standard quality and expertise for your vehicle",
                color: "blue",
              },
              {
                icon: Code,
                title: "Advanced Coding",
                description: "Unlock hidden features, customize settings, and optimize your BMW or MINI's capabilities",
                color: "purple",
              },
              {
                icon: Gauge,
                title: "Performance Remapping",
                description: "Safe, reliable power gains and efficiency improvements tailored to your driving style",
                color: "red",
              },
              {
                icon: Wrench,
                title: "Premium Servicing",
                description: "Top-grade oils and filters maintaining manufacturer standards and vehicle integrity",
                color: "blue",
              },
              {
                icon: Zap,
                title: "OEM Retrofitting",
                description: "Factory-quality modifications and upgrades using genuine or quality aftermarket parts",
                color: "purple",
              },
              {
                icon: CheckCircle,
                title: "Complete Solution",
                description: "All your BMW and MINI needs met by one trusted, specialized shop",
                color: "red",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-blue-500/10"
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

      {/* Services Preview */}
      <section className="py-24 bg-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive BMW and MINI care from routine maintenance to performance optimization
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "BMW & MINI Servicing",
                description: "Professional servicing using premium oils and high-quality filters, maintaining manufacturer standards and protecting your vehicle's integrity. We perform quality ZF transmission oil changes using genuine ZF service kits - essential preventive maintenance every 80-120 thousand kilometers for optimal longevity and smooth shifting performance.",
                features: ["Premium Oil Changes", "Comprehensive Inspections", "ZF Transmission Service", "Diagnostic Services"],
              },
              {
                title: "Coding & Software Customisation",
                description: "Advanced coding services to unlock features, customize settings, and optimize your vehicle's software for enhanced functionality.",
                features: ["Feature Activation", "Region Changes", "Navigation Enabling", "Custom Configurations"],
              },
              {
                title: "Performance Remapping",
                description: "Safe, reliable ECU tuning for optimized power delivery, torque enhancement, and improved fuel efficiency tailored to your needs.",
                features: ["ECU Remapping", "Transmission Remaps", "Torque Optimization", "Efficiency Gains"],
              },
              {
                title: "OEM Modifications & Retrofitting",
                description: "Factory-quality upgrades and retrofits using genuine or OEM-equivalent parts for seamless integration with your vehicle.",
                features: ["Retrofit Installation", "OEM Upgrades", "System Integration", "Quality Assurance"],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-300">
                      <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
            >
              <span>View All Services</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl z-10" />
        <div className="absolute inset-0 m-gradient-subtle" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience the M Coding Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book your BMW or MINI service with Ireland's first complete specialist today
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

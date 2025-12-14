import { Shield, Award, CheckCircle, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMW Registration & Expertise | Official BMW Registered Specialist Ireland",
  description: "M Coding is officially BMW-registered, ensuring manufacturer-standard quality and expertise for your BMW and MINI vehicles in Ireland.",
};

export default function BMWRegistrationPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-black to-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
              <Shield className="text-blue-500" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Officially <span className="text-gradient">BMW Registered</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              M Coding holds official BMW registration, ensuring every service meets manufacturer standards and maintains your vehicle's integrity
            </p>
            <div className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <span className="text-blue-400 font-semibold">Certified BMW Specialist Ireland</span>
            </div>
          </div>
        </div>
      </section>

      {/* What BMW Registration Means */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What BMW Registration <span className="text-gradient">Means</span>
              </h2>
              <p className="text-xl text-gray-400">
                Official BMW registration is more than a credential—it's a commitment to excellence
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Manufacturer Standards",
                  description: "We adhere to the same quality standards and procedures as official BMW dealerships, ensuring your vehicle receives factory-level care.",
                },
                {
                  title: "Specialized Training",
                  description: "We undergo continuous training on BMW and MINI systems, keeping pace with the latest technologies and service procedures.",
                },
                {
                  title: "Genuine Knowledge",
                  description: "Deep expertise in BMW and MINI engineering, electronics, and diagnostics that comes from exclusive focus and official recognition.",
                },
                {
                  title: "Quality Assurance",
                  description: "Every service is performed to manufacturer specifications, protecting your vehicle's performance, reliability, and value.",
                },
                {
                  title: "Advanced Equipment",
                  description: "Access to BMW-specific diagnostic tools and software that enable proper servicing and programming of modern vehicles.",
                },
                {
                  title: "Warranty Protection",
                  description: "Our BMW registration and proper service procedures help protect your vehicle's warranty coverage.",
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
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unmatched <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              100% dedicated to BMW and MINI vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "BMW & MINI Only",
                description: "Exclusive focus allows us to maintain cutting-edge knowledge of every system and component across the brand.",
              },
              {
                icon: Award,
                title: "Advanced Diagnostics",
                description: "State-of-the-art equipment and software for accurate diagnosis and repair of complex modern systems.",
              },
              {
                icon: Star,
                title: "Coding Expertise",
                description: "Deep understanding of BMW and MINI software architecture for safe, effective feature activation and customization.",
              },
              {
                icon: Shield,
                title: "Performance Tuning",
                description: "Expert knowledge of engine management systems for safe, reliable performance optimization.",
              },
              {
                icon: Award,
                title: "OEM Integration",
                description: "Skilled installation and coding of retrofits that integrate seamlessly with factory systems.",
              },
              {
                icon: Star,
                title: "Continual Learning",
                description: "Ongoing training and development to stay current with evolving BMW and MINI technologies.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all"
              >
                <item.icon className="text-blue-500 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Why BMW Registration <span className="text-gradient">Matters to You</span>
            </h2>

            <div className="space-y-8">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Dealership Quality, Specialist Service</h3>
                <p className="text-gray-300">
                  You get the manufacturer-level expertise and standards of a BMW dealership,
                  combined with the personalized attention and competitive pricing of a specialist.
                  Our registration ensures we maintain the same rigorous standards while offering
                  more flexibility and customer-focused service.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Protecting Your Investment</h3>
                <p className="text-gray-300">
                  BMW and MINI vehicles represent significant investments. Our official registration
                  and adherence to manufacturer standards help protect that investment by maintaining
                  your vehicle's performance, reliability, and resale value through proper care and documentation.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Peace of Mind</h3>
                <p className="text-gray-300">
                  When you bring your BMW or MINI to M Coding, you can trust that it's in the hands of properly registered, trained specialists who understand these vehicles inside and out. Every service is electronically stored in your vehicles iDrive system and in the BMW backend cloud servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-2xl mb-8">
              <Award className="text-gradient" size={48} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              First Complete Solution in Ireland
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              M Coding was the first business in Ireland to combine BMW registration with a complete suite of servicing, coding, remapping, and retrofitting services under one specialized brand.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-gradient mb-2">One</div>
                <div className="text-sm text-gray-400">Complete BMW & MINI Solution</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-gradient mb-2">Stop</div>
                <div className="text-sm text-gray-400">Dealer-Level service</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-gradient mb-2">Shop</div>
                <div className="text-sm text-gray-400">Aftermarket Options</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackFormSubmission, trackWhatsAppClick } from "@/components/GoogleAnalytics";
import NotificationBannerInline from "@/components/notification-banner-inline";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    registration: "",
    service: "",
    message: "",
  });

  // Set page metadata and pre-fill service based on URL parameter
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = "Contact M Coding | Book Your BMW & MINI Service Ireland";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Contact M Coding Ireland for BMW & MINI servicing, coding, remapping, and retrofitting. Book your appointment today. Located in Ardfinnan, Co. Tipperary.");
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = "Contact M Coding Ireland for BMW & MINI servicing, coding, remapping, and retrofitting. Book your appointment today. Located in Ardfinnan, Co. Tipperary.";
      document.head.appendChild(meta);
    }

    // Pre-fill service from URL parameter
    const packageParam = searchParams.get('package');
    if (packageParam) {
      const serviceMap: { [key: string]: string } = {
        'interim': 'Interim Service (€170)',
        'major': 'Major Service (€270)',
        'premium': 'Premium Service (€350)',
        'platinum': 'Platinum Service (€480)',
      };

      const serviceName = serviceMap[packageParam];
      if (serviceName) {
        setFormData(prev => ({
          ...prev,
          service: serviceName,
        }));
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Track form submission
    trackFormSubmission('Contact Form');
    trackWhatsAppClick('Contact Form');

    // Build WhatsApp message with form data
    let message = `*New Service Enquiry from Website*\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Email:* ${formData.email}\n`;

    if (formData.phone) {
      message += `*Phone:* ${formData.phone}\n`;
    }

    if (formData.vehicle) {
      message += `*Vehicle:* ${formData.vehicle}\n`;
    }

    if (formData.registration) {
      message += `*Registration:* ${formData.registration}\n`;
    }

    if (formData.service) {
      message += `*Service Required:* ${formData.service}\n`;
    }

    message += `\n*Message:*\n${formData.message}`;

    // WhatsApp URL with Ireland country code (+353)
    const phoneNumber = "353876096830";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-20">
      {/* Hero - Full Width with Contact Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85 z-10" />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/contact-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Get In Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Book Your <span className="text-gradient">Service</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Ready to experience the M Coding difference? Contact us to discuss your
              BMW or MINI's requirements and schedule your appointment.
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

      {/* Contact Form & Info */}
      <section className="py-24 bg-zinc-950 relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />

        {/* Notification Banner - Positioned above form */}
        <div className="relative z-10 mb-8">
          <NotificationBannerInline />
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Contact <span className="text-gradient">Information</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Get in touch with Ireland's first complete BMW & MINI specialist
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <MapPin className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-400">Ardfinnan, Co.Tipperary E91YX50</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Phone className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-400">Whatsapp 0876096830</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Mail className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">mcodingireland@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Clock className="text-green-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-3">Opening Hours</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Monday - Friday</span>
                        <span className="text-white font-semibold">10:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Saturday</span>
                        <span className="text-blue-400 font-semibold">By Appointment</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Sunday</span>
                        <span className="text-blue-400 font-semibold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">Why Choose M Coding?</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• BMW-Registered Specialist</li>
                  <li>• Complete BMW & MINI Solution</li>
                  <li>• Premium Quality Service</li>
                  <li>• Advanced Coding & Remapping</li>
                  <li>• OEM Retrofitting Experts</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
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

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="+353 XX XXX XXXX"
                      />
                    </div>

                    <div>
                      <label htmlFor="vehicle" className="block text-sm font-medium text-gray-300 mb-2">
                        Vehicle Model and Year
                      </label>
                      <input
                        type="text"
                        id="vehicle"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g., 2017 M4, 2019 520D"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="registration" className="block text-sm font-medium text-gray-300 mb-2">
                        Vehicle Registration Number
                      </label>
                      <input
                        type="text"
                        id="registration"
                        name="registration"
                        value={formData.registration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                        placeholder="e.g., 181-D-12345"
                      />
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                        Service Required *
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select a service</option>
                        <optgroup label="Service Packages">
                          <option value="Interim Service (€170)">Interim Service (€170)</option>
                          <option value="Major Service (€270)">Major Service (€270)</option>
                          <option value="Premium Service (€350)">Premium Service (€350)</option>
                          <option value="Platinum Service (€480)">Platinum Service (€480)</option>
                        </optgroup>
                        <optgroup label="Other Services">
                          <option value="coding">Coding or Region Change</option>
                          <option value="remapping">Performance Remapping</option>
                          <option value="retrofitting">Retrofitting</option>
                          <option value="diagnostics">Diagnostics</option>
                          <option value="other">Other / General Enquiry</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30"
                  >
                    Send Message
                  </button>

                  <p className="text-sm text-gray-400 text-center">
                    We'll respond to your enquiry within 24 hours
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-24 bg-black relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find <span className="text-gradient">Our Location</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Located in Ardfinnan, Co. Tipperary - Easily accessible with ample parking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2446.123!2d-7.882665908965986!3d52.29744872552037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDE3JzUwLjgiTiA3wrA1Mic1Ny42Ilc!5e0!3m2!1sen!2sie!4v1702572567890!5m2!1sen!2sie&q=52.29744872552037,-7.882665908965986"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="M Coding Location Map"
                />
              </div>
            </div>

            {/* Location Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Location Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Address</h4>
                    <p className="text-white">Ardfinnan</p>
                    <p className="text-white">Co. Tipperary</p>
                    <p className="text-white">E91 YX50</p>
                    <p className="text-white">Ireland</p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Parking</h4>
                    <p className="text-white text-sm">Free on-site parking available</p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Directions</h4>
                    <p className="text-white text-sm mb-3">Easily accessible from Clonmel and Cahir</p>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=52.29744872552037,-7.882665908965986"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">By Appointment Only</h3>
                <p className="text-sm text-gray-300">
                  To ensure we provide the best service, we operate by appointment.
                  Please contact us to schedule your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ContactForm />
    </Suspense>
  );
}

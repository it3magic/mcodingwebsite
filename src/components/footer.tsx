import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4">
              <Image
                src="/LogoFinal-01.png"
                alt="M Coding Ireland Logo"
                width={180}
                height={60}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Ireland's first complete BMW & MINI specialist combining servicing, coding, remapping, and retrofitting.
            </p>
            <div className="h-1 w-20 m-gradient rounded-full" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/bmw-registration" className="text-sm text-gray-400 hover:text-white transition-colors">
                  BMW Registration
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">BMW Servicing</li>
              <li className="text-sm text-gray-400">Navigation & Region Change</li>
              <li className="text-sm text-gray-400">Coding & Software</li>
              <li className="text-sm text-gray-400">Performance Remapping</li>
              <li className="text-sm text-gray-400">OEM Retrofitting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Ardfinnan, Co. Tipperary E91YX50</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>0876096830</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>mcodingireland@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} M Coding. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              BMW-Registered Specialist | Ardfinnan, Co. Tipperary E91YX50
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

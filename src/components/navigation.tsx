"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/performance", label: "Performance" },
    { href: "/products", label: "Products" },
    { href: "/blog", label: "Blog" },
    { href: "/bmw-registration", label: "BMW Registered" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/LogoFinal-01.png"
              alt="M Coding Ireland Logo"
              width={300}
              height={100}
              className="h-20 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
            >
              Book Service
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mx-4 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all text-center shadow-lg shadow-blue-500/20"
              >
                Book Service
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

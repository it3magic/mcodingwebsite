"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const message = "Hi! I'd like to enquire about your BMW & MINI services.";
    const phoneNumber = "353876096830";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          <div className="text-sm font-semibold">Chat with us on WhatsApp!</div>
          <div className="text-xs text-gray-600">We typically reply within minutes</div>
          {/* Arrow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" className="group-hover:scale-110 transition-transform" />

        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
      </button>
    </div>
  );
}

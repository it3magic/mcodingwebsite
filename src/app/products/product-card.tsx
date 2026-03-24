"use client";

import { ShoppingCart, Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { trackWhatsAppClick, trackProductView } from "@/components/GoogleAnalytics";
import type { Product } from "./products-data";

// Pricing map for Region Change service based on iDrive Version
const regionPricing: Record<string, string> = {
  "CIC": "€350",
  "NBT": "€250",
  "NBT EVO": "€350",
  "MGU": "€570",
  "ID8": "€600",
  "ID8.5": "€1500",
};

// Pricing map for Reversing Camera based on Vehicle Model
const reversingCameraPricing: Record<string, string> = {
  "BMW G30": "€470",
  "BMW G31": "€530",
  "BMW F10": "€620",
  "BMW F11": "€720",
  "BMW F30": "€550",
};

// Pricing map for G3X LCI Taillights based on Vehicle Model
const tailightsPricing: Record<string, string> = {
  "BMW G30": "€1250",
  "BMW G31": "€1350",
};

// Pricing map for Speed Limit Info - SLI based on Vehicle Type
const sliPricing: Record<string, string> = {
  "F/G series with Kafas camera": "€170",
  "F series without Kafas camera": "€200",
};

// Pricing map for Ambient Lighting F10/F11 based on System Type
const ambientLightingPricing: Record<string, string> = {
  "2 Color (CIC System)": "€250",
  "9 Color (NBT System)": "€390",
};

// Pricing map for ZF/DCT Transmission Service
const zfTransmissionPricing: Record<string, Record<string, string>> = {
  "F/G series Diesel/Petrol 8 Speed ZF Transmission": {
    "Genuine ZF Fluid": "€650",
    "Aftermarket Fluid (exceeds ZF specifications)": "€550",
  },
  "F/G series Hybrid ZF Transmission": {
    "Genuine ZF Fluid": "€750",
    "Aftermarket Fluid (exceeds ZF specifications)": "€650",
  },
  "DCT Transmission (M3/M4/M5 etc)": {
    "Liqui Moly 8100 Fluid (DCT only)": "€750",
  },
};

// Pricing map for XHP Transmission Remap based on Transmission Type
const xhpPricing: Record<string, string> = {
  "6-Speed": "€219",
  "7-Speed (DCT)": "€399",
  "8-Speed": "€299",
  "8-Speed (G series/Supra)": "€399",
};

// Pricing maps for BMW F1X Headlight Repair (additive pricing)
const headlightBasePricing: Record<string, number> = {
  "Halogen": 299,
  "Xenon": 510,
  "Adaptive Xenon (AHL)": 510,
};

const tmsModulePricing: Record<string, number> = {
  "No TMS module": 0,
  "New Halogen TMS Module": 80,
  "New Xenon TMS Module": 100,
  "New Adaptive Xenon (AHL) module": 120,
};

const bulbsPricing: Record<string, number> = {
  "No New bulbs": 0,
  "New Halogen H7 Bulbs": 30,
  "New D1S Xenon Bulbs": 100,
};

const wiringPricing: Record<string, number> = {
  "No new wiring required": 0,
  "New wiring Required": 150,
};

const drlPricing: Record<string, number> = {
  "No New DRL Modules required": 0,
  "1x New DRL required": 70,
  "2x New DRL Modules required": 120,
};

const installationPricing: Record<string, number> = {
  "Drop off/Pick up service (No extra charge)": 0,
  "Remove and refit in house (+€135 inc VAT)": 135,
};

// Pricing map for Petrol Fuel Injector Cleaning
const injectorCleaningPricing: Record<string, string> = {
  "4 Injectors - €120": "€120",
  "6 Injectors - €160": "€160",
};

// Pricing maps for Intake Manifold Cleaning / Walnut Blasting (additive pricing)
const intakeCleaningBasePricing: Record<string, number> = {
  "Chemical Cleaning - €285": 285,
};

const intakeGasketsPricing: Record<string, number> = {
  "N47 Engine Gaskets - €65": 65,
  "B47 / N57 / B57 Engine Gaskets - €30": 30,
};

const walnutBlastingPricing: Record<string, number> = {
  "No Walnut Blasting - €0": 0,
  "4 Cylinder Walnut Blasting - €300": 300,
  "6 Cylinder Walnut Blasting - €450": 450,
};

const swirlFlapPricing: Record<string, number> = {
  "No Swirl Flap Work - €0": 0,
  "Swirl Flap Delete - €280": 280,
  "Swirl Flap Delete + Stage 1 Remap - €320": 320,
};

// Pricing maps for BMW F10 LCI Xenon Headlight
const f10LciHeadlightSidePricing: Record<string, number> = {
  "Driver Side (Right)": 850,
  "Passenger Side (Left)": 850,
  "Pair (Both Sides)": 1600,
};

const f10LciTmsPricing: Record<string, number> = {
  "No TMS Module": 0,
  "1x New TMS Module (+€120)": 120,
  "2x New TMS Modules (+€220)": 220,
};

const f10LciBulbPricing: Record<string, number> = {
  "No New Bulbs": 0,
  "1x New D1S Xenon Bulb (+€40)": 40,
  "2x New D1S Xenon Bulbs (+€80)": 80,
};

const f10LciDrlPricing: Record<string, number> = {
  "No New DRL Modules": 0,
  "1x New DRL Module (+€50)": 50,
  "2x New DRL Modules (+€80)": 80,
  "3x New DRL Modules (+€130)": 130,
  "4x New DRL Modules (+€160)": 160,
};

const f10LciIgniterPricing: Record<string, number> = {
  "No Igniter Ballast": 0,
  "1x New Xenon Igniter Ballast (+€100)": 100,
  "2x New Xenon Igniter Ballasts (+€200)": 200,
};

const f10LciHeadlightInstallPricing: Record<string, number> = {
  "Headlight Only (Self Install)": 0,
  "Fitted + Coded (+€135)": 135,
};

export function ProductCard({ product }: { product: Product }) {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [selectedOption4, setSelectedOption4] = useState("");
  const [selectedOption5, setSelectedOption5] = useState("");
  const [selectedOption6, setSelectedOption6] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Get available fluid options for ZF/DCT transmission based on transmission type
  const availableFluidOptions = useMemo(() => {
    if (product.name === "ZF / DCT Transmission Service" && selectedOption1) {
      if (selectedOption1 === "DCT Transmission (M3/M4/M5 etc)") {
        return ["Liqui Moly 8100 Fluid (DCT only)"];
      } else if (selectedOption1 === "F/G series Diesel/Petrol 8 Speed ZF Transmission") {
        return ["Genuine ZF Fluid", "Aftermarket Fluid (exceeds ZF specifications)"];
      } else if (selectedOption1 === "F/G series Hybrid ZF Transmission") {
        return ["Genuine ZF Fluid", "Aftermarket Fluid (exceeds ZF specifications)"];
      }
    }
    return product.options?.dropdown2?.choices || [];
  }, [product.name, product.options, selectedOption1]);

  // Reset fluid selection when transmission type changes
  useEffect(() => {
    if (product.name === "ZF / DCT Transmission Service") {
      setSelectedOption2("");
    }
  }, [selectedOption1, product.name]);

  // Calculate dynamic price for products with options
  const displayPrice = useMemo(() => {
    if (product.name === "Region Change" && selectedOption1) {
      return regionPricing[selectedOption1] || product.price;
    }
    if (product.name === "BMW Genuine Reversing Camera" && selectedOption1) {
      return reversingCameraPricing[selectedOption1] || product.price;
    }
    if (product.name === "BMW G3X LCI Taillights" && selectedOption1) {
      return tailightsPricing[selectedOption1] || product.price;
    }
    if (product.name === "Speed Limit Info - SLI" && selectedOption1) {
      return sliPricing[selectedOption1] || product.price;
    }
    if (product.name === "Ambient Lighting F10/F11" && selectedOption1) {
      return ambientLightingPricing[selectedOption1] || product.price;
    }
    if (product.name === "ZF / DCT Transmission Service" && selectedOption1 && selectedOption2) {
      return zfTransmissionPricing[selectedOption1]?.[selectedOption2] || product.price;
    }
    if (product.name === "BMW XHP Transmission Remap" && selectedOption1) {
      return xhpPricing[selectedOption1] || product.price;
    }
    if (product.name === "BMW F1X Headlight Repair") {
      let total = headlightBasePricing[selectedOption1] || headlightBasePricing["Halogen"];
      total += tmsModulePricing[selectedOption2] || 0;
      total += bulbsPricing[selectedOption3] || 0;
      total += wiringPricing[selectedOption4] || 0;
      total += drlPricing[selectedOption5] || 0;
      total += installationPricing[selectedOption6] || 0;
      return `€${total}`;
    }
    if (product.name === "Petrol Fuel Injector Cleaning Service") {
      const option = selectedOption1 || product.options?.dropdown1?.choices[0] || "";
      return injectorCleaningPricing[option] || product.price;
    }
    if (product.name === "Intake Manifold Cleaning / Walnut Blasting") {
      let total = intakeCleaningBasePricing[selectedOption1] || 285;
      total += intakeGasketsPricing[selectedOption2] || 0;
      total += walnutBlastingPricing[selectedOption3] || 0;
      total += swirlFlapPricing[selectedOption4] || 0;
      return `From €${total}`;
    }
    if (product.name === "BMW F10 LCI Xenon Headlight") {
      let total = f10LciHeadlightSidePricing[selectedOption1] || 850;
      total += f10LciTmsPricing[selectedOption2] || 0;
      total += f10LciBulbPricing[selectedOption3] || 0;
      total += f10LciDrlPricing[selectedOption4] || 0;
      total += f10LciIgniterPricing[selectedOption5] || 0;
      total += f10LciHeadlightInstallPricing[selectedOption6] || 0;
      return `€${total}`;
    }
    return product.price;
  }, [product.name, product.price, selectedOption1, selectedOption2, selectedOption3, selectedOption4, selectedOption5, selectedOption6]);

  const handleEnquire = () => {
    // Track product enquiry
    trackWhatsAppClick(`Product: ${product.name}`);
    trackProductView(product.name);

    let message = `Hi, I'm interested in the *${product.name}*\n\n`;

    if (product.hasOptions && product.options) {
      const option1 = selectedOption1 || product.options.dropdown1.choices[0];
      message += `*${product.options.dropdown1.label}:* ${option1}\n`;

      if (product.options.dropdown2) {
        const option2 = selectedOption2 || product.options.dropdown2.choices[0];
        message += `*${product.options.dropdown2.label}:* ${option2}\n`;
      }

      if (product.options.dropdown3) {
        const option3 = selectedOption3 || product.options.dropdown3.choices[0];
        message += `*${product.options.dropdown3.label}:* ${option3}\n`;
      }
      if (product.options.dropdown4) {
        const option4 = selectedOption4 || product.options.dropdown4.choices[0];
        message += `*${product.options.dropdown4.label}:* ${option4}\n`;
      }
      if (product.options.dropdown5) {
        const option5 = selectedOption5 || product.options.dropdown5.choices[0];
        message += `*${product.options.dropdown5.label}:* ${option5}\n`;
      }
      if (product.options.dropdown6) {
        const option6 = selectedOption6 || product.options.dropdown6.choices[0];
        message += `*${product.options.dropdown6.label}:* ${option6}\n`;
      }
    }

    message += `\n*Total Price:* ${displayPrice}\n\nCould you provide more details?`;

    // WhatsApp URL with Ireland country code (+353)
    const phoneNumber = "353876096830";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    setShowVideo(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    setShowVideo(false);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setShowVideo(false);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all hover:shadow-xl hover:shadow-blue-500/10">
      {/* Product Image Gallery */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 bg-zinc-800/50 overflow-hidden">
          {showVideo && product.video && product.hasVideo ? (
            product.video.endsWith('.mp4') ? (
              <video
                src={product.video}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <iframe
                src={product.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Navigation Arrows (only show if more than 1 image) */}
          {product.images.length > 1 && !showVideo && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Video Play Button - only shows if hasVideo is true */}
          {product.video && product.hasVideo && !showVideo && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleVideo();
              }}
              className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-full hover:opacity-90 transition-all shadow-lg flex items-center space-x-2 z-10"
            >
              <Play size={18} fill="currentColor" />
              <span className="text-sm font-semibold pr-1">Watch Video</span>
            </button>
          )}

          {/* Thumbnail Indicators */}
          {product.images.length > 1 && !showVideo && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    goToImage(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full flex items-center space-x-1">
              <Star size={12} fill="currentColor" />
              <span>Featured</span>
            </div>
          )}

          {/* Special Order Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Special Order</span>
            </div>
          )}

          {/* Image Counter */}
          {product.images.length > 1 && !showVideo && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-xs font-semibold rounded-full">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xl font-bold text-white mb-2 hover:text-gradient transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-4">{product.description}</p>

        {/* Dropdown Options - Limited to 2 on card view for compact display */}
        {product.hasOptions && product.options && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {product.options.dropdown1.label}
              </label>
              <select
                value={selectedOption1}
                onChange={(e) => setSelectedOption1(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select...</option>
                {product.options.dropdown1.choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </div>

            {product.options.dropdown2 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {product.options.dropdown2.label}
                </label>
                <select
                  value={selectedOption2}
                  onChange={(e) => setSelectedOption2(e.target.value)}
                  disabled={product.name === "ZF / DCT Transmission Service" && !selectedOption1}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select...</option>
                  {availableFluidOptions.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Show "More options" note for products with 3+ dropdowns */}
            {(product.options.dropdown3 || product.options.dropdown4 || product.options.dropdown5 || product.options.dropdown6) && (
              <p className="text-xs text-gray-500 italic">+ More options available on product page</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient">{displayPrice}</span>
          <div className="flex space-x-2">
            <Link
              href={`/products/${product.slug}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all text-sm"
            >
              View Details
            </Link>
            <button
              onClick={handleEnquire}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 text-sm ${
                product.inStock
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white hover:opacity-90"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white hover:opacity-90"
              }`}
            >
              <ShoppingCart size={16} />
              <span>
                {product.inStock
                  ? (product.category === "Servicing" ? "Enquire" : "Enquire")
                  : "Special Order"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

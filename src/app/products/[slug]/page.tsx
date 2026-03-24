"use client";

import { useState, use, useMemo, useEffect } from "react";
import Link from "next/link";
import { products } from "../products-data";
import { ChevronLeft, ChevronRight, ChevronDown, Play, Check, ArrowLeft, ShoppingCart, Info, Wrench, Shield, HelpCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [selectedOption4, setSelectedOption4] = useState("");
  const [selectedOption5, setSelectedOption5] = useState("");
  const [selectedOption6, setSelectedOption6] = useState("");

  // Pricing map for Region Change
  const regionPricing: Record<string, string> = {
    "CIC": "€350",
    "NBT": "€250",
    "NBT EVO": "€350",
    "MGU": "€570",
    "ID8": "€600",
    "ID8.5": "€1500",
  };

  // Pricing map for Reversing Camera
  const reversingCameraPricing: Record<string, string> = {
    "BMW G30": "€470",
    "BMW G31": "€530",
    "BMW F10": "€620",
    "BMW F11": "€720",
    "BMW F30": "€550",
  };

  // Pricing map for G3X LCI Taillights
  const tailightsPricing: Record<string, string> = {
    "BMW G30": "€1250",
    "BMW G31": "€1350",
  };

  // Pricing map for Speed Limit Info - SLI
  const sliPricing: Record<string, string> = {
    "F/G series with Kafas camera": "€170",
    "F series without Kafas camera": "€200",
  };

  // Pricing map for Ambient Lighting F10/F11
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

  // Pricing map for XHP Transmission Remap
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

  // Pricing map for Petrol Fuel Injector Cleaning
  const injectorCleaningPricing: Record<string, string> = {
    "4 Injectors - €120": "€120",
    "6 Injectors - €160": "€160",
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
    if (product.name === "BMW XHP Transmission Remap" && selectedOption1) {
      return xhpPricing[selectedOption1] || product.price;
    }
    if (product.name === "Ambient Lighting F10/F11" && selectedOption1) {
      return ambientLightingPricing[selectedOption1] || product.price;
    }
    if (product.name === "ZF / DCT Transmission Service" && selectedOption1 && selectedOption2) {
      return zfTransmissionPricing[selectedOption1]?.[selectedOption2] || product.price;
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
    if (product.name === "Intake Manifold Cleaning / Walnut Blasting") {
      let total = intakeCleaningBasePricing[selectedOption1] || 285;
      total += intakeGasketsPricing[selectedOption2] || 0;
      total += walnutBlastingPricing[selectedOption3] || 0;
      total += swirlFlapPricing[selectedOption4] || 0;
      return `€${total}`;
    }
    if (product.name === "Petrol Fuel Injector Cleaning Service") {
      const option = selectedOption1 || product.options?.dropdown1?.choices[0] || "";
      return injectorCleaningPricing[option] || product.price;
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

  const handleEnquire = () => {
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

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Helper function to extract numeric price from price string
  const extractNumericPrice = (priceStr: string): string => {
    // Match any number (including decimals) in the string
    const match = priceStr.match(/(\d+(?:\.\d{1,2})?)/);
    return match ? match[1] : "0";
  };

  // Check if product has variable pricing (starts with "From")
  const hasVariablePricing = product.price.toLowerCase().startsWith("from");

  // Get price range for products with variable pricing
  const getPriceRange = () => {
    if (product.name === "Petrol Fuel Injector Cleaning Service") {
      return { lowPrice: "120", highPrice: "160" };
    }
    if (product.name === "Intake Manifold Cleaning / Walnut Blasting") {
      return { lowPrice: "285", highPrice: "1200" };
    }
    if (product.name === "ZF / DCT Transmission Service") {
      return { lowPrice: "550", highPrice: "750" };
    }
    // Default: extract from product.price
    const basePrice = extractNumericPrice(product.price);
    return { lowPrice: basePrice, highPrice: basePrice };
  };

  const priceRange = getPriceRange();

  // Generate Product Schema (JSON-LD) for Google Shopping and SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map(img => img.startsWith('/') ? `https://m-coding.ie${img}` : img),
    "description": product.seoDescription || product.description,
    "sku": product.slug,
    "mpn": product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": "M Coding Ireland"
    },
    "category": product.category,
    "offers": hasVariablePricing ? {
      "@type": "AggregateOffer",
      "url": `https://m-coding.ie/products/${product.slug}`,
      "priceCurrency": "EUR",
      "lowPrice": priceRange.lowPrice,
      "highPrice": priceRange.highPrice,
      "offerCount": product.options?.dropdown1?.choices?.length || 1,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "seller": {
        "@type": "Organization",
        "name": "M Coding Ireland"
      }
    } : {
      "@type": "Offer",
      "url": `https://m-coding.ie/products/${product.slug}`,
      "priceCurrency": "EUR",
      "price": extractNumericPrice(displayPrice),
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "M Coding Ireland"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "127"
    }
  };

  // Service Schema for service-based products
  const serviceSchema = product.category === "Servicing" ? {
    "@context": "https://schema.org/",
    "@type": "Service",
    "name": product.name,
    "description": product.seoDescription || product.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "M Coding Ireland",
      "image": "https://m-coding.ie/LogoFinal-01.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ardfinnan",
        "addressLocality": "Tipperary",
        "addressRegion": "Co. Tipperary",
        "postalCode": "E91YX50",
        "addressCountry": "IE"
      },
      "telephone": "+353876096830",
      "email": "mcodingireland@gmail.com",
      "url": "https://m-coding.ie",
      "priceRange": "€€",
      "openingHours": "Mo-Fr 09:00-18:00, Sa 09:00-14:00"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "serviceType": product.name,
    "offers": hasVariablePricing ? {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": priceRange.lowPrice,
      "highPrice": priceRange.highPrice
    } : {
      "@type": "Offer",
      "price": extractNumericPrice(displayPrice),
      "priceCurrency": "EUR"
    }
  } : null;

  // FAQ Schema
  const faqSchema = product.faqs && product.faqs.length > 0 ? {
    "@context": "https://schema.org/",
    "@type": "FAQPage",
    "mainEntity": product.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://m-coding.ie"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://m-coding.ie/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://m-coding.ie/products/${product.slug}`
      }
    ]
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org/",
    "@type": "AutoRepair",
    "name": "M Coding Ireland",
    "image": "https://m-coding.ie/LogoFinal-01.png",
    "url": "https://m-coding.ie",
    "telephone": "+353876096830",
    "email": "mcodingireland@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ardfinnan",
      "addressLocality": "Tipperary",
      "addressRegion": "Co. Tipperary",
      "postalCode": "E91YX50",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.3167,
      "longitude": -7.9833
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "127"
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-black">
      {/* JSON-LD Schema Markup for SEO and Google Shopping */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Service Schema */}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-zinc-950 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
              Products
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="py-12 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div>
              {/* Main Image/Video Display */}
              <div className="relative bg-zinc-900/50 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: "4/3" }}>
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
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Product Video"
                    />
                  )
                ) : (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && !showVideo && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Video Button - only show if hasVideo is explicitly enabled */}
                {product.video && product.hasVideo && !showVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute bottom-4 right-4 px-5 py-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-full hover:scale-105 transition-all shadow-xl shadow-red-500/30 flex items-center space-x-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                    <span className="font-bold pr-1">Watch Video</span>
                  </button>
                )}

                {/* Image Counter */}
                {product.images.length > 1 && !showVideo && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm font-semibold rounded-full">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index && !showVideo
                        ? "border-blue-500"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    style={{ aspectRatio: "1" }}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {/* Video Thumbnail - only show if hasVideo is explicitly enabled */}
                {product.video && product.hasVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all group ${
                      showVideo ? "border-blue-500" : "border-white/10 hover:border-white/30"
                    }`}
                    style={{ aspectRatio: "1" }}
                  >
                    {/* Use first image as video thumbnail background */}
                    <img
                      src={product.images[0]}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all" />
                    {/* Play button circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={20} className="text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* Video label */}
                    <div className="absolute bottom-1 left-1 right-1 text-center">
                      <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wide">Video</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.name}</h1>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold text-gradient">{displayPrice}</span>
                <span className="font-semibold text-green-400">Available</span>
              </div>

              <div className="text-xl text-gray-300 mb-6 whitespace-pre-line">
                {product.fullDescription?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                    {paragraph.split(/(\*\*\[.*?\]\(.*?\)\*\*|\*\*.*?\*\*|\[.*?\]\(.*?\))/).map((part, i) => {
                      // Bold link with gradient: **[text](url)**
                      if (part.startsWith('**[') && part.includes('](') && part.endsWith(')**')) {
                        const linkMatch = part.slice(2, -2).match(/\[(.*?)\]\((.*?)\)/);
                        if (linkMatch) {
                          return (
                            <Link key={i} href={linkMatch[2]} className="font-bold text-gradient hover:opacity-80 transition-opacity">
                              {linkMatch[1]}
                            </Link>
                          );
                        }
                      }
                      // Regular link: [text](url)
                      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (linkMatch) {
                          return (
                            <Link key={i} href={linkMatch[2]} className="text-blue-400 hover:text-blue-300 underline transition-colors">
                              {linkMatch[1]}
                            </Link>
                          );
                        }
                      }
                      // Bold text: **text**
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                )) || product.description}
              </div>

              {/* Blog Post Link */}
              {product.blogPostUrl && (
                <Link
                  href={product.blogPostUrl}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 group"
                >
                  <Info size={18} />
                  <span className="underline underline-offset-4 group-hover:no-underline">
                    {product.blogPostLabel || "Learn More"}
                  </span>
                </Link>
              )}

              {/* Dropdown Options */}
              {product.hasOptions && product.options && (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {product.options.dropdown1.label}
                    </label>
                    <select
                      value={selectedOption1}
                      onChange={(e) => setSelectedOption1(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                  {product.options.dropdown3 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {product.options.dropdown3.label}
                      </label>
                      <select
                        value={selectedOption3}
                        onChange={(e) => setSelectedOption3(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {product.options.dropdown3.choices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {product.options.dropdown4 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {product.options.dropdown4.label}
                      </label>
                      <select
                        value={selectedOption4}
                        onChange={(e) => setSelectedOption4(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {product.options.dropdown4.choices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {product.options.dropdown5 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {product.options.dropdown5.label}
                      </label>
                      <select
                        value={selectedOption5}
                        onChange={(e) => setSelectedOption5(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {product.options.dropdown5.choices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {product.options.dropdown6 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {product.options.dropdown6.label}
                      </label>
                      <select
                        value={selectedOption6}
                        onChange={(e) => setSelectedOption6(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {product.options.dropdown6.choices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Enquire Button */}
              <button
                onClick={handleEnquire}
                className="w-full px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center space-x-2 mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white hover:opacity-90 shadow-xl shadow-blue-500/30"
              >
                <ShoppingCart size={24} />
                <span>{product.inStock ? (product.category === "Servicing" ? "Enquire About This Service" : "Enquire About This Product") : "Available"}</span>
              </button>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 text-center">
                  <Shield className="text-blue-500 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-400">Warranty</div>
                  <div className="text-white font-semibold">{product.specifications?.["Warranty"] || "30 days"}</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 text-center">
                  <Info className="text-purple-500 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-400">Availability</div>
                  <div className="text-white font-semibold">{product.inStock ? "In Stock" : "Special Order"}</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 text-center">
                  <Wrench className="text-red-500 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-400">Installation</div>
                  <div className="text-white font-semibold">{product.specifications?.["Installation"] || "In-House"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Key <span className="text-gradient">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-zinc-900/50 border border-white/10 rounded-lg p-4"
                >
                  <Check className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications Section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="py-12 bg-zinc-950">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Technical <span className="text-gradient">Specifications</span>
            </h2>
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-black/20" : ""}
                    >
                      <td className="px-6 py-4 text-white border-b border-white/5">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Compatibility & Installation */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.compatibility && (
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Compatibility</h3>
                <p className="text-gray-300">{product.compatibility}</p>
              </div>
            )}
            {product.installation && (
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Installation</h3>
                <div className="text-gray-300 whitespace-pre-line">
                  {product.installation.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                      {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-12 bg-zinc-950">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center space-x-3 mb-8">
              <HelpCircle className="text-blue-500" size={32} />
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
            </div>
            <div className="max-w-4xl space-y-4">
              {product.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                    <ChevronDown
                      size={24}
                      className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Service Area Note */}
            {product.serviceArea && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Service Area:</span> {product.serviceArea}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-zinc-950">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related <span className="text-gradient">Products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                >
                  <div className="relative h-48 bg-zinc-800/50 overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
                      {relatedProduct.category}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{relatedProduct.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{relatedProduct.description}</p>
                    <div className="text-xl font-bold text-gradient">{relatedProduct.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

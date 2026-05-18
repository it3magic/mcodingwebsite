// Product data structure and content

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  images: string[];
  video?: string;
  hasVideo?: boolean; // Only show video if explicitly enabled (default: false)
  description: string;
  fullDescription: string;
  features: string[];
  specifications: Record<string, string>;
  compatibility: string;
  installation: string;
  inStock: boolean;
  featured: boolean;
  blogPostUrl?: string;
  blogPostLabel?: string;
  hasOptions?: boolean;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  serviceArea?: string;
  options?: {
    dropdown1: {
      label: string;
      choices: string[];
    };
    dropdown2?: {
      label: string;
      choices: string[];
    };
    dropdown3?: {
      label: string;
      choices: string[];
    };
    dropdown4?: {
      label: string;
      choices: string[];
    };
    dropdown5?: {
      label: string;
      choices: string[];
    };
    dropdown6?: {
      label: string;
      choices: string[];
    };
  };
};

export const products: Product[] = [
  {
    id: 1,
    slug: "region-change",
    name: "Region Change",
    category: "Coding",
    price: "€350",
    images: [
      "https://ugc.same-assets.com/EmMFPG3rG_oDSu5bQcFeNHer-H9SM76B.jpeg",
      "https://ugc.same-assets.com/ngUClO1P5cjV-5FA3tHv2dLN7fDs3qHf.jpeg",
      "https://ugc.same-assets.com/Uhb7kRGowprQcSlXJNmyrL9PeErVQBC5.jpeg",
      "https://ugc.same-assets.com/P66QyAG6c-UI91kGRHUphXI3zppPtJYy.jpeg",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasVideo: false, // Disabled for now - will be enabled when custom video is added
    description: "In-House region change service with navigation and map updates",
    fullDescription: "Our comprehensive region change service updates your BMW or MINI's software to match your current location, enabling proper navigation functionality, correct map data, and region-specific features such as DRL and disabling legal warnings. This service is essential for imported vehicles.",
    features: [
      "Complete navigation system region update",
      "Map data updates for Ireland/Europe",
      "Legal Disclaimer disabling and Region specific Lighting settings.",
      "Radio frequency adjustment for local stations",
      "Language and unit conversion settings",
      "FSC (BMW map activation) code generation",
    ],
    specifications: {
      "Service Time": "1-2 hours",
      "Warranty": "12 months",
      "Compatible Models": "All Large Screen BMW & MINI with iDrive",
      "iDrive Versions": "CIC, NBT, NBT EVO, MGU, ID8, ID8.5",
    },
    compatibility: "Compatible with all BMW and MINI models equipped with large screen iDrive navigation systems from 2008 onwards",
    installation: "Service is performed at our workshop. Vehicle programming is completed on-site with full diagnostic testing to ensure all systems function correctly.",
    inStock: true,
    featured: true,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "iDrive Version",
        choices: ["CIC", "NBT", "NBT EVO", "MGU", "ID8", "ID8.5"],
      },
      dropdown2: {
        label: "From Region:",
        choices: ["USA", "Japan", "Australia"],
      },
    },
  },
  {
    id: 2,
    slug: "bmw-genuine-reversing-camera",
    name: "BMW Genuine Reversing Camera",
    category: "Exterior",
    price: "€450",
    images: [
      "https://ugc.same-assets.com/84MUSYinHV2wnNP3QrE0RGLYJYAC8NvH.jpeg",
      "https://ugc.same-assets.com/9ff6_oUc8JtT0KjWJ8JJHhT9tmJkYgLb.jpeg",
      "https://ugc.same-assets.com/KsDRPq_aONuNR7lELxIViPYu3AXOPwUt.jpeg",
      "https://ugc.same-assets.com/WRbjw2AHJcCRJ3XP8DMUA5p6wHwD26FW.jpeg",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasVideo: false, // Disabled for now - will be enabled when custom video is added
    description: "Genuine BMW reversing camera retrofit service",
    fullDescription: "Genuine BMW Reversing camera system fitted using genuine parts and wiring. All work completed to our high standard and coded for full OEM functionality",
    features: [
      "Genuine BMW components",
      "All involved modules fully coded",
      "Original mounting in boot handle",
      "Retrofit updated in Vehicle Order",
      "Professional Wiring",
      "6 Month Warranty",
    ],
    specifications: {
      "Parts": "Genuine BMW Parts",
      "Detection Angle": "180° Detection Angle",
      "Features": "Support Guidance Lines and Obstacle Marking",
      "Audio Feedback": "With audio feedback",
      "Warranty": "6 Months Warranty",
    },
    compatibility: "Readily available for G30/G31 models, other vehicles parts need to be ordered. Please contact us to arrange.",
    installation: "Professional installation included in price. Includes all wiring and brackets. Installation time approximately 2-3 hours.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Vehicle Model",
        choices: ["BMW G30", "BMW G31", "BMW F10", "BMW F11", "BMW F30"],
      },
    },
  },
  {
    id: 3,
    slug: "bmw-xhp-transmission-remap",
    name: "BMW XHP Transmission Remap",
    category: "Performance",
    price: "€219",
    images: [
      "https://ugc.same-assets.com/eP-hqPa6ulHwhDFQCyKuOoPio6cRX-Wg.png",
      "https://ugc.same-assets.com/5rPF2jFQ_A-O3vsNMQMd7rXOyrQ8KZqL.webp",
    ],
    description: "Professional XHP transmission flash for BMW models",
    fullDescription: "The world's leading XHP remap for BMW transmissions, installed using dealer-level diagnostics. Enjoy complete peace of mind with a professional flash of XHP Stage 1, Stage 2, or Stage 3 transmission software. Once purchased, the XHP license is locked to your vehicle's VIN, allowing unlimited future transmission map changes to suit your driving style.",
    features: [
      "Worlds best XHP transmission maps",
      "Unlimited changes",
      "Choice of Stage 1, Stage 2, or Stage 3",
      "Gear Display active in all modes",
      "Torque Limiters removed",
      "Fully reversable",
    ],
    specifications: {
      "Service Type": "Safe and convenient",
      "Reversibility": "Fully reversable",
      "License": "Unlimited lifetime changes",
    },
    compatibility: "Most BMW 6-speed, 7-speed and 8-speed transmissions including the MK5 Toyota Supra",
    installation: "In-House professional installation.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Transmission Type",
        choices: ["6-Speed", "7-Speed (DCT)", "8-Speed", "8-Speed (G series/Supra)"],
      },
    },
  },
  {
    id: 4,
    slug: "bmw-g3x-lci-taillights",
    name: "BMW G3X LCI Taillights",
    category: "Exterior",
    price: "€1250",
    images: [
      "https://ugc.same-assets.com/nw6wabaDh88jL4Rurg98qNjXDQH_wS5T.jpeg",
      "https://ugc.same-assets.com/f5uJseGXS8Mx41o-tKmbTvkRTpvW6tR9.jpeg",
    ],
    description: "Genuine BMW LCI facelift taillights retrofit",
    fullDescription: "Genuine BMW LCI facelift taillights, with wiring and trim pieces",
    features: [
      "Genuine BMW Product",
      "Complete quality coding",
      "Wiring Included",
      "Full car software update",
      "Updates the backend of the G3X",
    ],
    specifications: {
      "Product Type": "Quality Genuine Product",
      "Warranty": "12 Months Warranty",
      "Light Output": "Improved light output",
      "Technology": "LED Light Technology",
    },
    compatibility: "Available for G30 and G31 vehicles",
    installation: "Direct replacement standard taillights. Installation time 4-5 Hours.",
    inStock: false,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Vehicle Model",
        choices: ["BMW G30", "BMW G31"],
      },
    },
  },
  {
    id: 5,
    slug: "apple-carplay-activation",
    name: "Native Apple CarPlay Activation",
    category: "Coding",
    price: "€120",
    images: [
      "https://ugc.same-assets.com/ZYcC0FiVMWt6f2DvyGPJnnuf9Hm4VjKU.jpeg",
      "https://ugc.same-assets.com/7FUCGn0BN9xx_0CqNKxEZ5sKjodzW38m.jpeg",
      "https://ugc.same-assets.com/eKaZHPQFw20AKHNdoBOFUhQdPrQZPlxT.jpeg",
      "https://ugc.same-assets.com/wnmOcqF4xZEwYmpMxkv7YNiYk_oLw00A.jpeg",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasVideo: false, // Disabled for now - will be enabled when custom video is added
    description: "Native Apple CarPlay activation for NBT EVO iDrive systems",
    fullDescription: `Enable **Native Apple CarPlay** on your BMW with NBT EVO iDrive system. This is a software-based activation that unlocks the factory CarPlay feature built into your vehicle.

**Important:** This service is for **NBT EVO systems only** and supports **Apple CarPlay only** - Android Auto is not supported natively on NBT EVO.

Not sure which iDrive system you have? **[Check our iDrive identification guide](/blog/bmw-idrive-systems-guide)** to find out.

**Need Android Auto?** If you need Android Auto support, or have a different iDrive system (CIC, NBT, MGU), check out our **[CarPlay & Android Auto Retrofit](/products/carplay-android-auto-retrofit)** which works with all BMW models.`,
    features: [
      "Native BMW CarPlay integration",
      "Wireless connectivity",
      "Fullscreen support",
      "No aftermarket adapters required",
      "High quality WiFi antenna included",
      "Retains all original iDrive functions",
      "Steering wheel controls supported",
      "30 minute installation",
    ],
    specifications: {
      "Service Type": "Software Activation",
      "iDrive System": "NBT EVO Only",
      "Supported": "Apple CarPlay Only",
      "Connection": "Wireless",
      "Installation": "In-House",
      "Service Time": "30 minutes",
      "Warranty": "12 months",
    },
    blogPostUrl: "/blog/bmw-idrive-systems-guide",
    blogPostLabel: "Check Your iDrive System",
    compatibility: "Compatible with BMW models equipped with NBT EVO iDrive system (2016+). Not compatible with CIC, NBT, or MGU systems. This service activates Apple CarPlay only - Android Auto is not supported on NBT EVO.",
    installation: "In-House installation service. Includes high-quality WiFi antenna fitting and full system coding. Service time approximately 30 minutes. No hardware modifications required.",
    inStock: true,
    featured: false,
    faqs: [
      {
        question: "Does this support Android Auto?",
        answer: "No, NBT EVO systems only support Apple CarPlay natively. Android Auto is not available on NBT EVO. If you need Android Auto, check out our CarPlay & Android Auto Retrofit product which uses an MMI box or aftermarket screen."
      },
      {
        question: "How do I know if I have NBT EVO?",
        answer: "NBT EVO systems are found in BMW F-series vehicles from 2016 onwards. Check our iDrive identification guide or contact us with your vehicle details and we can confirm."
      },
      {
        question: "Is the connection wireless?",
        answer: "Yes, once activated your iPhone will connect wirelessly to CarPlay. We include a high-quality WiFi antenna to ensure reliable connectivity."
      },
      {
        question: "Will I lose any existing features?",
        answer: "No, all your existing iDrive features remain fully functional. CarPlay is simply added as an additional feature."
      },
    ],
  },
  {
    id: 6,
    slug: "bmw-f1x-headlight-repair",
    name: "BMW F1X Headlight Repair",
    category: "Exterior",
    price: "€299",
    images: [
      "/headlight-1.jpg",
      "/headlight-2.jpg",
      "/headlight-3.jpg",
    ],
    description: "Professional headlight resealing and repair service",
    fullDescription: "Resealing and repair of BMW F1X series headlights. We refurb your headlights by swapping over your headlights internal components to a new housing, and use a special self-healing compound to reseal the headlight with a brand new clear lens. This service is readily available for BMW F1X models only. Contact us for different models",
    features: [
      "New Housing and Lens",
      "Self-Healing compound",
      "Much cheaper solution to brand new Adaptive Headlights",
    ],
    specifications: {
      "Product Type": "New Lens and Housing",
      "Sealing": "High quality self healing glue",
      "Warranty": "6 Months",
    },
    compatibility: "Available For Xenon and Adaptive Xenon pre-facelift and facelift F10 and F11 headlights.",
    installation: "Choose between drop off/pick up service at no extra charge, or our remove and refit in-house service for €135 inc VAT. Headlights need to be left for 1 day. By appointment only",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Headlight Type",
        choices: ["Halogen", "Xenon", "Adaptive Xenon (AHL)"],
      },
      dropdown2: {
        label: "TMS Module",
        choices: ["No TMS module", "New Halogen TMS Module", "New Xenon TMS Module", "New Adaptive Xenon (AHL) module"],
      },
      dropdown3: {
        label: "Bulbs",
        choices: ["No New bulbs", "New Halogen H7 Bulbs", "New D1S Xenon Bulbs"],
      },
      dropdown4: {
        label: "Wiring",
        choices: ["No new wiring required", "New wiring Required"],
      },
      dropdown5: {
        label: "DRL Modules",
        choices: ["No New DRL Modules required", "1x New DRL required", "2x New DRL Modules required"],
      },
      dropdown6: {
        label: "Installation Service",
        choices: ["Drop off/Pick up service (No extra charge)", "Remove and refit in house (+€135 inc VAT)"],
      },
    },
  },
  {
    id: 7,
    slug: "speed-limit-info-sli",
    name: "Speed Limit Info - SLI",
    category: "Coding",
    price: "€170",
    images: [
      "https://ugc.same-assets.com/oy5qytfEqI02HLppZ50Z55A4LbbzvU5I.jpeg",
      "https://ugc.same-assets.com/tdzh-TAygekFNuVQX4z-loX1DP_cqV1S.jpeg",
    ],
    description: "Speed Limit Information display on speedometer",
    fullDescription: "Activation of Speed Limit Information on vehicles speedometer. Natively supported on F and G series vehicles with Kafas Cameras in windscreen. Can also be fitted to vehicles missing the camera using aftermarket emulators.",
    features: [
      "Speed Limit Road Sign Recognition",
      "Uses Camera and navigation system to display correct Speed Limit",
      "Shows on dash and in Heads-Up Display if available",
      "Fully Reversable",
    ],
    specifications: {
      "Native Support": "F and G series vehicles with Kafas cameras in windscreen",
      "Alternative Option": "Aftermarket emulators to bypass camera available (Works off navigation data only)",
      "Reversibility": "Fully Reversable",
      "Warranty": "12 months",
    },
    compatibility: "Compatible with F-series and G-series BMW models equipped with Kafas cameras",
    installation: "Coding / emulator fitting depending on option selected, installation time 30 minutes to 1.5 Hours.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Vehicle Type",
        choices: ["F/G series with Kafas camera", "F series without Kafas camera"],
      },
    },
  },
  {
    id: 8,
    slug: "ambient-lighting-f10-f11",
    name: "Ambient Lighting F10/F11",
    category: "Interior",
    price: "€250",
    images: [
      "/ambient-1.jpg",
      "/ambient-2.jpg",
      "/ambient-3.jpg",
    ],
    description: "Premium ambient lighting retrofit for BMW F10/F11 vehicles",
    fullDescription: "Transform your BMW F10 or F11 interior with our professional ambient lighting retrofit. Choose between a 2-color system for CIC vehicles or the advanced 9-color system for NBT-equipped models. Professional installation with complete coding integration ensures factory-quality finish.",
    features: [
      "Professional OEM-quality installation",
      "Full iDrive integration and control",
      "Factory-style appearance and operation",
      "Adjustable brightness settings",
      "Multiple color zones throughout cabin",
      "Genuine BMW components",
    ],
    specifications: {
      "Compatible Models": "BMW F10 / F11 (5 Series)",
      "CIC System": "2 Colors Available",
      "NBT System": "9 Colors Available",
      "Installation Time": "3-4 hours",
      "Warranty": "6 months",
    },
    compatibility: "Designed specifically for BMW F10 and F11 5 Series models. CIC system offers 2-color ambient lighting, while NBT system provides 9-color options with enhanced control.",
    installation: "Professional installation included. All wiring is professionally routed and hidden for factory appearance. Complete coding integration with iDrive control menu.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "System Type",
        choices: ["2 Color (CIC System)", "9 Color (NBT System)"],
      },
    },
  },
  {
    id: 11,
    slug: "petrol-fuel-injector-cleaning",
    name: "Petrol Fuel Injector Cleaning Service",
    category: "Servicing",
    price: "From €120",
    images: [
      "/Injector/injector-1.jpeg",
      "/Injector/injector-2.jpeg",
      "/Injector/injector-3.jpeg",
    ],
    video: "/Injector/InjectorVid.mp4",
    hasVideo: true, // Video enabled for this product
    description: "Professional ultrasonic fuel injector cleaning and testing service for petrol port injectors",
    fullDescription: "Professional non-disassembly cleaning service using ultrasonic and closed-loop forward and reverse cleaning technology for petrol port injectors.\n\n**Important:** This service is available for older-type petrol port injectors only. Not suitable for direct injection (GDI/FSI) systems.\n\n**Available for all makes and models** - Drop off/collection service available for non-BMW vehicles. For BMW models, we can provide remove and refit service - price on application.\n\n**Service includes:** Ultrasonic cleaning, closed-loop forward and reverse flow testing, spray pattern analysis, and leak testing. Service can be provided while you wait.",
    features: [
      "Ultrasonic cleaning technology",
      "Closed-loop forward and reverse flow cleaning",
      "Spray pattern analysis and testing",
      "Leak testing included",
      "Available while you wait",
      "Suitable for all makes and models",
      "Professional testing report provided",
      "Restores fuel economy and performance",
    ],
    specifications: {
      "Service Time": "While you wait (approx 30 minutes)",
      "Injector Types": "Petrol port injectors only",
      "Availability": "All makes and models",
      "BMW Service": "Remove & refit available (POA)",
    },
    compatibility: "This service is for older-type petrol port fuel injectors only. Not compatible with direct injection systems (GDI, FSI, TFSI, etc.). Available for all vehicle makes and models.",
    installation: "**Drop off/Collection:** Available for all makes and models - bring your injectors to us.\n\n**BMW Models:** We can remove and refit injectors for you - price on application. Contact us for a quote.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Number of Injectors",
        choices: [
          "4 Injectors - €120",
          "6 Injectors - €160",
        ],
      },
    },
    // Enhanced SEO fields
    seoTitle: "Fuel Injector Cleaning Service Ireland | Ultrasonic Injector Cleaning Tipperary",
    seoDescription: "Professional petrol fuel injector cleaning service in Ireland. Ultrasonic cleaning, flow testing & spray pattern analysis. From €120. While-you-wait service available. All makes & models.",
    seoKeywords: [
      "fuel injector cleaning Ireland",
      "injector cleaning service",
      "ultrasonic injector cleaning",
      "petrol injector cleaning Tipperary",
      "fuel injector testing",
      "injector flow testing",
      "car injector cleaning",
      "fuel injector service near me",
      "injector cleaning Dublin",
      "injector cleaning Cork",
      "BMW injector cleaning",
      "Audi injector cleaning",
      "VW injector cleaning",
      "fuel injector repair Ireland",
    ],
    serviceArea: "Tipperary, Dublin, Cork, Limerick, Waterford, Galway - Nationwide Service Available",
    faqs: [
      {
        question: "How much does fuel injector cleaning cost in Ireland?",
        answer: "Our professional fuel injector cleaning service starts from €120 for 4 injectors and €160 for 6 injectors. This includes ultrasonic cleaning, flow testing, spray pattern analysis, and leak testing."
      },
      {
        question: "How long does injector cleaning take?",
        answer: "Our fuel injector cleaning service typically takes approximately 30 minutes. We offer a while-you-wait service so you can have your injectors cleaned and tested on the spot."
      },
      {
        question: "What types of injectors can you clean?",
        answer: "We clean older-type petrol port fuel injectors for all makes and models. This service is not suitable for direct injection systems (GDI, FSI, TFSI). If you're unsure, contact us with your vehicle details."
      },
      {
        question: "Do you offer injector cleaning for all car brands?",
        answer: "Yes! We offer fuel injector cleaning for all makes and models including BMW, Audi, VW, Mercedes, Toyota, Honda, Ford, and more. Drop-off service available for all vehicles."
      },
      {
        question: "What are the signs that my fuel injectors need cleaning?",
        answer: "Common signs include rough idle, poor fuel economy, engine misfires, hesitation during acceleration, failed emissions tests, and the check engine light. Dirty injectors can cause up to 25% loss in fuel efficiency."
      },
      {
        question: "Can you remove and refit injectors for me?",
        answer: "For BMW models, we offer a remove and refit service - price on application. For other vehicles, you can drop off the injectors or arrange collection. Contact us for a quote."
      },
      {
        question: "Where are you located?",
        answer: "We are located in Ardfinnan, Co. Tipperary, E91YX50. We serve customers from Dublin, Cork, Limerick, Waterford, Galway and nationwide. Many customers travel to us for our specialist services."
      },
    ],
  },
  {
    id: 9,
    slug: "intake-manifold-cleaning-walnut-blasting",
    name: "Intake Manifold Cleaning / Walnut Blasting",
    category: "Servicing",
    price: "From €285",
    images: [
      "/intake1.jpg",
      "/intake4.jpg",
      "/intake2.jpg",
      "/intake3.jpg",
      "/swirl-removal1.jpg",
    ],
    description: "Professional diesel intake manifold chemical cleaning and walnut blasting service",
    fullDescription: "Comprehensive intake manifold cleaning service for diesel BMWs. Our service removes carbon deposits that accumulate over time from EGR and PCV systems, restoring airflow and preventing costly failures.\n\n**This service includes:** Complete manifold removal and inspection, intensive chemical cleaning, gasket replacement, and optional walnut blasting for intake ports. We also offer swirl flap removal and blanking for preventative maintenance.",
    blogPostUrl: "/blog/diesel-intake-manifold-cleaning-preventative-maintenance",
    blogPostLabel: "Learn More About This Service",
    features: [
      "Complete intake manifold removal and inspection",
      "Intensive chemical cleaning to remove all carbon deposits",
      "New gaskets and seals included",
      "Swirl flap inspection and condition report",
      "Optional walnut blasting for intake ports",
      "Optional swirl flap delete with ECU coding",
      "Restores engine performance and fuel economy",
      "Prevents catastrophic swirl flap failure",
    ],
    specifications: {
      "Service Time": "Full day service",
      "Warranty": "6 months on workmanship",
      "Compatible Models": "N47, B47, N57, B57 diesel engines",
      "Recommended Interval": "Every 100,000 km",
    },
    compatibility: "Compatible with BMW diesel engines including N47 (4-cylinder), B47 (4-cylinder), N57 (6-cylinder), and B57 (6-cylinder). Contact us to confirm compatibility with your specific model.",
    installation: "Vehicle is required for a full day. Service includes manifold removal, chemical cleaning, new gaskets, and reassembly. Walnut blasting and swirl flap delete are optional add-ons.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Intake Manifold Chemical Cleaning",
        choices: ["Chemical Cleaning - €285"],
      },
      dropdown2: {
        label: "Engine Gaskets (Required)",
        choices: [
          "N47 Engine Gaskets - €65",
          "B47 / N57 / B57 Engine Gaskets - €30",
        ],
      },
      dropdown3: {
        label: "Walnut Blasting of Intake Ports (Optional)",
        choices: [
          "No Walnut Blasting - €0",
          "4 Cylinder Walnut Blasting - €300",
          "6 Cylinder Walnut Blasting - €450",
        ],
      },
      dropdown4: {
        label: "Swirl Flap Removal & Blanking (Optional)",
        choices: [
          "No Swirl Flap Work - €0",
          "Swirl Flap Delete - €280",
          "Swirl Flap Delete + Stage 1 Remap - €320",
        ],
      },
    },
  },
  {
    id: 10,
    slug: "zf-dct-transmission-service",
    name: "ZF / DCT Transmission Service",
    category: "Servicing",
    price: "From €550",
    images: [
      "/zf-transmission-service.jpg",
      "/zf-image2.jpg",
      "/zf-image3.jpg",
    ],
    description: "Professional ZF & DCT transmission service with high-quality parts and dealer-level tools",
    fullDescription: "Comprehensive transmission service using high-quality ZF parts and oil. All procedures are done to the highest standard using dealer-level tools and diagnostics.\n\n**Important:** Your car needs to be left overnight the day prior to the booking date to allow the transmission to cool down to the required temperature for proper servicing.",
    features: [
      "High quality ZF parts and oil",
      "Dealer-level tools and diagnostics",
      "Performed to highest standards",
      "Choice of genuine or premium aftermarket fluids",
      "Overnight cooling period included",
      "Professional transmission inspection",
    ],
    specifications: {
      "Service Type": "Complete Transmission Service",
      "Fluids Available": "Genuine ZF, Aftermarket (exceeds ZF spec), Liqui Moly DCT",
      "Service Time": "Vehicle required overnight + service day",
      "Tools Used": "Dealer-level diagnostic equipment",
      "Quality Standard": "Highest professional standard",
    },
    compatibility: "Compatible with all F/G series BMW models with 8-speed ZF transmissions, Hybrid transmissions, and DCT transmissions (M3/M4/M5 etc)",
    installation: "Your vehicle must be left with us overnight the day prior to your booking date. This allows the transmission to cool down to the required temperature for accurate fluid capacity measurement and optimal service results. Service is completed the following day.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Transmission Type",
        choices: [
          "F/G series Diesel/Petrol 8 Speed ZF Transmission",
          "F/G series Hybrid ZF Transmission",
          "DCT Transmission (M3/M4/M5 etc)",
        ],
      },
      dropdown2: {
        label: "Fluid Type",
        choices: [
          "Genuine ZF Fluid",
          "Aftermarket Fluid (exceeds ZF specifications)",
          "Liqui Moly 8100 Fluid (DCT only)",
        ],
      },
    },
  },
  {
    id: 12,
    slug: "bmw-f10-lci-headlight",
    name: "BMW F10 LCI Xenon Headlight",
    category: "Exterior",
    price: "€850",
    images: [
      "/headlights/LCI%20Xenon.JPEG",
      "/headlights/LCI%20Xenon%20Back.JPEG",
      "/headlights/LCI%20Xenon%20Label.JPEG",
    ],
    description: "RHD LCI xenon headlight for BMW F10/F11 5 Series",
    fullDescription: "RHD (Right-Hand Drive) LCI xenon headlight for BMW F10 and F11 5 Series models. These are bare headlight units ready for installation, with the correct beam pattern for Irish and UK roads.\n\n**Important:** Many competitors sell LHD (Left-Hand Drive) headlights which have an incorrect beam pattern and will fail NCT. Our headlights are RHD units.\n\n**[Unsure if this is the right headlight for your vehicle?](/blog/bmw-f10-headlight-types-guide-repair-resealing)**",
    features: [
      "RHD beam pattern - NCT legal",
      "Correct for Irish/UK roads",
      "Plug-and-play installation",
      "Coding included with fitting",
      "No modifications required",
    ],
    specifications: {
      "Condition": "New",
      "Type": "LCI Xenon (Bi-Xenon)",
      "Drive Side": "Right-Hand Drive (RHD)",
      "Compatibility": "BMW F10/F11 LCI (2013-2017)",
      "Bulb Type": "D1S Xenon",
      "Warranty": "1 Year",
    },
    blogPostUrl: "/blog/bmw-f10-headlight-types-guide-repair-resealing",
    blogPostLabel: "Learn More About F10 Headlights",
    compatibility: "Compatible with BMW F10 Saloon and F11 Touring LCI models (2013-2017). Not compatible with pre-LCI models (2010-2013). Please confirm your vehicle's production date before ordering.",
    installation: "Installation service available. Headlight coding/initialisation is required after fitting and is included when we perform the installation. If purchasing for self-install, coding will be required separately.",
    inStock: true,
    featured: true,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Side",
        choices: ["Driver Side (Right)", "Passenger Side (Left)", "Pair (Both Sides)"],
      },
      dropdown2: {
        label: "TMS Module",
        choices: ["No TMS Module", "1x New TMS Module (+€120)", "2x New TMS Modules (+€220)"],
      },
      dropdown3: {
        label: "Xenon Bulb",
        choices: ["No New Bulbs", "1x New D1S Xenon Bulb (+€40)", "2x New D1S Xenon Bulbs (+€80)"],
      },
      dropdown4: {
        label: "DRL Modules (2 per headlight)",
        choices: ["No New DRL Modules", "1x New DRL Module (+€50)", "2x New DRL Modules (+€80)", "3x New DRL Modules (+€130)", "4x New DRL Modules (+€160)"],
      },
      dropdown5: {
        label: "Xenon Igniter Ballast",
        choices: ["No Igniter Ballast", "1x New Xenon Igniter Ballast (+€100)", "2x New Xenon Igniter Ballasts (+€200)"],
      },
      dropdown6: {
        label: "Installation",
        choices: ["Headlight Only (Self Install)", "Fitted + Coded (+€135)"],
      },
    },
  },
  {
    id: 13,
    slug: "bmw-advanced-car-eye-dashcam",
    name: "BMW Advanced Car Eye Dashcam",
    category: "Accessories",
    price: "From €300",
    images: [
      "/ACE/ace-3.0.png",
      "/ACE/ace-3.1.png",
      "/ACE/ace-3.0-fr.png",
    ],
    description: "Genuine BMW Advanced Car Eye dashcam system with professional installation",
    fullDescription: `The BMW Advanced Car Eye is the official BMW dashcam solution, designed to integrate seamlessly with your vehicle. We offer both the **ACE 3.1** and the premium **ACE 3.0 PRO** models.

The **ACE 3.1** is the latest generation with a compact, screenless design featuring 3K resolution and smartphone app control. Perfect for a discreet, hidden installation.

The **ACE 3.0 PRO** includes both front and rear cameras as standard, a built-in 3.5" touchscreen display, voice control, and extended 48-hour parking mode. Ideal for drivers wanting complete coverage with instant playback.`,
    features: [
      "Genuine BMW/MINI accessory",
      "Professional hidden wiring installation",
      "Parking mode with motion detection",
      "GPS speed and location recording",
      "WiFi connectivity for smartphone app",
      "G-sensor incident detection",
      "Loop recording with auto-overwrite",
      "High-resolution day and night recording",
    ],
    specifications: {
      "ACE 3.1 Front Resolution": "3K (2560 x 1440)",
      "ACE 3.1 Rear Resolution": "1080p Full HD (optional)",
      "ACE 3.0 PRO Front Resolution": "2K (2560 x 1440)",
      "ACE 3.0 PRO Rear Resolution": "1080p Full HD (included)",
      "ACE 3.0 PRO Display": "3.5\" Touchscreen",
      "Storage": "64GB MicroSD included (supports up to 128GB)",
      "Connectivity": "WiFi / Bluetooth",
      "Parking Mode": "Motion-activated",
      "Warranty": "2 Years",
    },
    compatibility: "Compatible with all BMW and MINI models. The dashcam connects to the vehicle's power supply for seamless operation and automatic parking mode activation.",
    installation: "Professional installation includes hidden wiring through the headliner and A-pillar, direct power connection to the vehicle's fuse box, and full system setup. All wiring is completely hidden for a factory-fitted appearance.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Model",
        choices: ["ACE 3.1 Front Only", "ACE 3.1 Front + Rear", "ACE 3.0 PRO (Front + Rear)"],
      },
      dropdown2: {
        label: "Professional Fitting",
        choices: ["Dashcam Only (No Fitting)", "Include Professional Fitting"],
      },
    },
    faqs: [
      {
        question: "What's the difference between ACE 3.1 and 3.0 PRO?",
        answer: "The ACE 3.1 is a compact, screenless design that uses a smartphone app for viewing footage, with 3K front resolution (rear camera optional). The 3.0 PRO includes both front and rear cameras as standard, features a built-in 3.5\" touchscreen, 2K resolution, and premium features like voice control and longer parking mode recording."
      },
      {
        question: "Do I need professional fitting?",
        answer: "While the dashcam can be self-installed, professional fitting ensures hidden wiring, direct power connection for parking mode, and a factory-fitted appearance. We route all cables through the headliner and A-pillar so nothing is visible."
      },
      {
        question: "Does the dashcam work when the car is parked?",
        answer: "Yes, both models feature parking mode with motion detection. When professional fitting is chosen, we connect directly to your vehicle's power supply for automatic parking mode activation."
      },
      {
        question: "What storage capacity is included?",
        answer: "All BMW Advanced Car Eye dashcams come with a 64GB MicroSD card included. The cameras support up to 128GB SD cards if you need additional storage capacity. We recommend high-endurance cards designed for dashcams for optimal performance."
      },
      {
        question: "Is the footage admissible for insurance claims?",
        answer: "Yes, the GPS-stamped footage with date, time, location, and speed data is accepted by insurance companies and can be invaluable for accident claims or disputes."
      },
    ],
  },
  {
    id: 14,
    slug: "carplay-android-auto-retrofit",
    name: "Apple CarPlay & Android Auto Retrofit",
    category: "Interior",
    price: "From €340",
    images: [
      "/MMI/mmi1.png",
      "/MMI/f10.png",
      "/MMI/f30.png",
    ],
    description: "Retrofit Apple CarPlay and Android Auto to your BMW with MMI Box or Aftermarket Screen",
    fullDescription: `Add wireless Apple CarPlay and Android Auto to your BMW with our professional retrofit solutions. We offer two options depending on your vehicle and preferences.

The **MMI Box** connects to your existing iDrive screen, keeping the original OEM appearance while adding CarPlay/Android Auto functionality. Control is via the iDrive controller.

The **Aftermarket Screen** replaces your original display with a larger 10.25" touchscreen. This Linux-based unit runs CarPlay and Android Auto only - it is not a standalone Android tablet. Touch control works exclusively within CarPlay/Android Auto.

All options include professional fitting and full system integration.`,
    features: [
      "Wireless Apple CarPlay",
      "Wireless Android Auto",
      "Professional installation included",
      "Retains original iDrive functions",
      "High-quality audio output",
      "Steering wheel controls retained",
      "Reverse camera integration available",
      "Full system integration",
    ],
    specifications: {
      "MMI Box Compatibility": "F-Series and G-Series BMW",
      "Screen Size (Aftermarket)": "10.25 inches",
      "Screen Type": "Linux-based CarPlay/Android Auto",
      "Connection": "Wireless",
      "Installation": "Professional fitting included",
      "Warranty": "12 months",
    },
    compatibility: "MMI Box available for F-Series and G-Series BMW models. Aftermarket screens currently available for F10 (CIC & NBT) and F30 (NBT) models. Contact us for other vehicle compatibility.",
    installation: "All prices include professional fitting. Installation typically takes 2-3 hours. Your vehicle's original iDrive functionality is retained alongside the new CarPlay/Android Auto features.",
    inStock: true,
    featured: false,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "Solution Type",
        choices: ["MMI Box (Uses Original Screen)", "Aftermarket Screen (10.25\" Touchscreen)"],
      },
      dropdown2: {
        label: "Vehicle / System",
        choices: ["F-Series BMW", "G-Series BMW", "F10 CIC", "F10 NBT", "F30 NBT"],
      },
    },
    faqs: [
      {
        question: "What's the difference between MMI Box and Aftermarket Screen?",
        answer: "The MMI Box plugs into your existing screen and adds CarPlay/Android Auto while keeping the original OEM look. You control it via the iDrive controller. The Aftermarket Screen replaces your original display with a larger 10.25\" touchscreen - you can touch the screen directly but only for CarPlay/Android Auto functions."
      },
      {
        question: "Is the aftermarket screen an Android tablet?",
        answer: "No. Our aftermarket screens are Linux-based and run Apple CarPlay and Android Auto only. They are not standalone Android tablets. This keeps the system simple, fast, and reliable."
      },
      {
        question: "Will I lose my original iDrive functions?",
        answer: "No. With the MMI Box, your original iDrive remains fully functional. With the Aftermarket Screen, you can switch between CarPlay/Android Auto and your original iDrive system."
      },
      {
        question: "Is the connection wireless?",
        answer: "Yes, both solutions offer wireless Apple CarPlay and Android Auto. Simply connect your phone once and it will automatically connect when you enter the vehicle."
      },
      {
        question: "Which option is right for me?",
        answer: "Choose the MMI Box if you want to keep the original OEM look and are happy controlling CarPlay via the iDrive controller. Choose the Aftermarket Screen if you want a larger display with direct touchscreen control for CarPlay/Android Auto."
      },
    ],
  },
];

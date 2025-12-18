// Product data structure and content

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  images: string[];
  video?: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: Record<string, string>;
  compatibility: string;
  installation: string;
  inStock: boolean;
  featured: boolean;
  hasOptions?: boolean;
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
    name: "Apple Carplay Activation",
    category: "Coding",
    price: "€120",
    images: [
      "https://ugc.same-assets.com/ZYcC0FiVMWt6f2DvyGPJnnuf9Hm4VjKU.jpeg",
      "https://ugc.same-assets.com/7FUCGn0BN9xx_0CqNKxEZ5sKjodzW38m.jpeg",
      "https://ugc.same-assets.com/eKaZHPQFw20AKHNdoBOFUhQdPrQZPlxT.jpeg",
      "https://ugc.same-assets.com/wnmOcqF4xZEwYmpMxkv7YNiYk_oLw00A.jpeg",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "In-House Apple CarPlay activation service",
    fullDescription: "Enable Native Apple carplay in cars with NBT EVO idrive system",
    features: [
      "Natively supported",
      "Fullscreen support",
      "No aftermarket adepters",
      "Right Hand Drive",
      "High Quality Wifi antenna fitting included",
      "Wireless Connectivity",
    ],
    specifications: {
      "Service Type": "Coding",
      "iDrive System": "NBT EVO",
      "Connection": "Wireless",
      "Installation": "In-House",
      "Service Time": "30 minutes",
      "Warranty": "12 months",
    },
    compatibility: "Compatible with BMW models equipped with NBT EVO iDrive system. Not compatible with CIC or NBT systems.",
    installation: "In-House installation service. Includes high-quality WiFi antenna fitting and full system coding. Service time approximately 30 minutes",
    inStock: true,
    featured: true,
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
    installation: "In-House professional installation. Car or Headlights need to be dropped off and left for 1 day. By appointment only",
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
    featured: true,
    hasOptions: true,
    options: {
      dropdown1: {
        label: "System Type",
        choices: ["2 Color (CIC System)", "9 Color (NBT System)"],
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
    featured: true,
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
];

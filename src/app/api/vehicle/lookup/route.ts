import { NextRequest, NextResponse } from 'next/server';

// BMW API Configuration based on official specs
const BMW_API_BASE = 'https://apim.bmwgroup.com/aftersales';
const BMW_AUTH_URL = 'https://auth.bmwgroup.com/auth/oauth2/machine2machine/access_token';

// Environment variables
const BMW_API_KEY = process.env.BMW_API_KEY;
const BMW_CLIENT_ID = process.env.BMW_CLIENT_ID;
const BMW_CLIENT_SECRET = process.env.BMW_CLIENT_SECRET;

// Token cache
let tokenCache: {
  accessToken: string;
  expiresAt: number;
} | null = null;

// Get OAuth2 access token using client credentials flow
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
    return tokenCache.accessToken;
  }

  if (!BMW_CLIENT_ID || !BMW_CLIENT_SECRET) {
    throw new Error('BMW OAuth credentials not configured');
  }

  const response = await fetch(BMW_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'machine2machine',
      client_id: BMW_CLIENT_ID,
      client_secret: BMW_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OAuth token error:', response.status, errorText);
    throw new Error('Failed to obtain access token');
  }

  const data = await response.json();
  const expiresIn = parseInt(data.expires_in || '7199', 10);

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return tokenCache.accessToken;
}

// Build headers for BMW API requests
async function buildHeaders(acceptType: string = 'application/json'): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Accept': acceptType,
  };

  // Add API key if available
  if (BMW_API_KEY) {
    headers['x-apikey'] = BMW_API_KEY;
  }

  // Get OAuth token
  try {
    const accessToken = await getAccessToken();
    headers['Authorization'] = `Bearer ${accessToken}`;
  } catch {
    console.warn('Could not obtain OAuth token, proceeding with API key only');
  }

  return headers;
}

// Vehicle Basic Response Types
interface VehicleBasicResponse {
  'vehicle-basic': {
    vehicle: {
      vinLong: string;
      vinShort: string;
      vinWorld: string;
      vinType: string;
      vinConst: string;
      vinCheck: string;
      vinYear: string;
      vehicleType: {
        brand: string;
        modelCode: string;
        internalModelCode: string;
        seriesDevt: string;
        series: string;
        model: string;
        powerTransm: string;
        country: string;
        bodyType: string;
        steering: string;
        doorCount: string;
        cubicCapacity: string;
        hybrid: string;
        transmissionType: string;
        engineType: {
          cylinders: string;
          engineType: string;
          fuelType: string;
        };
      };
      plant: {
        plant: string;
      };
      equipment: {
        colour: {
          colour: string;
          colourCode: string;
          colourType: string;
        };
        upholstery: {
          upholstery: string;
          upholsteryCode: string;
          upholsteryType: string;
        };
        colourSowu?: {
          colour: string;
          colourCode: string;
          colourType: string;
        };
        upholsteryAdditional?: {
          upholstery: string;
          upholsteryCode: string;
          upholsteryType: string;
        };
        rims?: {
          rimCode: string;
          rimSupplier: string;
          rimType: string;
        };
        tyres?: {
          tyreCode: string;
        };
      };
      powerOTDH: string;
      prodDate: string;
      marketSalesDescription?: string;
      marketspecSalesdesc?: {
        langcode: string;
        salesdesc: string;
      };
    };
  };
}

// Parse vehicle basic JSON response
function parseVehicleBasic(data: VehicleBasicResponse) {
  const vehicle = data['vehicle-basic']?.vehicle;
  if (!vehicle) {
    throw new Error('Invalid vehicle data response');
  }

  const vehicleType = vehicle.vehicleType || {};
  const equipment = vehicle.equipment || {};
  const engineType = vehicleType.engineType || {};

  return {
    // VIN Information
    vin: vehicle.vinLong,
    vinShort: vehicle.vinShort,
    vinWorld: vehicle.vinWorld,
    vinType: vehicle.vinType,
    vinYear: vehicle.vinYear,

    // Vehicle Type
    brand: vehicleType.brand,
    brandName: getBrandName(vehicleType.brand),
    modelCode: vehicleType.modelCode,
    seriesDevt: vehicleType.seriesDevt,
    series: vehicleType.series,
    model: vehicleType.model,
    bodyType: vehicleType.bodyType,
    bodyTypeName: getBodyTypeName(vehicleType.bodyType),
    steering: vehicleType.steering,
    steeringName: vehicleType.steering === 'LL' ? 'Left Hand Drive' : vehicleType.steering === 'RL' ? 'Right Hand Drive' : vehicleType.steering,
    doorCount: vehicleType.doorCount,
    transmissionType: vehicleType.transmissionType,
    transmissionName: getTransmissionName(vehicleType.transmissionType),
    powerTransmission: vehicleType.powerTransm,
    country: vehicleType.country,
    cubicCapacity: vehicleType.cubicCapacity,
    hybrid: vehicleType.hybrid,
    hybridName: getHybridName(vehicleType.hybrid),

    // Engine
    engineCode: engineType.engineType,
    cylinders: engineType.cylinders,
    fuelType: engineType.fuelType,
    fuelTypeName: getFuelTypeName(engineType.fuelType),

    // Production
    productionDate: vehicle.prodDate,
    plant: vehicle.plant?.plant,
    powerKW: vehicle.powerOTDH,
    marketSalesDescription: vehicle.marketSalesDescription || vehicle.marketspecSalesdesc?.salesdesc,

    // Equipment
    colorCode: equipment.colour?.colourCode,
    colorName: equipment.colour?.colour,
    colorType: equipment.colour?.colourType,
    upholsteryCode: equipment.upholstery?.upholsteryCode,
    upholsteryName: equipment.upholstery?.upholstery,
    upholsteryType: equipment.upholstery?.upholsteryType,

    // Additional colors (v3)
    interiorColorCode: equipment.colourSowu?.colourCode,
    interiorColorName: equipment.colourSowu?.colour,
    additionalUpholsteryCode: equipment.upholsteryAdditional?.upholsteryCode,
    additionalUpholsteryName: equipment.upholsteryAdditional?.upholstery,

    // Rims & Tyres
    rimCode: equipment.rims?.rimCode,
    rimType: equipment.rims?.rimType,
    rimSupplier: equipment.rims?.rimSupplier,
    tyreCode: equipment.tyres?.tyreCode,
  };
}

// Helper functions for human-readable names
function getBrandName(code: string): string {
  const brands: Record<string, string> = {
    'BM': 'BMW',
    'MI': 'MINI',
    'RR': 'Rolls-Royce',
    'MC': 'BMW Motorrad',
  };
  return brands[code] || code;
}

function getBodyTypeName(code: string): string {
  const bodyTypes: Record<string, string> = {
    'LIM': 'Sedan',
    'SAV': 'Sports Activity Vehicle (SAV)',
    'SAC': 'Sports Activity Coupe (SAC)',
    'COU': 'Coupe',
    'CAB': 'Convertible',
    'TOU': 'Touring (Wagon)',
    'HAT': 'Hatchback',
    'GCO': 'Gran Coupe',
    'GTO': 'Gran Tourer',
    'ROA': 'Roadster',
  };
  return bodyTypes[code] || code;
}

function getTransmissionName(code: string): string {
  const transmissions: Record<string, string> = {
    'A': 'Automatic',
    'M': 'Manual',
    'S': 'Sequential',
  };
  return transmissions[code] || code;
}

function getHybridName(code: string): string {
  const hybrids: Record<string, string> = {
    'NOHY': 'Non-Hybrid',
    'PHEV': 'Plug-in Hybrid',
    'MHEV': 'Mild Hybrid',
    'BEV': 'Battery Electric',
  };
  return hybrids[code] || code;
}

function getFuelTypeName(code: string): string {
  const fuels: Record<string, string> = {
    'B': 'Petrol (Benzin)',
    'D': 'Diesel',
    'E': 'Electric',
    'H': 'Hydrogen',
    'N': 'Natural Gas',
  };
  return fuels[code] || code;
}

// Parse vehicle options XML response
function parseVehicleOptions(xml: string): { options: Array<{ code: string; description: string; category: string }> } {
  const options: Array<{ code: string; description: string; category: string }> = [];

  // Parse each option from XML
  const optionRegex = /<option\s+id="([^"]+)"[^>]*>[\s\S]*?<value>([^<]*)<\/value>[\s\S]*?<category>([^<]*)<\/category>[\s\S]*?<\/option>/gi;
  let match;
  while ((match = optionRegex.exec(xml)) !== null) {
    options.push({
      code: match[1],
      description: match[2].trim(),
      category: match[3].trim(),
    });
  }

  return { options };
}

// Parse vehicle emissions JSON/XML response
function parseVehicleEmissions(data: Record<string, unknown>) {
  const emission = data.vehicleEmission as Record<string, unknown> || data;
  const wltp = emission.WLTP as Record<string, unknown> || {};
  const nedc = emission.NEDC as Record<string, unknown> || {};

  return {
    vinLong: emission.vinLong,
    ecTypeApproval: emission.ECTypeApproval,
    emissionClass: emission.emissionClass,
    wltpFlag: emission.wltpflag,

    // WLTP values (newer standard)
    wltp: {
      combinedCO2: wltp.WLTPCombinedCo2EmCombined,
      combinedFuelConsumption: wltp.WLTPCombinedFuelConsCombined,
      electricRange: wltp.WLTPLowElecRangePureElec,
      electricConsumption: wltp.WLTPCombinedElecEnergyConsCombined,
    },

    // NEDC values (older standard)
    nedc: {
      combinedCO2: nedc.NEDCCombinedCo2EmCombined,
      combinedFuelConsumption: nedc.NEDCCombinedFuelConsCombined,
      urbanFuelConsumption: nedc.NEDCUrbanFuelCons,
      extraUrbanFuelConsumption: nedc.NEDCExtraUrbanFuelCons,
    },
  };
}

// Validate VIN format
function validateVIN(vin: string): { valid: boolean; error?: string } {
  if (!vin) {
    return { valid: false, error: 'VIN is required' };
  }

  const cleanVin = vin.trim().toUpperCase();

  if (cleanVin.length !== 17) {
    return { valid: false, error: 'VIN must be exactly 17 characters' };
  }

  // VIN can only contain alphanumeric characters (no I, O, Q)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return { valid: false, error: 'Invalid VIN format. VIN cannot contain I, O, or Q.' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vin, type = 'basic', language = 'en-GB' } = body;

    // Validate VIN
    const validation = validateVIN(vin);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const cleanVin = vin.trim().toUpperCase();

    // Check API configuration
    if (!BMW_API_KEY && !BMW_CLIENT_ID) {
      return NextResponse.json(
        { error: 'BMW API not configured. Please set API credentials.' },
        { status: 500 }
      );
    }

    // Build endpoint based on type
    let endpoint: string;
    let acceptHeader: string;

    switch (type) {
      case 'options':
        endpoint = `/vehicle-identification/vehicle-options/v1?vin=${cleanVin}&language=${language}`;
        acceptHeader = 'application/xml';
        break;
      case 'emissions':
        endpoint = `/vehicle-identification/vehicle-emission/v1?vin=${cleanVin}`;
        acceptHeader = 'application/json';
        break;
      case 'basic':
      default:
        endpoint = `/vehicle-identification/vehicle-basic/v3?vin=${cleanVin}`;
        acceptHeader = 'application/json';
        break;
    }

    console.log(`[BMW API] Fetching ${type}: ${BMW_API_BASE}${endpoint}`);

    // Make API request
    const headers = await buildHeaders(acceptHeader);
    const response = await fetch(`${BMW_API_BASE}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const responseText = await response.text();
    console.log(`[BMW API] Response status: ${response.status}`);

    // Handle errors
    if (!response.ok) {
      console.error(`[BMW API] Error response:`, responseText.substring(0, 500));

      // Parse error message
      let errorMessage = 'Failed to fetch vehicle data';

      if (responseText.includes('<message>')) {
        const match = responseText.match(/<message>([^<]+)<\/message>/);
        if (match) errorMessage = match[1];
      } else if (responseText.includes('"message"')) {
        try {
          const jsonError = JSON.parse(responseText);
          errorMessage = jsonError.message || jsonError.error || errorMessage;
        } catch {
          // Ignore JSON parse error
        }
      }

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Vehicle not found. Please verify the VIN and try again.' },
          { status: 404 }
        );
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check API credentials.' },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // Parse response based on type
    let data;
    switch (type) {
      case 'options':
        data = parseVehicleOptions(responseText);
        break;
      case 'emissions':
        try {
          const jsonData = JSON.parse(responseText);
          data = parseVehicleEmissions(jsonData);
        } catch {
          data = { raw: responseText };
        }
        break;
      case 'basic':
      default:
        try {
          const jsonData = JSON.parse(responseText);
          data = parseVehicleBasic(jsonData);
        } catch {
          data = { raw: responseText };
        }
        break;
    }

    return NextResponse.json({ success: true, type, data });
  } catch (error) {
    console.error('[BMW API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler for convenience
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vin = searchParams.get('vin');
  const type = searchParams.get('type') || 'basic';
  const language = searchParams.get('language') || 'en-GB';

  if (!vin) {
    return NextResponse.json({ error: 'VIN query parameter is required' }, { status: 400 });
  }

  // Create a mock POST request
  const postBody = JSON.stringify({ vin, type, language });
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: postBody,
  });

  return POST(postRequest);
}

export type MaterialCategory = 
  | 'PLA' 
  | 'PLA+' 
  | 'PETG' 
  | 'TPU' 
  | 'ABS' 
  | 'Carbon Fiber' 
  | 'Polycarbonate';

export type FinishType = 
  | 'Matte' 
  | 'Silk' 
  | 'Gloss' 
  | 'Galaxy / Sparkle' 
  | 'Translucent' 
  | 'High-Speed';

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  inStock: boolean;
  image?: string;
  pantone?: string;
}

export interface TechnicalSpecs {
  diameter: '1.75 mm' | '2.85 mm';
  tolerance: '± 0.02 mm';
  roundness: string; // e.g. "≥ 98%" or "≥ 99%"
  density: string; // e.g. "1.24 g/cm³"
  spoolWeight: '1.0 kg' | '3.0 kg' | '5.0 kg' | 'Refill 1.0 kg';
  emptySpoolWeight: string; // e.g. "195 g"
  nozzleTemp: string; // e.g. "200 - 225 °C"
  bedTemp: string; // e.g. "50 - 65 °C"
  printSpeed: string; // e.g. "50 - 600 mm/s"
  fanSpeed: string; // e.g. "100%"
  tensileStrength: string; // e.g. "58 MPa"
  elongationAtBreak: string; // e.g. "6.5%"
  flexuralModulus: string; // e.g. "3100 MPa"
  heatDeflectionTemp: string; // e.g. "55 °C"
  dryingRecommendation?: string; // e.g. "50°C for 6 hours"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  material: MaterialCategory;
  finish: FinishType;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHighSpeed?: boolean;
  availableDiameters: ('1.75 mm' | '2.85 mm')[];
  availableWeights: ('1.0 kg' | '3.0 kg' | '5.0 kg' | 'Refill 1.0 kg')[];
  colors: ColorVariant[];
  specs: TechnicalSpecs;
  features: string[];
  recommendedUses: string[];
  images: string[];
  badge?: string;
}

export interface CartItem {
  id: string; // generated unique key: `${productId}-${colorId}-${diameter}-${weight}`
  productId: string;
  slug: string;
  name: string;
  material: MaterialCategory;
  color: ColorVariant;
  diameter: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  verified: boolean;
  date: string;
  rating: number;
  title: string;
  comment: string;
  printerUsed: string;
  colorName: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Cleanser' | 'Toner' | 'Serum' | 'Treatment' | 'Moisturizer' | 'Sunscreen' | 'Mask';
  description: string;
  imageUrl: string;
  priceTZS: number;
  priceUSD: number;
  stock: number;
  sku: string;
  skinTypes: ('Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive')[];
  concerns: ('Blemishes' | 'Dark Spots' | 'Dryness' | 'Oiliness' | 'Texture' | 'Redness' | 'Fine Lines')[];
  ingredients: string[];
  activeIngredients: string[];
  usageInstructions: string;
  applicationArea: string;
  frequency: 'morning' | 'evening' | 'both';
  waitIntervalSeconds: number; // e.g. 30, 60, 120
  durationSeconds: number; // application time e.g. 30-60s
  potentialIrritants: string[];
  avoidCombiningWith: string[];
  compatibleWith: string[];
  contraindications: string;
  whyRecommended?: string;
  isActive: boolean;
}

export interface UserProduct {
  id: string;
  userId: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
  activeIngredients: string[];
  usageInstructions: string;
  frequency: 'morning' | 'evening' | 'both' | 'as_needed';
  addedAt: string;
  imageUrl?: string;
}

export interface SkinFinding {
  concern: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number; // e.g. 87%
  visibleIndicators: string;
  location: string;
}

export interface SkinMetrics {
  blemishes: number; // 0-100 (higher = clearer/healthier)
  hydration: number;
  oilBalance: number;
  texture: number;
  pigmentation: number;
  redness: number;
}

export interface SkinAnalysis {
  id: string;
  userId: string;
  imageUrl?: string;
  angles: ('front' | 'left' | 'right')[];
  skinHealthScore: number;
  metrics: SkinMetrics;
  findings: SkinFinding[];
  estimatedAppearanceAge: number;
  appearanceAgeDisclaimer: string;
  dermatologyDisclaimer: string;
  createdAt: string;
}

export interface RoutineStep {
  stepNumber: number;
  category: string;
  productName: string;
  brand: string;
  productId?: string;
  instructions: string;
  durationSeconds: number;
  waitIntervalSeconds: number;
  whyRecommended: string;
  isUserProduct?: boolean;
}

export interface UserRoutine {
  id: string;
  userId: string;
  type: 'morning' | 'evening';
  targetTime: string; // e.g. "07:00"
  steps: RoutineStep[];
  safetyNotes: string[];
  updatedAt: string;
}

export interface WellnessScheduleItem {
  time: string;
  type: 'meal' | 'water' | 'snack' | 'routine' | 'wellness';
  title: string;
  description: string;
  hydrationMl?: number;
  completed?: boolean;
}

export interface WellnessPlan {
  id: string;
  userId: string;
  schedule: WellnessScheduleItem[];
  waterTargetMl: number;
  nutritionHighlights: string[];
  dietaryNote: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  type: 'morning_routine' | 'evening_routine' | 'meal' | 'hydration' | 'skin_scan' | 'progress_review';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  completed: boolean;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  ageRange: string;
  gender?: string;
  country: string;
  skinType: 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';
  skinConcerns: string[];
  allergies: string;
  lifestyle: string;
  dietPreferences: string;
  dailySchedule: {
    wakeTime: string;
    workStart: string;
    workEnd: string;
    exerciseTime: string;
    sleepTime: string;
  };
  subscriptionTier: 'free' | 'start' | 'high';
  allowPhotoStorage: boolean;
  notificationSettings: {
    morningSkincare: boolean;
    eveningSkincare: boolean;
    nutrition: boolean;
    water: boolean;
    weeklyReport: boolean;
    marketing: boolean;
    emailDigests: boolean;
  };
  createdAt: string;
}

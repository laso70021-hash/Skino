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
  severity: 'Low' | 'Mild' | 'Moderate' | 'High' | 'Severe';
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

export interface RadarMetrics {
  hydration: number;
  sebum: number;
  pores: number;
  spots: number;
  wrinkles: number;
  texture: number;
}

export interface FacialZoneInfo {
  observation: string;
  metric: number;
  severity: 'Low' | 'Mild' | 'Moderate' | 'High' | 'Severe' | 'Normal';
  recommendation: string;
}

export interface FacialHeatmapItem {
  intensity: number; // 0-100
  areaRatio: number; // percentage of observed facial area
}

export interface SkinAnalysis {
  id: string;
  userId: string;
  imageUrl?: string;
  angles: ('front' | 'left' | 'right')[];
  skinHealthScore: number;
  metrics: SkinMetrics;
  radarMetrics?: RadarMetrics;
  facialZones?: {
    forehead?: FacialZoneInfo;
    leftCheek?: FacialZoneInfo;
    rightCheek?: FacialZoneInfo;
    nose?: FacialZoneInfo;
    chin?: FacialZoneInfo;
    underEye?: FacialZoneInfo;
  };
  facialHeatmap?: {
    oil?: FacialHeatmapItem;
    pores?: FacialHeatmapItem;
    redness?: FacialHeatmapItem;
    spots?: FacialHeatmapItem;
    wrinkles?: FacialHeatmapItem;
    texture?: FacialHeatmapItem;
    hydration?: FacialHeatmapItem;
  };
  findings: SkinFinding[];
  estimatedAppearanceAge: number;
  appearanceAgeDisclaimer: string;
  dermatologyDisclaimer: string;
  modelVersion?: string;
  analysisVersion?: string;
  createdAt: string;
}

export type SubscriptionTier =
  | 'free'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'enterprise'
  | 'start'
  | 'high';

export interface PlanEntitlements {
  aiAnalysis: boolean;
  guidedScan: boolean;
  facialMapping: boolean;
  multiZoneAnalysis: boolean;
  heatmaps: boolean;
  detailedMetrics: boolean;
  radarChart: boolean;
  advancedRecommendations: boolean;
  productMatching: boolean;
  aiCoachPersonalization: boolean;
  historicalComparison: boolean;
  advancedProgress: boolean;
  routineIntelligence: boolean;
  downloadableReports: boolean;
  professionalReports: boolean;
  advancedPrivacy: boolean;
  organizationTeam: boolean;
  scannerIntegration: boolean;
  monthlyScans: number;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  priceTZS: number;
  priceUSD: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  entitlements: PlanEntitlements;
  highlighted?: boolean;
  badge?: string;
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
  subscriptionTier: SubscriptionTier;
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

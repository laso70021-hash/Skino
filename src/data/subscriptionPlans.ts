import { SubscriptionPlan, SubscriptionTier, PlanEntitlements } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Essential AI skin check and baseline formulation guidance',
    priceTZS: 0,
    priceUSD: 0,
    billingPeriod: 'monthly',
    badge: 'Baseline',
    features: [
      'Basic AI multi-angle facial scan',
      'Camera and photo upload support',
      'Basic concern identification (Blemishes, Sebum, Redness)',
      'Basic product catalog recommendations',
      'Morning and evening routine suggestions',
      '3 scans per month'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: false,
      facialMapping: false,
      multiZoneAnalysis: false,
      heatmaps: false,
      detailedMetrics: false,
      radarChart: false,
      advancedRecommendations: false,
      productMatching: false,
      aiCoachPersonalization: false,
      historicalComparison: false,
      advancedProgress: false,
      routineIntelligence: false,
      downloadableReports: false,
      professionalReports: false,
      advancedPrivacy: false,
      organizationTeam: false,
      scannerIntegration: false,
      monthlyScans: 3
    }
  },
  {
    id: 'bronze',
    name: 'Bronze',
    tagline: 'Guided scanning and multi-area facial clarity for active routines',
    priceTZS: 24000,
    priceUSD: 9,
    billingPeriod: 'monthly',
    badge: 'Starter',
    features: [
      'Everything in Free plan',
      'Live camera face alignment & lighting check',
      'Image quality validation engine',
      'Multi-area facial analysis (T-Zone, Cheeks, Chin)',
      'Extended routine duration & wait interval timers',
      '10 AI scans per month'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: true,
      facialMapping: true,
      multiZoneAnalysis: true,
      heatmaps: false,
      detailedMetrics: false,
      radarChart: false,
      advancedRecommendations: false,
      productMatching: false,
      aiCoachPersonalization: false,
      historicalComparison: true,
      advancedProgress: false,
      routineIntelligence: false,
      downloadableReports: false,
      professionalReports: false,
      advancedPrivacy: false,
      organizationTeam: false,
      scannerIntegration: false,
      monthlyScans: 10
    }
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Facial heatmaps, 5-axis radar chart, and deep concern metrics',
    priceTZS: 49000,
    priceUSD: 19,
    billingPeriod: 'monthly',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Everything in Bronze plan',
      'Interactive Facial Heatmaps (Oil, Pores, Redness, Spots, Texture, Wrinkles)',
      'Multi-dimensional 5-axis Radar Chart',
      'Detailed quantitative health metrics (0-100)',
      'Zone-by-zone facial report (Forehead, Cheeks, Nose, Chin)',
      'Active ingredient compatibility engine',
      'Personalized Skina AI Coach with context',
      '25 AI scans per month'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: true,
      facialMapping: true,
      multiZoneAnalysis: true,
      heatmaps: true,
      detailedMetrics: true,
      radarChart: true,
      advancedRecommendations: true,
      productMatching: true,
      aiCoachPersonalization: true,
      historicalComparison: true,
      advancedProgress: false,
      routineIntelligence: true,
      downloadableReports: false,
      professionalReports: false,
      advancedPrivacy: true,
      organizationTeam: false,
      scannerIntegration: false,
      monthlyScans: 25
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Aligned before/after comparison, circadian schedule, and journey tracking',
    priceTZS: 99000,
    priceUSD: 39,
    billingPeriod: 'monthly',
    badge: 'Intelligence',
    features: [
      'Everything in Silver plan',
      'Aligned Before/After scan comparison (Side-by-Side & Slider)',
      'Longitudinal skin journey timeline & milestone trends',
      'AI Circadian Daily Schedule reorganization',
      'Automated product matching from catalog profile',
      'Downloadable personal skin report',
      'Gmail routine digest integration',
      '50 AI scans per month'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: true,
      facialMapping: true,
      multiZoneAnalysis: true,
      heatmaps: true,
      detailedMetrics: true,
      radarChart: true,
      advancedRecommendations: true,
      productMatching: true,
      aiCoachPersonalization: true,
      historicalComparison: true,
      advancedProgress: true,
      routineIntelligence: true,
      downloadableReports: true,
      professionalReports: false,
      advancedPrivacy: true,
      organizationTeam: false,
      scannerIntegration: false,
      monthlyScans: 50
    }
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tagline: 'Clinical-grade analytical depth, unlimited scans, and professional PDF reports',
    priceTZS: 199000,
    priceUSD: 79,
    billingPeriod: 'monthly',
    badge: 'Premium',
    features: [
      'Everything in Gold plan',
      'Unlimited AI skin scans & real-time re-assessments',
      'Highest resolution image processing pipeline',
      'Professional-grade clinical PDF skin reports',
      'Priority AI processing queue (Gemini 3.8 Flash)',
      'Advanced longitudinal tracking across months',
      'Advanced privacy controls (instant photo purge & data export)',
      'VIP priority skincare advisory'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: true,
      facialMapping: true,
      multiZoneAnalysis: true,
      heatmaps: true,
      detailedMetrics: true,
      radarChart: true,
      advancedRecommendations: true,
      productMatching: true,
      aiCoachPersonalization: true,
      historicalComparison: true,
      advancedProgress: true,
      routineIntelligence: true,
      downloadableReports: true,
      professionalReports: true,
      advancedPrivacy: true,
      organizationTeam: false,
      scannerIntegration: false,
      monthlyScans: 9999
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Multi-staff clinic management, patient profiles, and scanner hardware integration',
    priceTZS: 750000,
    priceUSD: 299,
    billingPeriod: 'monthly',
    badge: 'Clinical & Clinic',
    features: [
      'Everything in Platinum plan',
      'Multi-staff organization account (dermatologists, clinicians, estheticians)',
      'Patient & customer skin profiles and history management',
      'Clinical scanner & hardware integration architecture (UV, Cross-Polarized)',
      'Organization analytics and aggregated concern telemetry',
      'White-label & custom clinic branding',
      'Audit logging & enterprise data compliance',
      'Dedicated API access'
    ],
    entitlements: {
      aiAnalysis: true,
      guidedScan: true,
      facialMapping: true,
      multiZoneAnalysis: true,
      heatmaps: true,
      detailedMetrics: true,
      radarChart: true,
      advancedRecommendations: true,
      productMatching: true,
      aiCoachPersonalization: true,
      historicalComparison: true,
      advancedProgress: true,
      routineIntelligence: true,
      downloadableReports: true,
      professionalReports: true,
      advancedPrivacy: true,
      organizationTeam: true,
      scannerIntegration: true,
      monthlyScans: 99999
    }
  }
];

export function getEntitlementsForTier(tier: SubscriptionTier): PlanEntitlements {
  // Normalize legacy tiers
  const normalizedTier = tier === 'start' ? 'bronze' : tier === 'high' ? 'gold' : tier;
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === normalizedTier);
  return (
    plan?.entitlements ||
    SUBSCRIPTION_PLANS[0].entitlements
  );
}

export function getPlanDetails(tier: SubscriptionTier): SubscriptionPlan {
  const normalizedTier = tier === 'start' ? 'bronze' : tier === 'high' ? 'gold' : tier;
  return SUBSCRIPTION_PLANS.find(p => p.id === normalizedTier) || SUBSCRIPTION_PLANS[0];
}

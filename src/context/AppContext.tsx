import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import {
  auth,
  db,
  initAuth,
  logOut as firebaseLogout,
  getCachedAccessToken,
  setCachedAccessToken
} from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  CatalogProduct,
  UserProduct,
  SkinAnalysis,
  UserRoutine,
  WellnessPlan,
  CalendarEvent,
  UserProfile
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  catalogProducts: CatalogProduct[];
  userProducts: UserProduct[];
  analyses: SkinAnalysis[];
  latestAnalysis: SkinAnalysis | null;
  morningRoutine: UserRoutine | null;
  eveningRoutine: UserRoutine | null;
  wellnessPlan: WellnessPlan | null;
  calendarEvents: CalendarEvent[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: 'TZS' | 'USD';
  setCurrency: (c: 'TZS' | 'USD') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isLoading: boolean;
  isSaving: boolean;
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  gmailToken: string | null;
  notificationPermission: NotificationPermission;
  requestPushNotifications: () => Promise<boolean>;
  sendLocalNotification: (title: string, body: string) => void;
  // Actions
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  saveAnalysis: (analysis: SkinAnalysis) => Promise<void>;
  deleteAnalysis: (analysisId: string) => Promise<void>;
  deleteAllPhotosAndScans: () => Promise<void>;
  saveRoutine: (routine: UserRoutine) => Promise<void>;
  saveWellnessPlan: (plan: WellnessPlan) => Promise<void>;
  addUserProduct: (product: Omit<UserProduct, 'id' | 'userId' | 'addedAt'>) => Promise<void>;
  deleteUserProduct: (productId: string) => Promise<void>;
  addCatalogProduct: (product: Omit<CatalogProduct, 'id'>) => Promise<void>;
  updateCatalogProduct: (productId: string, updates: Partial<CatalogProduct>) => Promise<void>;
  deleteCatalogProduct: (productId: string) => Promise<void>;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'userId'>) => Promise<void>;
  toggleCalendarEvent: (eventId: string) => Promise<void>;
  setSubscriptionTier: (tier: 'free' | 'start' | 'high') => Promise<void>;
  logout: () => Promise<void>;
  loginDemoUser: (role: 'user' | 'admin') => void;
  formatPrice: (priceTZS: number, priceUSD: number) => string;
}

const defaultProfile: UserProfile = {
  uid: 'guest_user',
  email: 'postkwanza@gmail.com',
  displayName: 'Amina',
  ageRange: '25-34',
  gender: 'Female',
  country: 'Tanzania',
  skinType: 'Combination',
  skinConcerns: ['Oiliness', 'Blemishes', 'Dark Spots'],
  allergies: 'None reported',
  lifestyle: 'Works indoors with air-conditioning, exercises 3x a week, moderate sun exposure.',
  dietPreferences: 'Enjoys fresh fruit, greens, chicken and rice. Low dairy intake.',
  dailySchedule: {
    wakeTime: '06:30',
    workStart: '08:00',
    workEnd: '17:00',
    exerciseTime: '18:00',
    sleepTime: '22:30'
  },
  subscriptionTier: 'start',
  allowPhotoStorage: true,
  notificationSettings: {
    morningSkincare: true,
    eveningSkincare: true,
    nutrition: true,
    water: true,
    weeklyReport: true,
    marketing: false,
    emailDigests: true
  },
  createdAt: new Date().toISOString()
};

const initialSampleAnalysis: SkinAnalysis = {
  id: 'scan-sample-01',
  userId: 'guest_user',
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  angles: ['front', 'left', 'right'],
  skinHealthScore: 74,
  metrics: {
    blemishes: 64,
    hydration: 71,
    oilBalance: 68,
    texture: 76,
    pigmentation: 59,
    redness: 82
  },
  findings: [
    {
      concern: 'Acne-like blemishes',
      severity: 'Moderate',
      confidence: 87,
      visibleIndicators: 'Scattered closed comedones and minor active papules along chin and forehead.',
      location: 'T-Zone & Jawline'
    },
    {
      concern: 'Sebum & Oiliness',
      severity: 'Moderate',
      confidence: 91,
      visibleIndicators: 'Noticeable surface sheen across forehead and nasal bridge.',
      location: 'T-Zone'
    },
    {
      concern: 'Post-Blemish Hyperpigmentation',
      severity: 'Moderate',
      confidence: 84,
      visibleIndicators: 'Localized flat darker spots from past blemish recovery.',
      location: 'Lower Cheeks'
    },
    {
      concern: 'Skin Texture & Pores',
      severity: 'Low',
      confidence: 89,
      visibleIndicators: 'Mild visible pore enlargement near medial cheeks; general texture smooth.',
      location: 'Medial Cheeks'
    }
  ],
  estimatedAppearanceAge: 23,
  appearanceAgeDisclaimer: 'This is an AI-generated visual estimate and is not a medical or biological measurement.',
  dermatologyDisclaimer: 'This platform provides cosmetic guidance, not a medical diagnosis. Consider consulting a qualified dermatologist if symptoms are severe, persistent, painful, infected, or worsening.',
  createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
};

const initialMorningRoutine: UserRoutine = {
  id: 'routine-morning-default',
  userId: 'guest_user',
  type: 'morning',
  targetTime: '07:00',
  steps: [
    {
      stepNumber: 1,
      category: 'Cleanser',
      productName: 'Foaming Facial Cleanser',
      brand: 'CeraVe',
      productId: 'prod-cerave-foaming',
      instructions: 'Wet skin with lukewarm water. Massage cleanser gently into skin in circular motions.',
      durationSeconds: 45,
      waitIntervalSeconds: 30,
      whyRecommended: 'Selected because its catalog profile balances excess sebum with Niacinamide without stripping natural ceramides.'
    },
    {
      stepNumber: 2,
      category: 'Serum',
      productName: 'Niacinamide 10% + Zinc 1%',
      brand: 'The Ordinary',
      productId: 'prod-to-niacinamide',
      instructions: 'Dispense 3-4 drops onto palms and press gently into face until absorbed.',
      durationSeconds: 30,
      waitIntervalSeconds: 60,
      whyRecommended: 'Directly addresses observed 68% oil balance and moderate blemish findings with Zinc PCA.'
    },
    {
      stepNumber: 3,
      category: 'Moisturizer',
      productName: 'PM Facial Moisturizing Lotion',
      brand: 'CeraVe',
      productId: 'prod-cerave-pm',
      instructions: 'Apply a light dime-sized pump across face and neck.',
      durationSeconds: 30,
      waitIntervalSeconds: 60,
      whyRecommended: 'Provides lightweight barrier hydration without heavy occlusives that could clog combination skin.'
    },
    {
      stepNumber: 4,
      category: 'Sunscreen',
      productName: 'UV Clear Broad-Spectrum SPF 46',
      brand: 'EltaMD',
      productId: 'prod-eltamd-uvclear',
      instructions: 'Apply 2 finger lengths generously as the final step 15 minutes before direct sun exposure.',
      durationSeconds: 45,
      waitIntervalSeconds: 0,
      whyRecommended: 'Contains transparent Zinc Oxide and Niacinamide to protect dark spots from UV darkening without causing congestion.'
    }
  ],
  safetyNotes: [
    'Always finish with broad-spectrum SPF 50/46 in the morning to prevent UV-induced pigmentation.',
    'Wait 60 seconds after applying Niacinamide before applying moisturizer for optimal film formation.'
  ],
  updatedAt: new Date().toISOString()
};

const initialEveningRoutine: UserRoutine = {
  id: 'routine-evening-default',
  userId: 'guest_user',
  type: 'evening',
  targetTime: '20:30',
  steps: [
    {
      stepNumber: 1,
      category: 'Cleanser',
      productName: 'Foaming Facial Cleanser',
      brand: 'CeraVe',
      productId: 'prod-cerave-foaming',
      instructions: 'Cleanse for 45-60 seconds to thoroughly remove daytime SPF, dust, and sebum.',
      durationSeconds: 50,
      waitIntervalSeconds: 30,
      whyRecommended: 'Removes daytime accumulation cleanly without disrupting barrier lipids.'
    },
    {
      stepNumber: 2,
      category: 'Treatment',
      productName: 'Azelaic Acid Suspension 10%',
      brand: 'The Ordinary',
      productId: 'prod-to-azelaic-acid',
      instructions: 'Apply a pea-sized amount evenly over face. Avoid direct contact with lips and eye contours.',
      durationSeconds: 30,
      waitIntervalSeconds: 90,
      whyRecommended: 'Selected because catalog data demonstrates efficacy for dark spots and calming blemish-prone areas.'
    },
    {
      stepNumber: 3,
      category: 'Moisturizer',
      productName: 'Cicaplast Baume B5+ Soothing Therapeutic Cream',
      brand: 'La Roche-Posay',
      productId: 'prod-lrp-cicaplast',
      instructions: 'Smooth a gentle layer over face to lock in hydration and buffer active ingredients.',
      durationSeconds: 30,
      waitIntervalSeconds: 0,
      whyRecommended: 'Contains 5% Panthenol and Madecassoside to support barrier repair overnight.'
    }
  ],
  safetyNotes: [
    'Azelaic Acid is scheduled in the evening to allow uninterrupted nocturnal cell renewal.',
    'Do not combine physical scrub exfoliants with Azelaic acid on the same evening.'
  ],
  updatedAt: new Date().toISOString()
};

const initialWellnessPlan: WellnessPlan = {
  id: 'plan-default',
  userId: 'guest_user',
  waterTargetMl: 2500,
  schedule: [
    {
      time: '07:00',
      type: 'routine',
      title: '🧴 Morning Skincare Routine',
      description: 'Cleanser → Niacinamide → Hydrating Lotion → SPF 46 Sunscreen.',
      hydrationMl: 350,
      completed: true
    },
    {
      time: '07:45',
      type: 'meal',
      title: '🥑 Balanced Morning Breakfast',
      description: 'Oatmeal or whole grain toast with avocado, egg, and fresh sliced papaya/oranges (rich in Vitamin C & carotenoids).',
      completed: true
    },
    {
      time: '10:30',
      type: 'water',
      title: '💧 Mid-Morning Hydration Check',
      description: 'Drink 500ml fresh water with lemon or mint to support microcirculation.',
      hydrationMl: 500,
      completed: true
    },
    {
      time: '13:00',
      type: 'meal',
      title: '🥗 Nutrient-Dense Lunch',
      description: 'Grilled chicken or lentils with sautéed spinach/greens, carrots, brown rice, and healthy fats.',
      completed: false
    },
    {
      time: '16:00',
      type: 'snack',
      title: '🍎 Afternoon Energy & Antioxidant Snack',
      description: 'Handful of roasted pumpkin seeds / nuts and a fresh apple or seasonal fruit.',
      hydrationMl: 350,
      completed: false
    },
    {
      time: '19:30',
      type: 'meal',
      title: '🍲 Light Wholesome Dinner',
      description: 'Steamed fish or vegetable curry with sweet potatoes. Avoid high sodium or overly processed snacks close to bed.',
      completed: false
    },
    {
      time: '20:30',
      type: 'routine',
      title: '🧴 Evening Skincare Routine',
      description: 'Gentle Cleanser → 10% Azelaic Acid Treatment → Cicaplast Barrier Balm.',
      hydrationMl: 250,
      completed: false
    },
    {
      time: '22:00',
      type: 'wellness',
      title: '🌙 Night Wind-Down & Hydration Check',
      description: 'Herbal chamomile tea or 200ml water. Silk or clean cotton pillowcase check for friction reduction.',
      hydrationMl: 200,
      completed: false
    }
  ],
  nutritionHighlights: [
    'Carotenoids & Vitamin C: Papaya, oranges, and spinach provide vital antioxidants for epidermal defense.',
    'Zinc & Omega Fatty Acids: Pumpkin seeds and fish support skin barrier lipid integrity.',
    'Hydration Baseline: 2.5 Liters throughout the day prevents dehydration-induced trans-epidermal water loss.'
  ],
  dietaryNote: 'Your wellness plan emphasizes a balanced diet containing fruits, vegetables, protein, whole grains, and adequate hydration. This supports general nutritional wellbeing alongside your skincare routine.',
  updatedAt: new Date().toISOString()
};

const initialEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    userId: 'guest_user',
    title: 'Morning Skincare Routine',
    type: 'morning_routine',
    date: new Date().toISOString().split('T')[0],
    time: '07:00',
    completed: true,
    notes: 'Completed all 4 steps with 30s wait intervals'
  },
  {
    id: 'evt-2',
    userId: 'guest_user',
    title: 'Mid-Morning Hydration (500ml)',
    type: 'hydration',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    completed: true
  },
  {
    id: 'evt-3',
    userId: 'guest_user',
    title: 'Balanced Nutrition Lunch',
    type: 'meal',
    date: new Date().toISOString().split('T')[0],
    time: '13:00',
    completed: false
  },
  {
    id: 'evt-4',
    userId: 'guest_user',
    title: 'Evening Skincare Routine',
    type: 'evening_routine',
    date: new Date().toISOString().split('T')[0],
    time: '20:30',
    completed: false
  },
  {
    id: 'evt-5',
    userId: 'guest_user',
    title: 'Weekly AI Skin Progress Scan',
    type: 'skin_scan',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '09:00',
    completed: false,
    notes: '7-day checkup on blemish recovery'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('skinai_user_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(() => {
    const saved = localStorage.getItem('skinai_catalog_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [userProducts, setUserProducts] = useState<UserProduct[]>(() => {
    const saved = localStorage.getItem('skinai_user_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>(() => {
    const saved = localStorage.getItem('skinai_analyses');
    return saved ? JSON.parse(saved) : [initialSampleAnalysis];
  });
  const [morningRoutine, setMorningRoutine] = useState<UserRoutine | null>(() => {
    const saved = localStorage.getItem('skinai_morning_routine');
    return saved ? JSON.parse(saved) : initialMorningRoutine;
  });
  const [eveningRoutine, setEveningRoutine] = useState<UserRoutine | null>(() => {
    const saved = localStorage.getItem('skinai_evening_routine');
    return saved ? JSON.parse(saved) : initialEveningRoutine;
  });
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(() => {
    const saved = localStorage.getItem('skinai_wellness_plan');
    return saved ? JSON.parse(saved) : initialWellnessPlan;
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('skinai_calendar_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skin_theme_mode');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('skin_theme_mode', 'dark');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#0c0a09');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('skin_theme_mode', 'light');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#0d9488');
    }
  }, [isDarkMode]);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('skinai_favorites');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  const toggleFavorite = async (productId: string) => {
    const updated = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(updated);
    localStorage.setItem('skinai_favorites', JSON.stringify(updated));
  };
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        if (token) setGmailToken(token);
        if (currentUser) {
          if (currentUser.email === 'postkwanza@gmail.com') {
            setIsAdmin(true);
          }
          loadUserDataFromFirestore(currentUser.uid);
        }
      },
      () => {
        setUser(null);
        setGmailToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save changes to localStorage for offline robustness
  useEffect(() => {
    if (userProfile) localStorage.setItem('skinai_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('skinai_catalog_products', JSON.stringify(catalogProducts));
  }, [catalogProducts]);

  useEffect(() => {
    localStorage.setItem('skinai_user_products', JSON.stringify(userProducts));
  }, [userProducts]);

  useEffect(() => {
    localStorage.setItem('skinai_analyses', JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    if (morningRoutine) localStorage.setItem('skinai_morning_routine', JSON.stringify(morningRoutine));
  }, [morningRoutine]);

  useEffect(() => {
    if (eveningRoutine) localStorage.setItem('skinai_evening_routine', JSON.stringify(eveningRoutine));
  }, [eveningRoutine]);

  useEffect(() => {
    if (wellnessPlan) localStorage.setItem('skinai_wellness_plan', JSON.stringify(wellnessPlan));
  }, [wellnessPlan]);

  useEffect(() => {
    localStorage.setItem('skinai_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Load user data from Firestore if available
  const loadUserDataFromFirestore = async (uid: string) => {
    try {
      setIsLoading(true);
      // 1. Try to load catalog from Firestore
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        if (productsSnap && !productsSnap.empty) {
          const loaded: CatalogProduct[] = [];
          productsSnap.forEach(d => loaded.push({ ...d.data(), id: d.id } as CatalogProduct));
          setCatalogProducts(loaded);
        }
      } catch (err: any) {
        console.warn('Catalog Firestore load non-blocking fallback:', err);
      }

      // 2. Try to load user profile
      try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        } else if (user) {
          // Initialize user profile in Firestore
          const initialProfile: UserProfile = {
            ...defaultProfile,
            uid,
            email: user.email || '',
            displayName: user.displayName || 'Amina',
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, initialProfile);
          setUserProfile(initialProfile);
        }
      } catch (err: any) {
        console.warn('Profile Firestore load non-blocking fallback:', err);
      }

      // 3. User Products
      try {
        const userProductsSnap = await getDocs(collection(db, 'users', uid, 'userProducts'));
        if (userProductsSnap && !userProductsSnap.empty) {
          const prods: UserProduct[] = [];
          userProductsSnap.forEach(d => prods.push({ ...d.data(), id: d.id } as UserProduct));
          setUserProducts(prods);
        }
      } catch (err: any) {
        console.warn('User products Firestore load non-blocking fallback:', err);
      }

      // 4. Analyses
      try {
        const analysesSnap = await getDocs(collection(db, 'users', uid, 'analyses'));
        if (analysesSnap && !analysesSnap.empty) {
          const ans: SkinAnalysis[] = [];
          analysesSnap.forEach(d => ans.push({ ...d.data(), id: d.id } as SkinAnalysis));
          ans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAnalyses(ans);
        }
      } catch (err: any) {
        console.warn('Analyses Firestore load non-blocking fallback:', err);
      }

      // 5. Routines
      try {
        const routinesSnap = await getDocs(collection(db, 'users', uid, 'routines'));
        if (routinesSnap && !routinesSnap.empty) {
          routinesSnap.forEach(d => {
            const r = d.data() as UserRoutine;
            if (r.type === 'morning') setMorningRoutine(r);
            else if (r.type === 'evening') setEveningRoutine(r);
          });
        }
      } catch (err: any) {
        console.warn('Routines Firestore load non-blocking fallback:', err);
      }

      // 6. Wellness Plan
      try {
        const wellnessSnap = await getDocs(collection(db, 'users', uid, 'wellnessPlans'));
        if (wellnessSnap && !wellnessSnap.empty) {
          wellnessSnap.forEach(d => {
            setWellnessPlan(d.data() as WellnessPlan);
          });
        }
      } catch (err: any) {
        console.warn('Wellness plan Firestore load non-blocking fallback:', err);
      }

      // 7. Calendar Events
      try {
        const eventsSnap = await getDocs(collection(db, 'users', uid, 'calendarEvents'));
        if (eventsSnap && !eventsSnap.empty) {
          const evts: CalendarEvent[] = [];
          eventsSnap.forEach(d => evts.push({ ...d.data(), id: d.id } as CalendarEvent));
          setCalendarEvents(evts);
        }
      } catch (err: any) {
        console.warn('Calendar events Firestore load non-blocking fallback:', err);
      }

    } catch (e) {
      console.warn('Firestore load non-blocking fallback to local state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    setIsSaving(true);
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore profile update non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.UPDATE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const saveAnalysis = async (analysis: SkinAnalysis) => {
    setIsSaving(true);
    const updated = [analysis, ...analyses.filter(a => a.id !== analysis.id)];
    setAnalyses(updated);
    if (user) {
      const path = `users/${user.uid}/analyses/${analysis.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'analyses', analysis.id), analysis);
      } catch (err) {
        console.warn('Firestore analysis save non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const deleteAnalysis = async (analysisId: string) => {
    setIsSaving(true);
    setAnalyses(prev => prev.filter(a => a.id !== analysisId));
    if (user) {
      const path = `users/${user.uid}/analyses/${analysisId}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'analyses', analysisId));
      } catch (err) {
        console.warn('Firestore delete analysis non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.DELETE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const deleteAllPhotosAndScans = async () => {
    setIsSaving(true);
    setAnalyses([]);
    if (user) {
      const path = `users/${user.uid}/analyses`;
      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'analyses'));
        snap.forEach(async (d) => {
          await deleteDoc(d.ref);
        });
      } catch (err) {
        console.warn('Firestore delete all non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.DELETE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const saveRoutine = async (routine: UserRoutine) => {
    setIsSaving(true);
    if (routine.type === 'morning') {
      setMorningRoutine(routine);
    } else {
      setEveningRoutine(routine);
    }
    if (user) {
      const path = `users/${user.uid}/routines/${routine.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'routines', routine.id), routine);
      } catch (err) {
        console.warn('Firestore save routine non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const saveWellnessPlan = async (plan: WellnessPlan) => {
    setIsSaving(true);
    setWellnessPlan(plan);
    if (user) {
      const path = `users/${user.uid}/wellnessPlans/${plan.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'wellnessPlans', plan.id), plan);
      } catch (err) {
        console.warn('Firestore save plan non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const addUserProduct = async (prodData: Omit<UserProduct, 'id' | 'userId' | 'addedAt'>) => {
    setIsSaving(true);
    const newProd: UserProduct = {
      ...prodData,
      id: 'uprod-' + Date.now(),
      userId: user?.uid || 'guest_user',
      addedAt: new Date().toISOString()
    };
    setUserProducts(prev => [newProd, ...prev]);
    if (user) {
      const path = `users/${user.uid}/userProducts/${newProd.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'userProducts', newProd.id), newProd);
      } catch (err) {
        console.warn('Firestore save user product non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.CREATE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const deleteUserProduct = async (productId: string) => {
    setIsSaving(true);
    setUserProducts(prev => prev.filter(p => p.id !== productId));
    if (user) {
      const path = `users/${user.uid}/userProducts/${productId}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'userProducts', productId));
      } catch (err) {
        console.warn('Firestore delete user product non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.DELETE, path);
        } catch {}
      }
    }
    setIsSaving(false);
  };

  const addCatalogProduct = async (productData: Omit<CatalogProduct, 'id'>) => {
    setIsSaving(true);
    const newProduct: CatalogProduct = {
      ...productData,
      id: 'prod-' + Date.now()
    };
    setCatalogProducts(prev => [newProduct, ...prev]);
    const path = `products/${newProduct.id}`;
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (err) {
      console.warn('Firestore save catalog product non-blocking:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch {}
    }
    setIsSaving(false);
  };

  const updateCatalogProduct = async (productId: string, updates: Partial<CatalogProduct>) => {
    setIsSaving(true);
    setCatalogProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    const path = `products/${productId}`;
    try {
      await updateDoc(doc(db, 'products', productId), updates);
    } catch (err) {
      console.warn('Firestore update catalog product non-blocking:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch {}
    }
    setIsSaving(false);
  };

  const deleteCatalogProduct = async (productId: string) => {
    setIsSaving(true);
    setCatalogProducts(prev => prev.filter(p => p.id !== productId));
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete catalog product non-blocking:', err);
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch {}
    }
    setIsSaving(false);
  };

  const addCalendarEvent = async (eventData: Omit<CalendarEvent, 'id' | 'userId'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      userId: user?.uid || 'guest_user'
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    if (user) {
      const path = `users/${user.uid}/calendarEvents/${newEvent.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'calendarEvents', newEvent.id), newEvent);
      } catch (err) {
        console.warn('Firestore save calendar event non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.CREATE, path);
        } catch {}
      }
    }
  };

  const toggleCalendarEvent = async (eventId: string) => {
    setCalendarEvents(prev => prev.map(e => e.id === eventId ? { ...e, completed: !e.completed } : e));
    const target = calendarEvents.find(e => e.id === eventId);
    if (target && user) {
      const path = `users/${user.uid}/calendarEvents/${eventId}`;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'calendarEvents', eventId), {
          completed: !target.completed
        });
      } catch (err) {
        console.warn('Firestore toggle calendar event non-blocking:', err);
        try {
          handleFirestoreError(err, OperationType.UPDATE, path);
        } catch {}
      }
    }
  };

  const setSubscriptionTier = async (tier: 'free' | 'start' | 'high') => {
    await updateUserProfile({ subscriptionTier: tier });
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    setGmailToken(null);
    setIsAdmin(false);
  };

  const loginDemoUser = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      const adminUser = {
        uid: 'demo_admin_01',
        email: 'admin@skinai.app',
        displayName: 'Dr. Grace (Admin)',
        photoURL: 'https://images.unsplash.com/photo-1594824813637-4b104618e001?w=150&auto=format&fit=crop&q=80'
      } as unknown as User;
      setUser(adminUser);
      setIsAdmin(true);
      const newProfile: UserProfile = {
        ...defaultProfile,
        uid: 'demo_admin_01',
        email: 'admin@skinai.app',
        displayName: 'Dr. Grace (Admin)',
        subscriptionTier: 'high'
      };
      setUserProfile(newProfile);
      localStorage.setItem('skinai_user_profile', JSON.stringify(newProfile));
    } else {
      const standardUser = {
        uid: 'demo_user_amina',
        email: 'amina.demo@skinai.app',
        displayName: 'Amina',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      } as unknown as User;
      setUser(standardUser);
      setIsAdmin(false);
      const newProfile: UserProfile = {
        ...defaultProfile,
        uid: 'demo_user_amina',
        email: 'amina.demo@skinai.app',
        displayName: 'Amina',
        subscriptionTier: 'start'
      };
      setUserProfile(newProfile);
      localStorage.setItem('skinai_user_profile', JSON.stringify(newProfile));
    }
  };

  const requestPushNotifications = async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false;
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    return perm === 'granted';
  };

  const sendLocalNotification = (title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=192&auto=format&fit=crop&q=80',
        });
      } catch (e) {
        console.log('Push notification shown:', title, body);
      }
    }
  };

  const formatPrice = (priceTZS: number, priceUSD: number) => {
    if (currency === 'TZS') {
      return `TZS ${priceTZS.toLocaleString()}`;
    }
    return `$${priceUSD.toFixed(2)}`;
  };

  const latestAnalysis = analyses.length > 0 ? analyses[0] : null;

  return (
    <AppContext.Provider
      value={{
        user,
        userProfile,
        catalogProducts,
        userProducts,
        analyses,
        latestAnalysis,
        morningRoutine,
        eveningRoutine,
        wellnessPlan,
        calendarEvents,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        isAdmin,
        setIsAdmin,
        isLoading,
        isSaving,
        favorites,
        toggleFavorite,
        gmailToken,
        notificationPermission,
        requestPushNotifications,
        sendLocalNotification,
        updateUserProfile,
        saveAnalysis,
        deleteAnalysis,
        deleteAllPhotosAndScans,
        saveRoutine,
        saveWellnessPlan,
        addUserProduct,
        deleteUserProduct,
        addCatalogProduct,
        updateCatalogProduct,
        deleteCatalogProduct,
        addCalendarEvent,
        toggleCalendarEvent,
        setSubscriptionTier,
        logout,
        loginDemoUser,
        formatPrice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

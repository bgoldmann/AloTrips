import { ProviderType, TieSetConfig, UserProfile, AdminStats, Booking } from './types';

export const PROVIDER_TRUST_MULTIPLIER: Record<ProviderType, number> = {
  [ProviderType.EXPEDIA]: 1.00,
  [ProviderType.TRAVELPAYOUTS]: 0.95,
  [ProviderType.SKYSCANNER]: 0.92,
  [ProviderType.KIWI]: 0.90,
  [ProviderType.BOOKING]: 0.98,
  [ProviderType.AGODA]: 0.94,
};

export const DEFAULT_EPC = {
  flights: 0.12,
  stays: 0.25,
  cars: 0.18,
  'things-to-do': 0.30,
  packages: 0.20,
  cruises: 0.15,
  esim: 0.35,
  insurance: 0.40,
};

export const TIE_SET_CONFIG: TieSetConfig = {
  priceTieThresholdAbsolute: 5.00,
  priceTieThresholdPercent: 1.01, // 1%
};

// PRD 12.3: Anti-Fake-Cheap Penalties
export const PRICE_PENALTIES = {
  NO_BAGGAGE: 0.03, // 3% penalty if baggage not included or unknown
  NO_CARRYON: 0.02, // 2% penalty if carryon not included
  LONG_LAYOVER: 0.01, // 1% penalty if layover > 240 minutes
  NON_REFUNDABLE: 0.005, // 0.5% penalty if non-refundable
} as const;

// Package bundling discount
export const PACKAGE_DISCOUNT_RATE = 0.85; // 15% discount (0.85 = 85% of original price)

// Mock User Data
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'u_12345',
  firstName: 'Alex',
  lastName: 'Traveler',
  email: 'alex.traveler@example.com',
  phone: '+1 (555) 012-3456',
  avatar: 'https://i.pravatar.cc/300?img=11',
  homeAirport: 'JFK - New York',
  currencyPreference: 'USD',
  memberSince: 'March 2023',
  tier: 'Gold',
  points: 12500
};

// Mock Admin Data
export const MOCK_ADMIN_STATS: AdminStats = {
  totalRevenue: 145200,
  totalBookings: 342,
  activeUsers: 1250,
  growth: 12.5,
  revenueHistory: [
    { date: 'Mon', value: 2400 },
    { date: 'Tue', value: 1398 },
    { date: 'Wed', value: 9800 },
    { date: 'Thu', value: 3908 },
    { date: 'Fri', value: 4800 },
    { date: 'Sat', value: 3800 },
    { date: 'Sun', value: 4300 },
  ]
};

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK-7829', date: '2024-03-10', itemTitle: 'Pod Times Square', type: 'Hotel', status: 'Confirmed', amount: 450, currency: 'USD', provider: 'Agoda', customerName: 'John Doe' },
  { id: 'BK-7830', date: '2024-03-11', itemTitle: 'JFK -> LHR (BA)', type: 'Flight', status: 'Pending', amount: 890, currency: 'USD', provider: 'British Airways', customerName: 'Sarah Smith' },
  { id: 'BK-7831', date: '2024-03-12', itemTitle: 'Toyota Camry', type: 'Car', status: 'Confirmed', amount: 120, currency: 'USD', provider: 'Hertz', customerName: 'Mike Jones' },
  { id: 'BK-7832', date: '2024-03-12', itemTitle: 'Hilton London', type: 'Hotel', status: 'Cancelled', amount: 0, currency: 'USD', provider: 'Booking.com', customerName: 'Alex Traveler' },
  { id: 'BK-7833', date: '2024-03-13', itemTitle: 'Paris Package', type: 'Hotel', status: 'Confirmed', amount: 1200, currency: 'USD', provider: 'Expedia', customerName: 'Emma Watson' },
];

// Mock Data Generators
export const MOCK_FLIGHT_OFFERS = [
  {
    id: 'f1',
    provider: ProviderType.KIWI,
    title: 'New York (JFK) → London (LHR)',
    subtitle: 'Norse Atlantic',
    base_price: 320,
    taxes_fees: 45,
    rating: 3.5,
    reviewCount: 120,
    stops: 0,
    duration: '7h 10m',
    layover_minutes: 0,
    baggage_included: false,
    carryon_included: true,
    refundable: false,
    epc: 0.10,
    flight_number: 'N0 201',
    departure_time: '18:30',
    arrival_time: '06:40+1'
  },
  {
    id: 'f2',
    provider: ProviderType.SKYSCANNER,
    title: 'New York (JFK) → London (LHR)',
    subtitle: 'British Airways',
    base_price: 350,
    taxes_fees: 80,
    rating: 4.2,
    reviewCount: 2500,
    stops: 0,
    duration: '6h 55m',
    layover_minutes: 0,
    baggage_included: true,
    carryon_included: true,
    refundable: true,
    epc: 0.25,
    flight_number: 'BA 112',
    departure_time: '19:15',
    arrival_time: '07:10+1'
  },
  {
    id: 'f3',
    provider: ProviderType.EXPEDIA,
    title: 'New York (JFK) → London (LHR)',
    subtitle: 'Virgin Atlantic',
    base_price: 355,
    taxes_fees: 78,
    rating: 4.5,
    reviewCount: 1800,
    stops: 0,
    duration: '7h 00m',
    layover_minutes: 0,
    baggage_included: true,
    carryon_included: true,
    refundable: true,
    epc: 0.35,
    flight_number: 'VS 004',
    departure_time: '20:00',
    arrival_time: '08:00+1'
  },
  {
    id: 'f4',
    provider: ProviderType.TRAVELPAYOUTS,
    title: 'New York (JFK) → London (LHR)',
    subtitle: 'JetBlue',
    base_price: 330,
    taxes_fees: 50,
    rating: 4.0,
    reviewCount: 800,
    stops: 1,
    duration: '9h 15m',
    layover_minutes: 90,
    baggage_included: false,
    carryon_included: true,
    refundable: false,
    epc: 0.18,
    flight_number: 'B6 230',
    departure_time: '14:45',
    arrival_time: '05:00+1'
  }
];

export const MOCK_STAY_OFFERS = [
  {
    id: 'h1',
    provider: ProviderType.AGODA,
    title: 'Pod Times Square',
    subtitle: 'Times Square, New York',
    base_price: 120,
    taxes_fees: 30,
    rating: 3.8,
    reviewCount: 450,
    stars: 3,
    amenities: ['Wifi', 'AC'],
    refundable: false,
    epc: 0.20
  },
  {
    id: 'h2',
    provider: ProviderType.BOOKING,
    title: 'CitizenM Bowery',
    subtitle: 'Bowery, New York',
    base_price: 155,
    taxes_fees: 35,
    rating: 4.8,
    reviewCount: 1200,
    stars: 4,
    amenities: ['Wifi', 'Rooftop Bar', 'Gym'],
    refundable: true,
    epc: 0.45
  },
  {
    id: 'h3',
    provider: ProviderType.EXPEDIA,
    title: 'Arlo NoMad',
    subtitle: 'Midtown, New York',
    base_price: 158,
    taxes_fees: 35,
    rating: 4.6,
    reviewCount: 980,
    stars: 4,
    amenities: ['Wifi', 'City View'],
    refundable: true,
    epc: 0.50
  }
];

export const MOCK_CAR_OFFERS = [
  {
    id: 'c1',
    provider: ProviderType.EXPEDIA,
    title: 'Toyota Corolla or similar',
    subtitle: 'Hertz',
    base_price: 42,
    taxes_fees: 18,
    rating: 4.8,
    reviewCount: 1500,
    car_type: 'Intermediate',
    transmission: 'Automatic',
    passengers: 5,
    mileage_limit: 'Unlimited',
    refundable: true,
    epc: 0.22,
    amenities: ['Unlimited mileage', 'Collision Damage Waiver']
  },
  {
    id: 'c2',
    provider: ProviderType.SKYSCANNER,
    title: 'Ford Fiesta',
    subtitle: 'Budget',
    base_price: 35,
    taxes_fees: 15,
    rating: 4.2,
    reviewCount: 850,
    car_type: 'Economy',
    transmission: 'Manual',
    passengers: 4,
    mileage_limit: 'Unlimited',
    refundable: false,
    epc: 0.15,
    amenities: ['Theft Protection']
  },
  {
    id: 'c3',
    provider: ProviderType.BOOKING,
    title: 'Jeep Grand Cherokee',
    subtitle: 'Alamo',
    base_price: 85,
    taxes_fees: 25,
    rating: 4.7,
    reviewCount: 600,
    car_type: 'SUV',
    transmission: 'Automatic',
    passengers: 5,
    mileage_limit: 'Unlimited',
    refundable: true,
    epc: 0.30,
    amenities: ['4WD', 'GPS Included']
  }
];

export const PRICE_HISTORY_DATA = [
  { day: 'Mon', price: 380 },
  { day: 'Tue', price: 365 },
  { day: 'Wed', price: 320 },
  { day: 'Thu', price: 340 },
  { day: 'Fri', price: 410 },
  { day: 'Sat', price: 450 },
  { day: 'Sun', price: 400 },
];

export const FEATURED_DEALS = [
  {
    id: 'd1',
    title: 'Weekend in Paris',
    subtitle: 'Flight + 3 Nights Hotel',
    image: 'https://picsum.photos/seed/Paris/600/400',
    price: 499,
    originalPrice: 850,
    discount: '41% OFF',
    tag: 'LIMITED TIME',
    expiresIn: '2 days',
    description: 'Experience the magic of the City of Lights. Includes round-trip economy flights and a stay at the Montmartre Boutique Hotel.',
    features: ['Daily Croissant Breakfast', 'Seine River Cruise Ticket', 'Free Metro Pass']
  },
  {
    id: 'd2',
    title: 'Tokyo Adventure',
    subtitle: 'Direct Flight Special',
    image: 'https://picsum.photos/seed/Tokyo/600/400',
    price: 890,
    originalPrice: 1200,
    discount: 'SAVE $310',
    tag: 'FLASH DEAL',
    expiresIn: '5 hours',
    description: 'Fly direct to Haneda and dive into the neon streets of Shinjuku. Package includes flight only with premium economy upgrade options.',
    features: ['Direct Flight', '2 Checked Bags', 'Lounge Access']
  },
  {
    id: 'd3',
    title: 'Relax in Bali',
    subtitle: '5-Star Resort Villa',
    image: 'https://picsum.photos/seed/Bali/600/400',
    price: 120,
    originalPrice: 250,
    discount: '52% OFF',
    tag: 'LUXURY',
    expiresIn: '1 day',
    description: 'Unwind in a private pool villa in Ubud. Includes daily spa treatment and floating breakfast.',
    features: ['Private Pool', '60min Massage', 'Airport Transfer']
  }
];

export const STAY_STYLE_DEALS = [
  {
    id: 's1',
    title: 'Zen in Kyoto',
    subtitle: 'Traditional Ryokan Experience',
    image: 'https://picsum.photos/seed/KyotoStay/600/400',
    price: 320,
    originalPrice: 450,
    discount: '15% OFF',
    tag: 'CULTURAL',
    expiresIn: '1 week',
    description: 'Sleep on tatami mats and enjoy a multi-course Kaiseki dinner in the heart of Gion.',
    features: ['Public Onsen', 'Tea Ceremony', 'Yukata Rental']
  },
  {
    id: 's2',
    title: 'Santorini Cave Suite',
    subtitle: 'Luxury Cliffside Villa',
    image: 'https://picsum.photos/seed/Santorini/600/400',
    price: 850,
    originalPrice: 1200,
    discount: 'SAVE $350',
    tag: 'ROMANTIC',
    expiresIn: '4 days',
    description: 'Watch the sunset from your private plunge pool overlooking the Aegean Sea.',
    features: ['Private Pool', 'Champagne Breakfast', 'Sunset View']
  },
  {
    id: 's3',
    title: 'Swiss Alpine Chalet',
    subtitle: 'Cozy Mountain Retreat',
    image: 'https://picsum.photos/seed/Alps/600/400',
    price: 280,
    originalPrice: 400,
    discount: '30% OFF',
    tag: 'NATURE',
    expiresIn: '2 weeks',
    description: 'Ski-in/ski-out access with a fireplace and hot chocolate service.',
    features: ['Fireplace', 'Ski Storage', 'Sauna Access']
  }
];

export const BUNDLE_DEALS = [
  {
    id: 'b1',
    title: 'Vegas Weekend',
    subtitle: 'Flight + 5-Star Hotel',
    image: 'https://picsum.photos/seed/Vegas/600/400',
    price: 299,
    originalPrice: 600,
    discount: '50% OFF',
    tag: 'POPULAR',
    expiresIn: '48 hours',
    description: 'Hit the strip with this unbeatable package including show tickets.',
    features: ['Strip View Room', 'Resort Fee Included', '2 Show Tickets']
  },
  {
    id: 'b2',
    title: 'Cancun All-Inclusive',
    subtitle: 'Flights + Resort + Meals',
    image: 'https://picsum.photos/seed/Cancun/600/400',
    price: 999,
    originalPrice: 1500,
    discount: '33% OFF',
    tag: 'ALL-INCLUSIVE',
    expiresIn: '3 days',
    description: 'Leave your wallet at home. Everything is included in this beach getaway.',
    features: ['Unlimited Drinks', 'All Meals', 'Water Sports']
  },
  {
    id: 'b3',
    title: 'London Explorer',
    subtitle: 'Flight + Hotel + Tours',
    image: 'https://picsum.photos/seed/LondonBus/600/400',
    price: 750,
    originalPrice: 950,
    discount: 'SAVE $200',
    tag: 'CITY BREAK',
    expiresIn: '5 days',
    description: 'See Big Ben and the London Eye with express entry tickets included.',
    features: ['Zone 1 Hotel', 'Tube Pass', 'River Cruise']
  }
];
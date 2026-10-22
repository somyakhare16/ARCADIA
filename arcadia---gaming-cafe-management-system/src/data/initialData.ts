import { Customer, GamingPC, MembershipPlan, CustomerMembership, GamingSession, Payment, CafeSettings, FeaturedGame } from '../types';

export const initialSettings: CafeSettings = {
  setting_id: 1,
  cafe_name: 'ARCADIA Esports Arena',
  default_hourly_rate: 150.00,
  contact_email: 'ops@arcadiaesports.com',
  contact_phone: '+91 98765 43210',
  currency_symbol: '₹',
  updated_at: '2025-05-01 10:00:00',
  opening_hours: 'Mon – Thu: 10:00 AM – Midnight | Fri – Sun: 10:00 AM – 3:00 AM',
  address: 'Arcadia Gaming Lounge, Tech & Gaming District'
};

export const initialGames: FeaturedGame[] = [
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    publisher: 'CD PROJEKT RED',
    genre: 'Open-World Action RPG',
    description: 'Experience the dangerous spy-thriller expansion in Dogtown with Full Ray Tracing Overdrive, DLSS 3.5 Frame Generation, and HDR on our flagship RTX 4090 rigs.',
    recommendedTier: 'VIP_Ultra',
    installedVersion: 'Version 2.13 (All DLCs Installed)',
    displayMode: '4K UHD @ 144Hz+ OLED HDR',
    rating: 'Mature 17+',
    features: ['Ray Tracing Overdrive', 'NVIDIA Reflex Ultra Low Latency', 'Spatial Dolby Atmos Audio', 'Cross-Platform Cloud Sync'],
    bannerGradient: 'from-amber-500/20 via-cyan-500/10 to-purple-600/30',
    accentColor: '#00f0ff'
  },
  {
    id: 'valorant',
    title: 'Valorant',
    publisher: 'Riot Games',
    genre: 'Tactical Hero Shooter',
    description: 'Precise gunplay meets hyper-tuned character abilities. Tuned for our 360Hz Alienware displays and custom sub-1ms optical esports peripherals.',
    recommendedTier: 'Performance',
    installedVersion: 'Latest Competitive Season',
    displayMode: '1080p / 1440p @ 360Hz Locked',
    rating: 'Teen',
    features: ['360Hz Display Mode', 'Sub-1ms Peripheral Delay', 'Direct 1Gbps Fiber Routing', 'Tournament Soundstage Preset'],
    bannerGradient: 'from-rose-500/20 via-pink-500/10 to-slate-900',
    accentColor: '#f43f5e'
  },
  {
    id: 'counter-strike-2',
    title: 'Counter-Strike 2',
    publisher: 'Valve Corporation',
    genre: 'Competitive Tactical FPS',
    description: 'The definitive competitive tactical shooter on Source 2. Experience responsive sub-tick architecture with our 1000Hz polling mechanical switches.',
    recommendedTier: 'Performance',
    installedVersion: 'Source 2 Official Competitive',
    displayMode: 'Native 1440p @ 240Hz Fast-IPS',
    rating: 'Mature 17+',
    features: ['Sub-Tick Responsive Hitreg', 'Dynamic Volumetric Smoke', 'Zero-Jitter Fiber LAN', 'Major Tournament Match Settings'],
    bannerGradient: 'from-amber-600/20 via-orange-500/10 to-slate-900',
    accentColor: '#f59e0b'
  },
  {
    id: 'apex-legends',
    title: 'Apex Legends',
    publisher: 'Respawn Entertainment',
    genre: 'Fast-Paced Battle Royale',
    description: 'Master an evolving roster of powerful Legends in high-octane 60-player squads with silky-smooth frame pacing on high-refresh curved panels.',
    recommendedTier: 'Standard',
    installedVersion: 'Latest Champion Season',
    displayMode: '1440p @ 180Hz+ G-Sync',
    rating: 'Teen',
    features: ['Locked 240 FPS Preset', 'Custom Pro Keybind Profiles', 'Discord Squad Voice Pre-Routed', 'Hi-Res Spatial Positioning'],
    bannerGradient: 'from-purple-600/20 via-indigo-500/10 to-slate-900',
    accentColor: '#a855f7'
  }
];

export const initialPlans: MembershipPlan[] = [
  {
    plan_id: 1,
    plan_name: 'Bronze Casual',
    price: 499.00,
    validity_days: 30,
    discount_percentage: 5.00,
    benefits: '5% discount on all rigs, reserved weekend seating.',
    is_active: true
  },
  {
    plan_id: 2,
    plan_name: 'Silver Pro Gamer',
    price: 1199.00,
    validity_days: 60,
    discount_percentage: 15.00,
    benefits: '15% hourly discount, 1 complimentary energy beverage per visit, VIP rig access.',
    is_active: true
  },
  {
    plan_id: 3,
    plan_name: 'Elite Esports Champion',
    price: 2499.00,
    validity_days: 90,
    discount_percentage: 25.00,
    benefits: '25% hourly discount, custom per-game peripheral profile, private booth access, tournament entry.',
    is_active: true
  }
];

export const initialPcs: GamingPC[] = [
  {
    pc_id: 1,
    pc_number: 'RIG-01-VIP',
    specs: 'Intel Core i9-14900K, RTX 4090 24GB, 64GB DDR5, 360Hz Alienware OLED',
    tier: 'VIP_Ultra',
    hourly_rate: 250.00,
    status: 'Available',
    purchase_date: '2025-01-15'
  },
  {
    pc_id: 2,
    pc_number: 'RIG-02-VIP',
    specs: 'Intel Core i9-14900K, RTX 4090 24GB, 64GB DDR5, 360Hz Alienware OLED',
    tier: 'VIP_Ultra',
    hourly_rate: 250.00,
    status: 'Available',
    purchase_date: '2025-01-15'
  },
  {
    pc_id: 3,
    pc_number: 'RIG-03-PERF',
    specs: 'AMD Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5, 240Hz ROG OLED',
    tier: 'Performance',
    hourly_rate: 180.00,
    status: 'Available',
    purchase_date: '2025-02-10'
  },
  {
    pc_id: 4,
    pc_number: 'RIG-04-PERF',
    specs: 'AMD Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5, 240Hz ROG OLED',
    tier: 'Performance',
    hourly_rate: 180.00,
    status: 'Available',
    purchase_date: '2025-02-10'
  },
  {
    pc_id: 5,
    pc_number: 'RIG-05-STD',
    specs: 'Intel Core i5-14600KF, RTX 4070 12GB, 32GB DDR5, 180Hz Fast-IPS',
    tier: 'Standard',
    hourly_rate: 120.00,
    status: 'Available',
    purchase_date: '2025-03-01'
  },
  {
    pc_id: 6,
    pc_number: 'RIG-06-STD',
    specs: 'Intel Core i5-14600KF, RTX 4070 12GB, 32GB DDR5, 180Hz Fast-IPS',
    tier: 'Standard',
    hourly_rate: 120.00,
    status: 'Available',
    purchase_date: '2025-03-01'
  },
  {
    pc_id: 7,
    pc_number: 'RIG-07-STD',
    specs: 'Intel Core i5-13400F, RTX 3060 Ti, 16GB RAM, 144Hz IPS',
    tier: 'Standard',
    hourly_rate: 90.00,
    status: 'Maintenance',
    purchase_date: '2024-11-20'
  },
  {
    pc_id: 8,
    pc_number: 'RIG-08-STREAM',
    specs: 'Dual Rig Setup: Ryzen 9 7950X, RTX 4090, 4K Elgato Cam Link, Shure SM7B',
    tier: 'Streaming',
    hourly_rate: 350.00,
    status: 'Available',
    purchase_date: '2025-04-05'
  }
];

export const initialCustomers: Customer[] = [
  {
    customer_id: 1,
    full_name: 'Marcus Vance',
    phone: '+91 98201 23456',
    email: 'marcus.v@nightcity.io',
    created_at: '2025-03-08 14:22:00'
  },
  {
    customer_id: 2,
    full_name: 'Seraphina Lin',
    phone: '+91 98312 34567',
    email: 'lin.seraphina@vertex.gg',
    created_at: '2025-03-23 18:10:00'
  },
  {
    customer_id: 3,
    full_name: 'Dante Alighieri',
    phone: '+91 98450 45678',
    email: 'dante@inferno.org',
    created_at: '2025-04-02 11:45:00'
  },
  {
    customer_id: 4,
    full_name: 'Kaelen Voss',
    phone: '+91 98111 56789',
    email: 'kael.voss@chronos.net',
    created_at: '2025-04-12 16:30:00'
  },
  {
    customer_id: 5,
    full_name: 'Aria Sterling',
    phone: '+91 98765 67890',
    email: 'aria.s@valkyrie.com',
    created_at: '2025-04-17 19:15:00'
  },
  {
    customer_id: 6,
    full_name: 'Victor Creed',
    phone: '+91 98990 78901',
    email: 'victor.creed@apex.org',
    created_at: '2025-04-20 20:00:00'
  }
];

export const initialMemberships: CustomerMembership[] = [
  {
    membership_id: 1,
    customer_id: 1,
    plan_id: 3,
    start_date: '2025-04-02',
    end_date: '2025-07-01',
    status: 'Active',
    created_at: '2025-04-02 14:00:00'
  },
  {
    membership_id: 2,
    customer_id: 2,
    plan_id: 2,
    start_date: '2025-04-07',
    end_date: '2025-06-06',
    status: 'Active',
    created_at: '2025-04-07 16:30:00'
  },
  {
    membership_id: 3,
    customer_id: 3,
    plan_id: 1,
    start_date: '2025-03-01',
    end_date: '2025-03-31',
    status: 'Expired',
    created_at: '2025-03-01 10:00:00'
  },
  {
    membership_id: 4,
    customer_id: 5,
    plan_id: 1,
    start_date: '2025-04-18',
    end_date: '2025-05-18',
    status: 'Active',
    created_at: '2025-04-18 11:20:00'
  }
];

// One live session active right now to demonstrate real-time unbilled ticker
const now = new Date();
const activeStartTime = new Date(now.getTime() - 48 * 60000).toISOString().replace('T', ' ').substring(0, 19);

export const initialSessions: GamingSession[] = [
  {
    session_id: 1,
    customer_id: 1,
    pc_id: 1,
    start_time: '2025-04-17 14:00:00',
    end_time: '2025-04-17 17:00:00',
    duration_minutes: 180,
    applied_hourly_rate: 187.50,
    total_amount: 562.50,
    status: 'Completed',
    created_at: '2025-04-17 14:00:00'
  },
  {
    session_id: 2,
    customer_id: 2,
    pc_id: 3,
    start_time: '2025-04-18 16:00:00',
    end_time: '2025-04-18 18:00:00',
    duration_minutes: 120,
    applied_hourly_rate: 153.00,
    total_amount: 306.00,
    status: 'Completed',
    created_at: '2025-04-18 16:00:00'
  },
  {
    session_id: 3,
    customer_id: 3,
    pc_id: 5,
    start_time: '2025-04-19 13:00:00',
    end_time: '2025-04-19 14:30:00',
    duration_minutes: 90,
    applied_hourly_rate: 120.00,
    total_amount: 180.00,
    status: 'Completed',
    created_at: '2025-04-19 13:00:00'
  },
  {
    session_id: 4,
    customer_id: 4,
    pc_id: 2,
    start_time: '2025-04-20 18:00:00',
    end_time: '2025-04-20 22:00:00',
    duration_minutes: 240,
    applied_hourly_rate: 250.00,
    total_amount: 1000.00,
    status: 'Completed',
    created_at: '2025-04-20 18:00:00'
  },
  {
    session_id: 5,
    customer_id: 5,
    pc_id: 4,
    start_time: '2025-04-21 15:00:00',
    end_time: '2025-04-21 17:30:00',
    duration_minutes: 150,
    applied_hourly_rate: 171.00,
    total_amount: 427.50,
    status: 'Completed',
    created_at: '2025-04-21 15:00:00'
  },
  {
    session_id: 6,
    customer_id: 6,
    pc_id: 1, // RIG-01-VIP
    start_time: activeStartTime,
    end_time: null,
    duration_minutes: 0,
    applied_hourly_rate: 250.00, // Non-member rate
    total_amount: 0.00,
    status: 'Active',
    created_at: activeStartTime
  }
];

// Mark PC 1 as 'In Use' to match the active session initially
initialPcs[0].status = 'In Use';

export const initialPayments: Payment[] = [
  {
    payment_id: 1,
    session_id: 1,
    customer_id: 1,
    amount: 562.50,
    payment_method: 'UPI',
    payment_status: 'Completed',
    payment_time: '2025-04-17 17:02:00'
  },
  {
    payment_id: 2,
    session_id: null,
    customer_id: 1,
    amount: 2499.00,
    payment_method: 'Card',
    payment_status: 'Completed',
    payment_time: '2025-04-02 14:02:00' // Elite Plan purchase
  },
  {
    payment_id: 3,
    session_id: 2,
    customer_id: 2,
    amount: 306.00,
    payment_method: 'Card',
    payment_status: 'Completed',
    payment_time: '2025-04-18 18:05:00'
  },
  {
    payment_id: 4,
    session_id: null,
    customer_id: 2,
    amount: 1199.00,
    payment_method: 'Cash',
    payment_status: 'Completed',
    payment_time: '2025-04-07 16:32:00' // Silver Plan purchase
  },
  {
    payment_id: 5,
    session_id: 3,
    customer_id: 3,
    amount: 180.00,
    payment_method: 'Cash',
    payment_status: 'Completed',
    payment_time: '2025-04-19 14:31:00'
  },
  {
    payment_id: 6,
    session_id: 4,
    customer_id: 4,
    amount: 1000.00,
    payment_method: 'UPI',
    payment_status: 'Completed',
    payment_time: '2025-04-20 22:01:00'
  },
  {
    payment_id: 7,
    session_id: 5,
    customer_id: 5,
    amount: 427.50,
    payment_method: 'Card',
    payment_status: 'Completed',
    payment_time: '2025-04-21 17:31:00'
  },
  {
    payment_id: 8,
    session_id: null,
    customer_id: 5,
    amount: 499.00,
    payment_method: 'UPI',
    payment_status: 'Completed',
    payment_time: '2025-04-18 11:22:00' // Bronze Plan purchase
  }
];

export type RigTier = 'Standard' | 'Performance' | 'VIP_Ultra' | 'Streaming';
export type RigStatus = 'Available' | 'In Use' | 'Maintenance';
export type SessionStatus = 'Active' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card';
export type PaymentStatus = 'Completed' | 'Refunded' | 'Failed';
export type MembershipStatus = 'Active' | 'Expired' | 'Cancelled';

export interface FeaturedGame {
  id: string;
  title: string;
  publisher: string;
  genre: string;
  description: string;
  recommendedTier: RigTier;
  installedVersion: string;
  displayMode: string;
  rating: string;
  features: string[];
  bannerGradient: string;
  accentColor: string;
}

export interface Customer {
  customer_id: number;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface GamingPC {
  pc_id: number;
  pc_number: string;
  specs: string;
  tier: RigTier;
  hourly_rate: number;
  status: RigStatus;
  purchase_date: string;
}

export interface MembershipPlan {
  plan_id: number;
  plan_name: string;
  price: number;
  validity_days: number;
  discount_percentage: number;
  benefits: string;
  is_active: boolean;
}

export interface CustomerMembership {
  membership_id: number;
  customer_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  created_at: string;
}

export interface GamingSession {
  session_id: number;
  customer_id: number;
  pc_id: number;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  applied_hourly_rate: number;
  total_amount: number;
  status: SessionStatus;
  created_at: string;
}

export interface Payment {
  payment_id: number;
  session_id: number | null;
  customer_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_time: string;
}

export interface CafeSettings {
  setting_id: number;
  cafe_name: string;
  default_hourly_rate: number;
  contact_email: string;
  contact_phone: string;
  currency_symbol: string;
  updated_at: string;
  opening_hours?: string;
  address?: string;
}

export interface SqlQueryLog {
  id: string;
  timestamp: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'PROCEDURE' | 'TRIGGER' | 'TRANSACTION';
  query: string;
  params?: any[];
  executionTimeMs: number;
  description: string;
}

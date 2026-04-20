// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  country: string;
  currency: string;
  role: "user" | "reseller" | "admin";
  reseller_tier: "bronze" | "silver" | "gold" | "platinum" | null;
  reseller_parent: string | null;
  commission_rate: number;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

// Credit types
export interface Credits {
  id: string;
  user_id: string;
  balance: number;
  total_purchased: number;
  total_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "operation" | "refund" | "commission" | "transfer";
  reference: string | null;
  description: string | null;
  created_at: string;
}

// Package types
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  price_ugx: number;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

// Operation types
export interface OperationCost {
  id: string;
  operation_type: string;
  credits_required: number;
  display_name: string;
  description: string | null;
  is_active: boolean;
}

export interface Operation {
  id: string;
  user_id: string;
  operation_type: string;
  device_serial: string | null;
  device_model: string | null;
  device_brand: string | null;
  status: "pending" | "success" | "failed";
  credits_used: number;
  log: string | null;
  created_at: string;
  completed_at: string | null;
}

// Payment types
export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  credits_purchased: number;
  status: "pending" | "completed" | "failed" | "refunded";
  provider_reference: string | null;
  webhook_data: string | null;
  created_at: string;
  completed_at: string | null;
}

// Reseller types
export interface ResellerStats {
  id: string;
  user_id: string;
  total_customers: number;
  total_credits_sold: number;
  total_commission_earned: number;
  commission_pending: number;
  commission_paid: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stats
export interface DashboardStats {
  credits: Credits;
  recentOperations: Operation[];
  totalOperations: number;
  successRate: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  country?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

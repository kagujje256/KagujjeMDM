/**
 * MarzPay Integration for Uganda
 * 
 * Supports:
 * - Phone Collections (MTN Mobile Money, Airtel Money)
 * - Card Payments (Visa, Mastercard via MarzPay)
 * 
 * API Documentation: https://wallet.wearemarz.com/documentation
 */

import { v4 as uuidv4 } from "uuid";

const MARZPAY_BASE_URL = "https://wallet.wearemarz.com/api/v1";

// API Credentials
const MARZPAY_API_KEY = process.env.MARZPAY_API_KEY || "marz_ZQWqDW0AyDUhMCWy";
const MARZPAY_API_SECRET = process.env.MARZPAY_API_SECRET || "aU2UMh9mgb5kXcLYmXuECxBchht9cSIH";
const MARZPAY_AUTH_HEADER = process.env.MARZPAY_AUTH_HEADER || "bWFyel9aUVdxRFcwQXlEVWhNQ1d5OmFVMlVNaDltZ2I1a1hjTFltWHVFQ3hCY2hodDljU0lI";

// Payment types
export type PaymentMethod = "mtn_momo" | "airtel_money" | "card";

export interface MarzPayCollectionRequest {
  amount: number;
  phone: string;
  currency: string;
  reason: string;
  external_id: string;
}

export interface MarzPayCardRequest {
  amount: number;
  currency: string;
  reason: string;
  external_id: string;
  redirect_url: string;
  webhook_url: string;
}

export interface MarzPayCollectionResponse {
  success: boolean;
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: string;
  phone: string;
  provider: string;
  message?: string;
  checkout_url?: string; // For card payments
}

export interface MarzPayCallbackPayload {
  id: string;
  external_id: string;
  status: "completed" | "failed" | "cancelled";
  amount: number;
  currency: string;
  phone?: string;
  provider?: string;
  transaction_id?: string;
  timestamp: string;
}

/**
 * Format phone number for MarzPay (256XXXXXXXXX)
 */
export function formatPhoneForMarzPay(phone: string): string {
  // Remove spaces and dashes
  let cleaned = phone.replace(/[\s\-]/g, "");
  
  // Handle different formats
  if (cleaned.startsWith("0")) {
    // 0702... -> 256702...
    cleaned = "256" + cleaned.slice(1);
  } else if (cleaned.startsWith("+256")) {
    // +256702... -> 256702...
    cleaned = cleaned.slice(1);
  } else if (!cleaned.startsWith("256")) {
    // Assume it needs 256 prefix
    cleaned = "256" + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate Uganda phone number
 */
export function validateUgandaPhone(phone: string): { valid: boolean; provider?: "mtn" | "airtel" } {
  const formatted = formatPhoneForMarzPay(phone);
  
  // Must be 12 digits (256 + 9 digits)
  if (!/^256\d{9}$/.test(formatted)) {
    return { valid: false };
  }
  
  // Extract the leading digits after 256
  const prefix = formatted.slice(3, 6);
  
  // MTN prefixes: 70, 75, 77, 78
  const mtnPrefixes = ["70", "75", "77", "78"];
  // Airtel prefixes: 70, 74, 75
  const airtelPrefixes = ["74", "75"];
  
  if (mtnPrefixes.some(p => prefix.startsWith(p))) {
    return { valid: true, provider: "mtn" };
  }
  
  if (airtelPrefixes.some(p => prefix.startsWith(p))) {
    return { valid: true, provider: "airtel" };
  }
  
  return { valid: true }; // Unknown provider but valid format
}

/**
 * Initiate a Mobile Money Collection (MTN or Airtel)
 */
export async function initiateMobileMoneyCollection(
  amount: number,
  phone: string,
  reason: string,
  externalId: string
): Promise<MarzPayCollectionResponse> {
  const formattedPhone = formatPhoneForMarzPay(phone);
  const validation = validateUgandaPhone(phone);
  
  if (!validation.valid) {
    return {
      success: false,
      id: "",
      status: "failed",
      amount,
      currency: "UGX",
      phone: formattedPhone,
      provider: "unknown",
      message: "Invalid Uganda phone number",
    };
  }
  
  try {
    const response = await fetch(`${MARZPAY_BASE_URL}/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${MARZPAY_AUTH_HEADER}`,
      },
      body: JSON.stringify({
        amount,
        phone: formattedPhone,
        currency: "UGX",
        reason,
        external_id: externalId,
      }),
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      id: data.id || data.collection_id || externalId,
      status: data.status || "pending",
      amount: data.amount || amount,
      currency: data.currency || "UGX",
      phone: formattedPhone,
      provider: validation.provider || "unknown",
      message: data.message || (response.ok 
        ? `Dial *165*3# or *185*3# to approve the ${validation.provider?.toUpperCase()} Mobile Money payment of UGX ${amount.toLocaleString()}`
        : "Failed to initiate payment"),
    };
  } catch (error) {
    console.error("MarzPay Mobile Money Error:", error);
    return {
      success: false,
      id: "",
      status: "failed",
      amount,
      currency: "UGX",
      phone: formattedPhone,
      provider: validation.provider || "unknown",
      message: "Failed to connect to payment service",
    };
  }
}

/**
 * Initiate a Card Payment via MarzPay
 */
export async function initiateCardPayment(
  amount: number,
  currency: string,
  reason: string,
  externalId: string,
  redirectUrl: string,
  webhookUrl: string
): Promise<MarzPayCollectionResponse> {
  try {
    const response = await fetch(`${MARZPAY_BASE_URL}/collections/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${MARZPAY_AUTH_HEADER}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        reason,
        external_id: externalId,
        redirect_url: redirectUrl,
        webhook_url: webhookUrl,
      }),
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      id: data.id || data.collection_id || externalId,
      status: "pending",
      amount: data.amount || amount,
      currency: data.currency || currency,
      phone: "",
      provider: "card",
      checkout_url: data.checkout_url || data.url,
      message: data.message || (response.ok 
        ? "Redirecting to card payment..."
        : "Failed to initiate card payment"),
    };
  } catch (error) {
    console.error("MarzPay Card Error:", error);
    return {
      success: false,
      id: "",
      status: "failed",
      amount,
      currency,
      phone: "",
      provider: "card",
      message: "Failed to connect to payment service",
    };
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(paymentId: string): Promise<MarzPayCollectionResponse> {
  try {
    const response = await fetch(`${MARZPAY_BASE_URL}/collections/${paymentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${MARZPAY_AUTH_HEADER}`,
      },
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      id: data.id || paymentId,
      status: data.status || "pending",
      amount: data.amount || 0,
      currency: data.currency || "UGX",
      phone: data.phone || "",
      provider: data.provider || "unknown",
    };
  } catch (error) {
    console.error("MarzPay Status Check Error:", error);
    return {
      success: false,
      id: paymentId,
      status: "pending",
      amount: 0,
      currency: "UGX",
      phone: "",
      provider: "unknown",
      message: "Failed to check payment status",
    };
  }
}

/**
 * Get account balance
 */
export async function getMarzPayBalance(): Promise<{ balance: number; currency: string } | null> {
  try {
    const response = await fetch(`${MARZPAY_BASE_URL}/accounts/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${MARZPAY_AUTH_HEADER}`,
      },
    });
    
    const data = await response.json();
    
    return {
      balance: data.balance || 0,
      currency: data.currency || "UGX",
    };
  } catch (error) {
    console.error("MarzPay Balance Error:", error);
    return null;
  }
}

/**
 * Unified payment initiation
 */
export async function initiatePayment(params: {
  method: PaymentMethod;
  amount: number;
  currency: string;
  phone?: string;
  reason: string;
  externalId: string;
  redirectUrl?: string;
  webhookUrl?: string;
}): Promise<MarzPayCollectionResponse> {
  const { method, amount, currency, phone, reason, externalId, redirectUrl, webhookUrl } = params;
  
  if (method === "mtn_momo" || method === "airtel_money") {
    if (!phone) {
      return {
        success: false,
        id: "",
        status: "failed",
        amount,
        currency,
        phone: "",
        provider: method === "mtn_momo" ? "mtn" : "airtel",
        message: "Phone number required for mobile money payment",
      };
    }
    return initiateMobileMoneyCollection(amount, phone, reason, externalId);
  }
  
  if (method === "card") {
    if (!redirectUrl || !webhookUrl) {
      return {
        success: false,
        id: "",
        status: "failed",
        amount,
        currency,
        phone: "",
        provider: "card",
        message: "Redirect and webhook URLs required for card payment",
      };
    }
    return initiateCardPayment(amount, currency, reason, externalId, redirectUrl, webhookUrl);
  }
  
  return {
    success: false,
    id: "",
    status: "failed",
    amount,
    currency,
    phone: phone || "",
    provider: "unknown",
    message: "Invalid payment method",
  };
}

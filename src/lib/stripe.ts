/**
 * Stripe Integration for International Card Payments
 */

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
});

interface CheckoutSessionResult {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

/**
 * Create a Stripe checkout session for credit purchase
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  packageName: string,
  credits: number,
  amountUsd: number,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSessionResult> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `KagujjeMDM - ${packageName}`,
              description: `${credits} credits for device operations`,
            },
            unit_amount: Math.round(amountUsd * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        packageName,
        credits: credits.toString(),
        type: "credit_purchase",
      },
    });

    return {
      success: true,
      url: session.url || undefined,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    };
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}

/**
 * Get checkout session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to retrieve session:", error);
    return null;
  }
}

/**
 * Create a payment intent for custom amounts
 */
export async function createPaymentIntent(
  amountUsd: number,
  userId: string,
  metadata: Record<string, string> = {}
): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountUsd * 100),
      currency: "usd",
      metadata: {
        userId,
        ...metadata,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error("Payment intent error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment intent",
    };
  }
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  // UGX doesn't have decimals
  if (currency === "UGX") {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return `${amount} ${currency}`;
}

export { stripe };

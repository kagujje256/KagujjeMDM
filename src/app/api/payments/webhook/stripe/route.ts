import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

/**
 * Stripe Webhook Handler
 * 
 * Handles card payment callbacks from Stripe
 * For now, we primarily use MarzPay which handles both mobile money and cards
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // For now, return success - Stripe integration can be added later
    // Primary payment processing is via MarzPay
    console.log("Stripe webhook received (not fully configured)");

    return NextResponse.json({ 
      received: true,
      message: "Use MarzPay for full payment integration" 
    });

  } catch (error) {
    console.error("Stripe Webhook Error:", error);
    return NextResponse.json({ 
      error: "Webhook handler error" 
    }, { status: 400 });
  }
}

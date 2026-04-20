import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

/**
 * MarzPay Webhook Handler
 * 
 * Handles callbacks for:
 * - Mobile Money (MTN, Airtel) payments
 * - Card payments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("MarzPay Webhook Received:", JSON.stringify(body, null, 2));
    
    const {
      id: externalId,
      external_id: providedExternalId,
      status,
      amount,
      currency,
      phone,
      provider,
      transaction_id,
    } = body;

    // Use either id or external_id
    const paymentExternalId = externalId || providedExternalId;
    
    if (!paymentExternalId) {
      return NextResponse.json({ success: false, error: "Missing payment ID" }, { status: 400 });
    }

    const db = getDb();

    // Find payment by external ID
    const payment = db.prepare(`
      SELECT * FROM payments WHERE external_id = ? OR id = ?
    `).get(paymentExternalId, paymentExternalId) as {
      id: string;
      user_id: string;
      package_id: string;
      amount: number;
      credits: number;
      status: string;
    } | undefined;

    if (!payment) {
      console.log("Payment not found for external_id:", paymentExternalId);
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    // Idempotency check - don't process if already completed
    if (payment.status === "completed") {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    if (status === "completed") {
      // Update payment status
      db.prepare(`
        UPDATE payments SET 
          status = 'completed',
          transaction_id = ?,
          provider = ?,
          phone = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(transaction_id || null, provider || null, phone || null, payment.id);

      // Add credits to user
      db.prepare(`
        UPDATE user_credits SET 
          balance = balance + ?,
          total_purchased = total_purchased + ?
        WHERE user_id = ?
      `).run(payment.credits, payment.credits, payment.user_id);

      // Record transaction
      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, type, amount, description, reference)
        VALUES (?, ?, 'purchase', ?, 'Credit purchase via MarzPay', ?)
      `).run(uuidv4(), payment.user_id, payment.credits, payment.id);

      console.log(`✅ Payment completed: User ${payment.user_id} received ${payment.credits} credits`);

      return NextResponse.json({ 
        success: true, 
        message: "Payment processed successfully",
        credits_added: payment.credits,
      });
    }

    if (status === "failed" || status === "cancelled") {
      // Update payment status
      db.prepare(`
        UPDATE payments SET 
          status = ?,
          transaction_id = ?,
          provider = ?,
          phone = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, transaction_id || null, provider || null, phone || null, payment.id);

      console.log(`❌ Payment ${status}: Payment ID ${payment.id}`);

      return NextResponse.json({ 
        success: true, 
        message: `Payment marked as ${status}` 
      });
    }

    // Still pending
    return NextResponse.json({ 
      success: true, 
      message: "Payment still pending" 
    });

  } catch (error) {
    console.error("MarzPay Webhook Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

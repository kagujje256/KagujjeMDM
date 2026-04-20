import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { 
  initiatePayment, 
  checkPaymentStatus,
  type PaymentMethod 
} from "@/lib/marzpay";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;
    const db = getDb();

    switch (action) {
      case "initiate": {
        const { paymentMethod, packageId, phoneNumber } = body;
        
        // Get package details
        const pkg = db.prepare(`
          SELECT * FROM credit_packages WHERE id = ? AND is_active = 1
        `).get(packageId) as { id: string; credits: number; price_usd: number; price_ugx: number; name: string } | undefined;
        
        if (!pkg) {
          return NextResponse.json({ success: false, error: "Invalid package" }, { status: 400 });
        }

        // Determine amount and currency based on user country
        const isUganda = user.country === "UG";
        const amount = isUganda ? pkg.price_ugx : pkg.price_usd;
        const currency = isUganda ? "UGX" : "USD";
        
        // Create payment record
        const paymentId = uuidv4();
        db.prepare(`
          INSERT INTO payments (id, user_id, package_id, amount, currency, credits, payment_method, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `).run(paymentId, user.id, packageId, amount, currency, pkg.credits, paymentMethod);

        // Determine MarzPay method
        let method: PaymentMethod;
        if (paymentMethod === "marzpay_mtn") {
          method = "mtn_momo";
        } else if (paymentMethod === "marzpay_airtel") {
          method = "airtel_money";
        } else if (paymentMethod === "marzpay_card") {
          method = "card"; // MarzPay card
        } else if (paymentMethod === "stripe_card") {
          method = "card"; // Stripe card (would need stripe integration)
        } else {
          method = "card"; // Default to card for international
        }

        // Initiate payment with MarzPay
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mdm.kagujje.com";
        const result = await initiatePayment({
          method,
          amount,
          currency,
          phone: phoneNumber,
          reason: `KagujjeMDM Credits - ${pkg.name}`,
          externalId: paymentId,
          redirectUrl: `${baseUrl}/dashboard?payment=success`,
          webhookUrl: `${baseUrl}/api/payments/webhook/marzpay`,
        });

        // Update payment with external ID
        if (result.success && result.id) {
          db.prepare(`
            UPDATE payments SET external_id = ? WHERE id = ?
          `).run(result.id, paymentId);
        }

        if (result.success) {
          if (result.checkout_url) {
            // Card payment - redirect to checkout
            return NextResponse.json({
              success: true,
              paymentId,
              checkoutUrl: result.checkout_url,
              message: "Redirecting to payment...",
            });
          } else {
            // Mobile money - show USSD prompt
            return NextResponse.json({
              success: true,
              paymentId,
              externalId: result.id,
              message: result.message || `Payment initiated! Check your phone for the ${result.provider?.toUpperCase()} prompt.`,
            });
          }
        } else {
          // Mark payment as failed
          db.prepare(`
            UPDATE payments SET status = 'failed' WHERE id = ?
          `).run(paymentId);
          
          return NextResponse.json({
            success: false,
            error: result.message || "Payment initiation failed",
          }, { status: 400 });
        }
      }

      case "status": {
        const { paymentId } = body;
        
        const payment = db.prepare(`
          SELECT * FROM payments WHERE id = ? AND user_id = ?
        `).get(paymentId, user.id) as { id: string; status: string; external_id: string | null } | undefined;
        
        if (!payment) {
          return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
        }

        // If pending, check with MarzPay
        if (payment.status === "pending" && payment.external_id) {
          const result = await checkPaymentStatus(payment.external_id);
          
          if (result.status === "completed") {
            // Credit the user
            const pkg = db.prepare(`
              SELECT credits FROM credit_packages WHERE id = (
                SELECT package_id FROM payments WHERE id = ?
              )
            `).get(paymentId) as { credits: number } | undefined;
            
            if (pkg) {
              // Update payment status
              db.prepare(`
                UPDATE payments SET status = 'completed' WHERE id = ?
              `).run(paymentId);
              
              // Add credits
              db.prepare(`
                UPDATE user_credits SET 
                  balance = balance + ?,
                  total_purchased = total_purchased + ?
                WHERE user_id = ?
              `).run(pkg.credits, pkg.credits, user.id);
              
              // Record transaction
              db.prepare(`
                INSERT INTO credit_transactions (id, user_id, type, amount, description, reference)
                VALUES (?, ?, 'purchase', ?, 'Credit purchase via MarzPay', ?)
              `).run(uuidv4(), user.id, pkg.credits, paymentId);
            }
          } else if (result.status === "failed" || result.status === "cancelled") {
            db.prepare(`
              UPDATE payments SET status = ? WHERE id = ?
            `).run(result.status, paymentId);
          }
        }

        const updatedPayment = db.prepare(`
          SELECT p.*, cp.name as package_name, cp.credits 
          FROM payments p 
          JOIN credit_packages cp ON p.package_id = cp.id
          WHERE p.id = ?
        `).get(paymentId);

        return NextResponse.json({
          success: true,
          payment: updatedPayment,
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payments API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const payments = db.prepare(`
      SELECT p.*, cp.name as package_name, cp.credits 
      FROM payments p 
      JOIN credit_packages cp ON p.package_id = cp.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ?
    `).all(user.id, limit);

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Payments API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

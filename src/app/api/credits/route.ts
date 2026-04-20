import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { getDb, getUserCredits, getCreditPackages, getOperationCosts } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

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
    
    // Get credits
    const credits = getUserCredits(user.id);
    
    // Get packages
    const packages = getCreditPackages();
    
    // Get transactions
    const transactions = db.prepare(`
      SELECT * FROM credit_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `).all(user.id);

    // Get operation costs
    const operationCosts = getOperationCosts();

    return NextResponse.json({
      success: true,
      data: {
        credits,
        packages,
        transactions,
        operationCosts,
      },
    });
  } catch (error) {
    console.error("Credits API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

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
    const { action, targetUserId, amount, description } = body;
    const db = getDb();

    switch (action) {
      case "add": {
        // Admin only - add credits to a user
        if (user.role !== "admin") {
          return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        if (!targetUserId || !amount || amount <= 0) {
          return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
        }

        // Add credits
        db.prepare(`
          UPDATE user_credits SET 
            balance = balance + ?,
            total_purchased = total_purchased + ?
          WHERE user_id = ?
        `).run(amount, amount, targetUserId);

        // Record transaction
        db.prepare(`
          INSERT INTO credit_transactions (id, user_id, type, amount, description, reference)
          VALUES (?, ?, 'admin_add', ?, ?, ?)
        `).run(uuidv4(), targetUserId, amount, description || "Admin credit addition", user.id);

        return NextResponse.json({ 
          success: true, 
          message: `Added ${amount} credits to user` 
        });
      }

      case "use": {
        // Deduct credits for an operation
        const { operationType, deviceModel, deviceSerial, operationLog } = body;

        if (!operationType || !amount) {
          return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
        }

        const currentCredits = getUserCredits(user.id);
        if (currentCredits.balance < amount) {
          return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 });
        }

        // Deduct credits
        db.prepare(`
          UPDATE user_credits SET 
            balance = balance - ?,
            total_used = total_used + ?
          WHERE user_id = ?
        `).run(amount, amount, user.id);

        // Record operation
        const operationId = uuidv4();
        db.prepare(`
          INSERT INTO operations (id, user_id, operation_type, device_model, device_serial, credits_used, status, log)
          VALUES (?, ?, ?, ?, ?, ?, 'success', ?)
        `).run(operationId, user.id, operationType, deviceModel || null, deviceSerial || null, amount, operationLog || null);

        // Record transaction
        db.prepare(`
          INSERT INTO credit_transactions (id, user_id, type, amount, description, reference)
          VALUES (?, ?, 'usage', ?, ?, ?)
        `).run(uuidv4(), user.id, amount, `${operationType} operation`, operationId);

        return NextResponse.json({ 
          success: true, 
          operationId,
          remainingCredits: currentCredits.balance - amount,
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Credits API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

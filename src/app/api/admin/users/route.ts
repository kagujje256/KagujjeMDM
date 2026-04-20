import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Get users with credit info
    const users = db.prepare(`
      SELECT 
        u.id, u.email, u.name, u.phone, u.country, u.currency, u.role,
        u.reseller_tier, u.is_active, u.created_at, u.last_login,
        uc.balance as credit_balance
      FROM users u
      LEFT JOIN user_credits uc ON u.id = uc.user_id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    // Get stats
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COALESCE(SUM(total_purchased), 0) FROM user_credits) as totalCredits,
        (SELECT COUNT(*) FROM operations) as totalOperations,
        (SELECT COUNT(*) FROM payments WHERE status = 'completed') as totalPayments
    `).get();

    return NextResponse.json({
      success: true,
      users,
      stats,
      pagination: { page, limit },
    });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, isActive, resellerTier } = body;
    const db = getDb();

    if (role) {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
    }

    if (typeof isActive === "boolean") {
      db.prepare("UPDATE users SET is_active = ? WHERE id = ?").run(isActive ? 1 : 0, userId);
    }

    if (resellerTier) {
      db.prepare("UPDATE users SET reseller_tier = ? WHERE id = ?").run(resellerTier, userId);
    }

    return NextResponse.json({ success: true, message: "User updated" });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

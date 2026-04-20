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
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDb();

    if (operationId) {
      // Get specific operation
      const operation = db.prepare("SELECT * FROM operations WHERE id = ? AND user_id = ?").get(operationId, user.id);
      
      if (!operation) {
        return NextResponse.json({ success: false, error: "Operation not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, operation });
    }

    // Get all operations for user
    const operations = db.prepare(`
      SELECT * FROM operations 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(user.id, limit, offset);

    const totalCount = db.prepare("SELECT COUNT(*) as count FROM operations WHERE user_id = ?").get(user.id) as { count: number };

    return NextResponse.json({
      success: true,
      operations,
      pagination: {
        total: totalCount.count,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Operations fetch error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

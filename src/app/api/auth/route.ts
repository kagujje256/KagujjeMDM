import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser, getUserFromToken, generateToken, getUserById } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, country } = body;

    switch (action) {
      case "register": {
        if (!email || !password) {
          return NextResponse.json(
            { success: false, error: "Email and password are required" },
            { status: 400 }
          );
        }

        const result = await registerUser(email, password, name, phone, country);

        if (result.success && result.user) {
          const token = generateToken(result.user.id);
          const response = NextResponse.json({
            success: true,
            user: result.user,
            message: "Registration successful! Welcome to KagujjeMDM 💪🏾",
          });

          response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
          });

          return response;
        }

        return NextResponse.json(result, { status: 400 });
      }

      case "login": {
        if (!email || !password) {
          return NextResponse.json(
            { success: false, error: "Email and password are required" },
            { status: 400 }
          );
        }

        const result = await loginUser(email, password);

        if (result.success && result.token && result.user) {
          const response = NextResponse.json({
            success: true,
            user: result.user,
            message: "Welcome back! 💪🏾",
          });

          response.cookies.set("auth_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
          });

          return response;
        }

        return NextResponse.json(result, { status: 401 });
      }

      case "logout": {
        const response = NextResponse.json({ success: true, message: "Logged out successfully" });
        response.cookies.delete("auth_token");
        return response;
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Auth API Error:", error);
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

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

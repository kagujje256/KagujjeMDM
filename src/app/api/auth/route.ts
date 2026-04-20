import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const JWT_SECRET = process.env.JWT_SECRET || "kagujje-mdm-secret-key-2026";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, fullName } = body;

    const supabase = getSupabase();

    if (action === "register") {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 400 }
        );
      }

      // Create user (Supabase will handle password hashing)
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user',
            credits: 5,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
          { success: false, error: error.message || "Failed to create account" },
          { status: 500 }
        );
      }

      // Also insert into users table
      if (user.user) {
        await supabase.from('users').upsert({
          id: user.user.id,
          email: user.user.email,
          full_name: fullName || null,
          role: 'user',
          credits: 5,
          password_hash: '', // Auth handled by Supabase Auth
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.user?.id,
          email: user.user?.email,
          fullName: fullName,
          role: 'user',
          credits: 5,
        },
        message: "Account created! Please check your email to verify.",
      });
    }

    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Get user credits from users table
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const response = NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: userData?.full_name || data.user.user_metadata?.full_name,
          role: userData?.role || 'user',
          credits: userData?.credits || 0,
        },
        session: data.session,
      });

      return response;
    }

    if (action === "logout") {
      await supabase.auth.signOut();
      const response = NextResponse.json({ success: true });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: userData?.full_name || user.user_metadata?.full_name,
        role: userData?.role || 'user',
        credits: userData?.credits || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }
}

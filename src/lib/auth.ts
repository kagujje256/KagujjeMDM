import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "kagujje-mdm-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  country: string;
  currency: string;
  role: string;
  reseller_tier: string | null;
  reseller_parent: string | null;
  commission_rate: number;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name?: string,
  phone?: string,
  country: string = "UG"
): Promise<{ success: boolean; user?: User; error?: string }> {
  const db = getDb();

  // Check if user exists
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Determine currency based on country
  const currency = country === "UG" ? "UGX" : "USD";

  // Create user
  const userId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, phone, country, currency, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'user')
  `).run(userId, email, passwordHash, name || null, phone || null, country, currency);

  // Create credit record
  db.prepare(`
    INSERT INTO user_credits (user_id, balance, total_purchased, total_used)
    VALUES (?, 0, 0, 0)
  `).run(userId);

  const user = getUserById(userId);
  return { success: true, user: user || undefined };
}

/**
 * Login a user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
  const db = getDb();

  // Get user
  const row = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `).get(email) as { id: string; password_hash: string; is_active: boolean } | undefined;

  if (!row) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!row.is_active) {
    return { success: false, error: "Account is disabled" };
  }

  // Verify password
  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  // Update last login
  db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(row.id);

  // Generate token
  const token = generateToken(row.id);
  const user = getUserById(row.id);

  return { success: true, token, user: user || undefined };
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | null {
  const db = getDb();
  
  const row = db.prepare(`
    SELECT id, email, name, phone, country, currency, role, 
           reseller_tier, reseller_parent, commission_rate,
           is_active, email_verified, created_at, last_login
    FROM users WHERE id = ?
  `).get(userId);

  return row as User | null;
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | null {
  const db = getDb();
  
  const row = db.prepare(`
    SELECT id, email, name, phone, country, currency, role,
           reseller_tier, reseller_parent, commission_rate,
           is_active, email_verified, created_at, last_login
    FROM users WHERE email = ?
  `).get(email);

  return row as User | null;
}

/**
 * Get user from token
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  return getUserById(decoded.userId);
}

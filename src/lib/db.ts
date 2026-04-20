import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Ensure data directory exists
const dataDir = join(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, "kagujje-mdm.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      country TEXT DEFAULT 'UG',
      currency TEXT DEFAULT 'UGX',
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'reseller', 'admin')),
      reseller_tier TEXT CHECK(reseller_tier IN ('bronze', 'silver', 'gold', 'platinum')),
      reseller_parent TEXT REFERENCES users(id),
      commission_rate REAL DEFAULT 0.10,
      is_active INTEGER DEFAULT 1,
      email_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    )
  `);

  // User credits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      balance INTEGER DEFAULT 0,
      total_purchased INTEGER DEFAULT 0,
      total_used INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Credit packages table (pricing)
  db.exec(`
    CREATE TABLE IF NOT EXISTS credit_packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      credits INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      price_ugx INTEGER NOT NULL,
      is_popular INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      package_id TEXT NOT NULL REFERENCES credit_packages(id),
      external_id TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      credits INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
      transaction_id TEXT,
      provider TEXT,
      phone TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Credit transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL CHECK(type IN ('purchase', 'usage', 'refund', 'admin_add', 'commission')),
      amount INTEGER NOT NULL,
      description TEXT,
      reference TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Operations table (from desktop app)
  db.exec(`
    CREATE TABLE IF NOT EXISTS operations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      operation_type TEXT NOT NULL,
      device_model TEXT,
      device_serial TEXT,
      credits_used INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed')),
      log TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Reseller transactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS reseller_transactions (
      id TEXT PRIMARY KEY,
      reseller_id TEXT NOT NULL REFERENCES users(id),
      customer_id TEXT REFERENCES users(id),
      amount REAL NOT NULL,
      commission REAL NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_operations_user ON operations(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_user ON credit_transactions(user_id);
  `);

  // Insert default credit packages (30% cheaper than Apizu)
  const packagesExist = db.prepare("SELECT COUNT(*) as count FROM credit_packages").get() as { count: number };
  if (packagesExist.count === 0) {
    const insertPackage = db.prepare(`
      INSERT INTO credit_packages (id, name, credits, price_usd, price_ugx, is_popular, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Apizu pricing (approximate): Starter $15/50cr, Pro $30/120cr, Ultimate $50/250cr
    // KagujjeMDM pricing (30% cheaper): Starter $10/50cr, Pro $20/120cr, Ultimate $35/250cr
    // UGX prices: 1 USD ≈ 3700 UGX
    const packages = [
      { id: "pkg_starter", name: "Starter", credits: 50, price_usd: 10, price_ugx: 37000, popular: 0, sort: 1 },
      { id: "pkg_basic", name: "Basic", credits: 100, price_usd: 18, price_ugx: 66000, popular: 0, sort: 2 },
      { id: "pkg_pro", name: "Pro", credits: 200, price_usd: 30, price_ugx: 110000, popular: 1, sort: 3 },
      { id: "pkg_ultimate", name: "Ultimate", credits: 500, price_usd: 60, price_ugx: 220000, popular: 0, sort: 4 },
      { id: "pkg_enterprise", name: "Enterprise", credits: 1000, price_usd: 100, price_ugx: 370000, popular: 0, sort: 5 },
    ];

    for (const pkg of packages) {
      insertPackage.run(pkg.id, pkg.name, pkg.credits, pkg.price_usd, pkg.price_ugx, pkg.popular, pkg.sort);
    }
  }

  // Create admin user if not exists
  const adminExists = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
  if (adminExists.count === 0) {
    try {
      const adminId = "admin_kagujje_001";
      const bcrypt = require("bcryptjs");
      const passwordHash = bcrypt.hashSync("admin123", 12);
      
      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, country, currency, role, is_active, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, 'admin', 1, 1)
      `).run(adminId, "admin@kagujje.com", passwordHash, "Kagujje Admin", "UG", "UGX");

      // Now insert credits after user is created
      db.prepare(`
        INSERT INTO user_credits (user_id, balance, total_purchased, total_used)
        VALUES (?, 10000, 0, 0)
      `).run(adminId);
    } catch (e) {
      // Ignore if already exists (race condition in build)
      console.log("Admin user may already exist, skipping...");
    }
  }
}

// Initialize on load
initializeDatabase();

export function getDb(): Database.Database {
  return db;
}

export function getUserCredits(userId: string): { balance: number; total_purchased: number; total_used: number } {
  const row = db.prepare(`
    SELECT balance, total_purchased, total_used FROM user_credits WHERE user_id = ?
  `).get(userId) as { balance: number; total_purchased: number; total_used: number } | undefined;

  return row || { balance: 0, total_purchased: 0, total_used: 0 };
}

export function getCreditPackages() {
  return db.prepare(`
    SELECT * FROM credit_packages WHERE is_active = 1 ORDER BY sort_order
  `).all();
}

export function getOperationCosts() {
  return {
    samsung_mdm_removal: 5,
    frp_bypass: 3,
    mi_account_removal: 5,
    nck_unlock: 3,
    bootloader_unlock: 2,
    edl_flash: 5,
    imei_repair: 10,
    general_mdm_removal: 4,
  };
}

export default db;

-- 💪🏾 KagujjeMDM Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rajrgfsxzijxdjmwqshd/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reseller')),
  credits INTEGER DEFAULT 0,
  reseller_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('basic', 'pro', 'enterprise')),
  duration_days INTEGER NOT NULL,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  machine_id TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operations log
CREATE TABLE IF NOT EXISTS operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  operation_type TEXT NOT NULL,
  device_model TEXT,
  device_serial TEXT,
  status TEXT DEFAULT 'pending',
  credits_used INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'UGX',
  payment_method TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider_ref TEXT,
  credits_added INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('credit_purchase', 'credit_use', 'refund', 'transfer')),
  amount INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MDM Files table (for downloadable files)
CREATE TABLE IF NOT EXISTS mdm_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  version TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for licenses
CREATE POLICY "Users can view own licenses" ON licenses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all licenses" ON licenses FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for operations
CREATE POLICY "Users can view own operations" ON operations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own operations" ON operations FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());

-- Create default admin user (password: Admin@123)
INSERT INTO users (email, password_hash, role, credits)
VALUES (
  'admin@kagujje.com',
  '$2a$10$xJwL5vXcQn5HqN9YwJ3GhOLVmN8K9YxJwL5vXcQn5HqN9YwJ3GhOLVmN8K9YxJwL5vXcQn5HqN9Y',
  'admin',
  100
) ON CONFLICT (email) DO NOTHING;

-- Insert default MDM files
INSERT INTO mdm_files (name, description, file_url, version, category, file_size) VALUES
('KagujjeMDM Desktop v4.4.2.5', 'Professional Mobile Device Management Tool for Windows', 'https://github.com/kagujje256/KagujjeMDM-Desktop/releases/download/v4.4.2.5/KagujjeMDM-v4.4.2.5-Portable.zip', '4.4.2.5', 'desktop', 70000000),
('Samsung MDM Removal Tool', 'Remove MDM locks from Samsung devices', '#', '2.1.0', 'mdm', 5000000),
('FRP Bypass Collection', 'Universal FRP bypass scripts', '#', '3.0.0', 'frp', 2000000);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

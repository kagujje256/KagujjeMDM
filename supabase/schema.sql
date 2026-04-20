-- KagujjeMDM Database Schema for Supabase
-- Version: 4.4.2.5
-- Brand: Kagujje Inc. 💪🏾

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    country VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'UGX',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'reseller', 'admin')),
    credits INTEGER DEFAULT 0,
    reseller_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- USER CREDITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    total_purchased INTEGER DEFAULT 0,
    total_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- CREDIT PACKAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    price_ugx DECIMAL(10,2) NOT NULL,
    price_usd DECIMAL(10,2),
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default packages
INSERT INTO credit_packages (name, credits, price_ugx, price_usd, description, is_popular, sort_order) VALUES
('Starter', 50, 15000, 4.00, 'Perfect for trying out', FALSE, 1),
('Technician', 150, 40000, 11.00, 'Most popular choice', TRUE, 2),
('Professional', 400, 100000, 27.00, 'Best value for pros', FALSE, 3),
('Enterprise', 1000, 230000, 62.00, 'For busy workshops', FALSE, 4),
('Unlimited', 5000, 1000000, 270.00, 'Maximum power', FALSE, 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    credits INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50),
    provider_reference VARCHAR(255),
    phone_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- OPERATIONS TABLE (Device Operations Log)
-- ============================================
CREATE TABLE IF NOT EXISTS operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_serial VARCHAR(255),
    device_model VARCHAR(255),
    device_brand VARCHAR(100),
    operation_type VARCHAR(100) NOT NULL,
    credits_used INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RESELLER COMMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reseller_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- LICENSES TABLE (For Desktop App)
-- ============================================
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_key VARCHAR(255) UNIQUE NOT NULL,
    device_fingerprint VARCHAR(255),
    machine_id VARCHAR(255),
    credits_balance INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREDIT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus', 'transfer')),
    reference_id UUID,
    reference_type VARCHAR(50),
    balance_before INTEGER,
    balance_after INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_reseller ON users(reseller_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_operations_user ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_type ON operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::uuid = id);

-- Users can read their own credits
CREATE POLICY "Users can read own credits" ON user_credits FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can read their own payments
CREATE POLICY "Users can read own payments" ON payments FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can read their own operations
CREATE POLICY "Users can read own operations" ON operations FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can read their own licenses
CREATE POLICY "Users can read own licenses" ON licenses FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT USING (auth.uid()::uuid = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_credits table
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle credit purchase
CREATE OR REPLACE FUNCTION process_credit_purchase(
    p_user_id UUID,
    p_credits INTEGER,
    p_payment_id UUID
)
RETURNS void AS $$
DECLARE
    v_balance_before INTEGER;
    v_balance_after INTEGER;
BEGIN
    -- Get current balance
    SELECT balance INTO v_balance_before FROM user_credits WHERE user_id = p_user_id;
    
    IF v_balance_before IS NULL THEN
        -- Create credit record if not exists
        INSERT INTO user_credits (user_id, balance, total_purchased)
        VALUES (p_user_id, p_credits, p_credits);
        v_balance_before := 0;
    ELSE
        -- Update existing record
        UPDATE user_credits 
        SET balance = balance + p_credits,
            total_purchased = total_purchased + p_credits
        WHERE user_id = p_user_id;
    END IF;
    
    v_balance_after := v_balance_before + p_credits;
    
    -- Update user credits column
    UPDATE users SET credits = v_balance_after WHERE id = p_user_id;
    
    -- Create transaction record
    INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_id, reference_type, balance_before, balance_after, description)
    VALUES (p_user_id, p_credits, 'purchase', p_payment_id, 'payment', v_balance_before, v_balance_after, 'Credit purchase');
END;
$$ LANGUAGE plpgsql;

-- Function to handle credit usage
CREATE OR REPLACE FUNCTION process_credit_usage(
    p_user_id UUID,
    p_credits INTEGER,
    p_operation_id UUID,
    p_description TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_balance INTEGER;
BEGIN
    -- Check if user has enough credits
    SELECT balance INTO v_balance FROM user_credits WHERE user_id = p_user_id FOR UPDATE;
    
    IF v_balance IS NULL OR v_balance < p_credits THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct credits
    UPDATE user_credits 
    SET balance = balance - p_credits,
        total_used = total_used + p_credits
    WHERE user_id = p_user_id;
    
    -- Update user credits column
    UPDATE users SET credits = credits - p_credits WHERE id = p_user_id;
    
    -- Create transaction record
    INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_id, reference_type, balance_before, balance_after, description)
    VALUES (p_user_id, -p_credits, 'usage', p_operation_id, 'operation', v_balance, v_balance - p_credits, p_description);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

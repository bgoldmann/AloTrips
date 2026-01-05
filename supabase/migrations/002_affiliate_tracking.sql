-- Affiliate tracking tables
-- Based on PRD Section 11.4

-- Affiliate clicks table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  click_id TEXT UNIQUE NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do', 'esim', 'insurance')),
  placement TEXT NOT NULL CHECK (placement IN ('results_row', 'top_banner', 'price_box', 'confirmation', 'email', 'upsell_banner')),
  
  -- UTM parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- First-party tracking
  at_user_type TEXT CHECK (at_user_type IN ('new', 'returning')),
  at_device TEXT CHECK (at_device IN ('ios', 'android', 'desktop')),
  
  -- Additional metadata
  route_or_destination TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate conversions table
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversion_id TEXT UNIQUE NOT NULL,
  click_id TEXT REFERENCES affiliate_clicks(click_id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Conversion details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL,
  vertical TEXT NOT NULL,
  
  -- Conversion metadata
  booking_reference TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_click_id ON affiliate_clicks(click_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_session_id ON affiliate_clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_provider ON affiliate_clicks(provider);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_vertical ON affiliate_clicks(vertical);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON affiliate_clicks(created_at);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id ON affiliate_conversions(click_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_user_id ON affiliate_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_provider ON affiliate_conversions(provider);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_created_at ON affiliate_conversions(created_at);

-- Enable Row Level Security
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Policies: Allow service role to manage all data (for admin operations)
-- Public read access is not needed for tracking tables


-- Price alerts table for tracking price drops
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Alert criteria
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do')),
  origin TEXT, -- For flights
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  
  -- Price tracking
  target_price DECIMAL(10,2), -- Alert when price drops below this
  current_price DECIMAL(10,2), -- Last checked price
  lowest_price DECIMAL(10,2), -- Lowest price seen since alert created
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled', 'expired')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked_at TIMESTAMP WITH TIME ZONE,
  triggered_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration date
  
  -- Notification settings
  notify_email BOOLEAN DEFAULT true,
  notify_push BOOLEAN DEFAULT false,
  
  -- Additional search parameters (stored as JSONB for flexibility)
  search_params JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
CREATE INDEX IF NOT EXISTS idx_price_alerts_vertical_destination ON price_alerts(vertical, destination);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(status, last_checked_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_price_alerts_expires_at ON price_alerts(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policies
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own price alerts
CREATE POLICY "Users can manage own price alerts" ON price_alerts
  FOR ALL USING (auth.uid() = user_id::text);


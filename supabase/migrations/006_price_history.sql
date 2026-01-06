-- Price history table for tracking price changes over time
-- This enables features like price trends, best time to book, etc.

CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Offer identification
  offer_id TEXT NOT NULL, -- ID of the offer (from provider)
  provider TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do')),
  
  -- Search context (what search parameters led to this price)
  origin TEXT,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  travelers INTEGER DEFAULT 2,
  
  -- Price data
  base_price DECIMAL(10,2) NOT NULL,
  taxes_fees DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Additional offer metadata (stored as JSONB for flexibility)
  offer_metadata JSONB, -- Can store title, subtitle, rating, etc.
  
  -- Timestamp
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_price_history_offer_id ON price_history(offer_id);
CREATE INDEX IF NOT EXISTS idx_price_history_destination ON price_history(destination);
CREATE INDEX IF NOT EXISTS idx_price_history_vertical ON price_history(vertical);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_price_history_destination_vertical ON price_history(destination, vertical);
CREATE INDEX IF NOT EXISTS idx_price_history_search_context ON price_history(destination, start_date, end_date) WHERE start_date IS NOT NULL AND end_date IS NOT NULL;

-- Composite index for common queries (destination + vertical + date range)
CREATE INDEX IF NOT EXISTS idx_price_history_composite ON price_history(destination, vertical, recorded_at DESC);

-- RLS Policies (optional - can be disabled if you want public price history)
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (price history is useful for all users)
CREATE POLICY "Public read access to price history" ON price_history
  FOR SELECT USING (true);

-- Only system/service accounts can insert (via API with service key)
-- In production, you'd restrict this to your backend service
CREATE POLICY "Service can insert price history" ON price_history
  FOR INSERT WITH CHECK (true); -- Adjust based on your auth setup


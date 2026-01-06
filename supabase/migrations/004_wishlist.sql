-- Wishlist table for saving individual offers
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Offer details (store full offer data as JSONB for flexibility)
  offer_id TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do')),
  offer_data JSONB NOT NULL, -- Store full offer object
  
  -- User notes
  notes TEXT,
  
  -- Metadata
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user can't save same offer twice
  UNIQUE(user_id, offer_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_vertical ON wishlist(vertical);
CREATE INDEX IF NOT EXISTS idx_wishlist_saved_at ON wishlist(saved_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_wishlist_updated_at BEFORE UPDATE ON wishlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Users can manage their own wishlist
CREATE POLICY "Users can manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id::text);


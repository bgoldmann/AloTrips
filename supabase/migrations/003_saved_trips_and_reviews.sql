-- Saved trips table
CREATE TABLE IF NOT EXISTS saved_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Trip details
  name TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do')),
  
  -- Search parameters (stored as JSONB for flexibility)
  search_params JSONB NOT NULL,
  
  -- Multi-city flight segments (if applicable)
  flight_segments JSONB,
  
  -- Flexible dates
  flexible_days INTEGER DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property reviews table
CREATE TABLE IF NOT EXISTS property_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT NOT NULL, -- Reference to offer ID or external property ID
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Review content
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  
  -- Review metadata
  verified_booking BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- User info (can be anonymous)
  reviewer_name TEXT,
  reviewer_location TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property photos table
CREATE TABLE IF NOT EXISTS property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT NOT NULL,
  
  -- Photo details
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  photo_type TEXT CHECK (photo_type IN ('exterior', 'interior', 'room', 'amenity', 'dining', 'other')),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  width INTEGER,
  height INTEGER,
  source TEXT, -- 'provider', 'user', 'partner'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EPC learning table (for dynamic EPC optimization)
CREATE TABLE IF NOT EXISTS epc_learning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Provider and vertical
  provider TEXT NOT NULL,
  vertical TEXT NOT NULL,
  
  -- Historical data
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  
  -- Calculated EPC
  calculated_epc DECIMAL(5, 4) DEFAULT 0,
  
  -- Time window
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metadata
  sample_size INTEGER DEFAULT 0,
  confidence_score DECIMAL(3, 2) DEFAULT 0, -- 0.00 to 1.00
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider, vertical, period_start, period_end)
);

-- Email journey triggers table
CREATE TABLE IF NOT EXISTS email_journey_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Trigger type
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'welcome', 'search_abandoned', 'price_drop', 'trip_reminder', 
    'post_booking', 'review_request', 'reengagement'
  )),
  
  -- Trigger data
  trigger_data JSONB,
  
  -- Email status
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMP WITH TIME ZONE,
  email_clicked BOOLEAN DEFAULT false,
  email_clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'failed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_trips_user_id ON saved_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_vertical ON saved_trips(vertical);
CREATE INDEX IF NOT EXISTS idx_saved_trips_is_favorite ON saved_trips(is_favorite);

CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_user_id ON property_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_rating ON property_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_is_primary ON property_photos(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_photos_display_order ON property_photos(display_order);

CREATE INDEX IF NOT EXISTS idx_epc_learning_provider_vertical ON epc_learning(provider, vertical);
CREATE INDEX IF NOT EXISTS idx_epc_learning_period ON epc_learning(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_email_journey_triggers_user_id ON email_journey_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_email_journey_triggers_type ON email_journey_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_email_journey_triggers_status ON email_journey_triggers(status);

-- Triggers for updated_at
CREATE TRIGGER update_saved_trips_updated_at BEFORE UPDATE ON saved_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_reviews_updated_at BEFORE UPDATE ON property_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_epc_learning_updated_at BEFORE UPDATE ON epc_learning
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_journey_triggers_updated_at BEFORE UPDATE ON email_journey_triggers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_journey_triggers ENABLE ROW LEVEL SECURITY;

-- Users can manage their own saved trips
CREATE POLICY "Users can manage own saved trips" ON saved_trips
  FOR ALL USING (auth.uid() = user_id::text);

-- Public can read property reviews
CREATE POLICY "Public can read property reviews" ON property_reviews
  FOR SELECT USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews" ON property_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id::text OR user_id IS NULL);

-- Public can read property photos
CREATE POLICY "Public can read property photos" ON property_photos
  FOR SELECT USING (true);

-- EPC learning is read-only for public, admin can manage
CREATE POLICY "Public can read epc learning" ON epc_learning
  FOR SELECT USING (true);

-- Users can read their own email triggers
CREATE POLICY "Users can read own email triggers" ON email_journey_triggers
  FOR SELECT USING (auth.uid() = user_id::text);


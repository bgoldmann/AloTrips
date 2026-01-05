-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  taxes_fees DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  rating DECIMAL(3, 2) NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  
  -- Flight specific
  stops INTEGER,
  duration TEXT,
  layover_minutes INTEGER,
  baggage_included BOOLEAN,
  carryon_included BOOLEAN,
  flight_number TEXT,
  departure_time TEXT,
  arrival_time TEXT,
  
  -- Hotel specific
  stars INTEGER,
  amenities TEXT[],
  
  -- Car specific
  car_type TEXT,
  transmission TEXT,
  passengers INTEGER,
  mileage_limit TEXT,
  
  -- Common
  refundable BOOLEAN NOT NULL DEFAULT false,
  epc DECIMAL(5, 4) NOT NULL,
  is_cheapest BOOLEAN DEFAULT false,
  is_best_value BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  home_airport TEXT,
  currency_preference TEXT DEFAULT 'USD' CHECK (currency_preference IN ('USD', 'EUR')),
  member_since TEXT,
  tier TEXT DEFAULT 'Silver' CHECK (tier IN ('Silver', 'Gold', 'Platinum')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  item_title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Flight', 'Hotel', 'Car')),
  status TEXT NOT NULL CHECK (status IN ('Confirmed', 'Pending', 'Cancelled')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_offers_vertical ON offers(vertical);
CREATE INDEX IF NOT EXISTS idx_offers_provider ON offers(provider);
CREATE INDEX IF NOT EXISTS idx_offers_total_price ON offers(total_price);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to offers
CREATE POLICY "Public read access to offers" ON offers
  FOR SELECT USING (true);

-- Policies: Allow authenticated users to read their own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id::text);

CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id::text);

-- Policies: Allow service role to manage all data (for admin operations)
-- Note: This should be done via service role key, not RLS policies


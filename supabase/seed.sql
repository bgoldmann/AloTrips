-- Seed data for offers (flights, stays, cars)
-- This matches the mock data from constants.ts

-- Flight Offers
INSERT INTO offers (id, provider, vertical, title, subtitle, base_price, taxes_fees, total_price, currency, rating, review_count, image, stops, duration, layover_minutes, baggage_included, carryon_included, refundable, epc, flight_number, departure_time, arrival_time) VALUES
('f1', 'kiwi', 'flights', 'New York (JFK) → London (LHR)', 'Norse Atlantic', 320, 45, 365, 'USD', 3.5, 120, 'https://picsum.photos/seed/NorseAtlantic/64/64', 0, '7h 10m', 0, false, true, false, 0.10, 'N0 201', '18:30', '06:40+1'),
('f2', 'skyscanner', 'flights', 'New York (JFK) → London (LHR)', 'British Airways', 350, 80, 430, 'USD', 4.2, 2500, 'https://picsum.photos/seed/BritishAirways/64/64', 0, '6h 55m', 0, true, true, true, 0.25, 'BA 112', '19:15', '07:10+1'),
('f3', 'expedia', 'flights', 'New York (JFK) → London (LHR)', 'Virgin Atlantic', 355, 78, 433, 'USD', 4.5, 1800, 'https://picsum.photos/seed/VirginAtlantic/64/64', 0, '7h 00m', 0, true, true, true, 0.35, 'VS 004', '20:00', '08:00+1'),
('f4', 'travelpayouts', 'flights', 'New York (JFK) → London (LHR)', 'JetBlue', 330, 50, 380, 'USD', 4.0, 800, 'https://picsum.photos/seed/JetBlue/64/64', 1, '9h 15m', 90, false, true, false, 0.18, 'B6 230', '14:45', '05:00+1')
ON CONFLICT (id) DO NOTHING;

-- Stay Offers
INSERT INTO offers (id, provider, vertical, title, subtitle, base_price, taxes_fees, total_price, currency, rating, review_count, image, stars, amenities, refundable, epc) VALUES
('h1', 'agoda', 'stays', 'Pod Times Square', 'Times Square, New York', 120, 30, 150, 'USD', 3.8, 450, 'https://picsum.photos/seed/h1/300/200', 3, ARRAY['Wifi', 'AC'], false, 0.20),
('h2', 'booking', 'stays', 'CitizenM Bowery', 'Bowery, New York', 155, 35, 190, 'USD', 4.8, 1200, 'https://picsum.photos/seed/h2/300/200', 4, ARRAY['Wifi', 'Rooftop Bar', 'Gym'], true, 0.45),
('h3', 'expedia', 'stays', 'Arlo NoMad', 'Midtown, New York', 158, 35, 193, 'USD', 4.6, 980, 'https://picsum.photos/seed/h3/300/200', 4, ARRAY['Wifi', 'City View'], true, 0.50)
ON CONFLICT (id) DO NOTHING;

-- Car Offers
INSERT INTO offers (id, provider, vertical, title, subtitle, base_price, taxes_fees, total_price, currency, rating, review_count, image, car_type, transmission, passengers, mileage_limit, amenities, refundable, epc) VALUES
('c1', 'expedia', 'cars', 'Toyota Corolla or similar', 'Hertz', 42, 18, 60, 'USD', 4.8, 1500, 'https://picsum.photos/seed/ToyotaCorollacar/300/200', 'Intermediate', 'Automatic', 5, 'Unlimited', ARRAY['Unlimited mileage', 'Collision Damage Waiver'], true, 0.22),
('c2', 'skyscanner', 'cars', 'Ford Fiesta', 'Budget', 35, 15, 50, 'USD', 4.2, 850, 'https://picsum.photos/seed/FordFiestacar/300/200', 'Economy', 'Manual', 4, 'Unlimited', ARRAY['Theft Protection'], false, 0.15),
('c3', 'booking', 'cars', 'Jeep Grand Cherokee', 'Alamo', 85, 25, 110, 'USD', 4.7, 600, 'https://picsum.photos/seed/JeepGrandCherokeecar/300/200', 'SUV', 'Automatic', 5, 'Unlimited', ARRAY['4WD', 'GPS Included'], true, 0.30)
ON CONFLICT (id) DO NOTHING;

-- Sample User
INSERT INTO users (id, email, first_name, last_name, phone, avatar, home_airport, currency_preference, member_since, tier, points) VALUES
('u_12345', 'alex.traveler@example.com', 'Alex', 'Traveler', '+1 (555) 012-3456', 'https://i.pravatar.cc/300?img=11', 'JFK - New York', 'USD', 'March 2023', 'Gold', 12500)
ON CONFLICT (id) DO NOTHING;

-- Sample Bookings
INSERT INTO bookings (id, user_id, date, item_title, type, status, amount, currency, provider, customer_name) VALUES
('BK-7829', 'u_12345', '2024-03-10', 'Pod Times Square', 'Hotel', 'Confirmed', 450, 'USD', 'Agoda', 'John Doe'),
('BK-7830', 'u_12345', '2024-03-11', 'JFK -> LHR (BA)', 'Flight', 'Pending', 890, 'USD', 'British Airways', 'Sarah Smith'),
('BK-7831', 'u_12345', '2024-03-12', 'Toyota Camry', 'Car', 'Confirmed', 120, 'USD', 'Hertz', 'Mike Jones'),
('BK-7832', 'u_12345', '2024-03-12', 'Hilton London', 'Hotel', 'Cancelled', 0, 'USD', 'Booking.com', 'Alex Traveler'),
('BK-7833', 'u_12345', '2024-03-13', 'Paris Package', 'Hotel', 'Confirmed', 1200, 'USD', 'Expedia', 'Emma Watson')
ON CONFLICT (id) DO NOTHING;


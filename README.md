# AloTrips.me

A full-service online travel aggregator (Expedia-style) that compares flights, hotels, cars, packages, cruises, and activities. Built with Next.js, Supabase, and deployed on Vercel.

## Features

- 🛫 **Multi-Vertical Search**: Flights, Stays, Cars, Packages, Cruises, Things to Do
- 💰 **Smart Pricing Engine**: Cheapest-first ranking with EPC-optimized "Best Value" recommendations
- 🎯 **Provider Aggregation**: Compare offers from multiple providers (Expedia, Travelpayouts, Skyscanner, Kiwi, Booking, Agoda)
- 📊 **Admin Dashboard**: Revenue tracking, booking management, user analytics
- 👤 **User Profiles**: Personal travel history, rewards points, preferences
- 🤖 **AI Travel Assistant**: Powered by Google Gemini for travel recommendations
- 🍪 **GDPR-Compliant**: Cookie consent management
- 📱 **Responsive Design**: Modern UI optimized for all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key (optional, for AI assistant)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AloTrips
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration file to create the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/seed.sql` to populate initial data

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (Optional)
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can find your Supabase credentials in:
- Project Settings → API → Project URL (NEXT_PUBLIC_SUPABASE_URL)
- Project Settings → API → anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Project Settings → API → service_role key (SUPABASE_SERVICE_ROLE_KEY)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (optional)
   - `NEXT_PUBLIC_GEMINI_API_KEY` (optional)
4. Deploy!

### Option 2: Deploy via CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

## Database Schema

The application uses three main tables:

- **offers**: Travel offers (flights, hotels, cars) with pricing and metadata
- **users**: User profiles with preferences and rewards
- **bookings**: Booking history and transactions

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## API Routes

- `GET /api/search?vertical={vertical}` - Search for offers by vertical
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/bookings?userId={userId}` - Get user bookings
- `GET /api/admin/stats` - Get admin dashboard statistics

## Project Structure

```
AloTrips/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities
│   └── supabase/         # Supabase client setup
├── services/              # Business logic
├── supabase/              # Database migrations and seeds
└── types.ts              # TypeScript types
```

## Key Features Implementation

### Decision Engine

The pricing decision engine (PRD Section 12) implements:
- Total price calculation with anti-fake-cheap penalties
- Tie-set selection (within $5 or 1% threshold)
- EPC + Provider Trust optimization
- Guardrails to prevent overpricing

### Multi-Provider Support

Currently supports mock data for:
- Expedia
- Travelpayouts
- Skyscanner
- Kiwi
- Booking.com
- Agoda

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Copyright © 2025 AloTrips.me. A Goldmann LLC company. All rights reserved.

## Support

For issues and questions, please open an issue on GitHub.

# AloTrips.me

A full-service online travel aggregator (Expedia-style) that compares flights, hotels, cars, packages, cruises, and activities. Built with Next.js 15, Supabase, and deployed on Vercel.

## 🚀 Features

- 🛫 **Multi-Vertical Search**: Flights, Stays, Cars, Packages, Cruises, Things to Do
- 💰 **Smart Pricing Engine**: Cheapest-first ranking with EPC-optimized "Best Value" recommendations
- 🎯 **Provider Aggregation**: Compare offers from multiple providers (Expedia, Travelpayouts, Skyscanner, Kiwi, Booking, Agoda)
- 📊 **Admin Dashboard**: Revenue tracking, booking management, user analytics
- 👤 **User Profiles**: Personal travel history, rewards points, preferences
- 🤖 **AI Travel Assistant**: Powered by Google Gemini for travel recommendations
- 💱 **Multi-Currency Support**: Real-time currency conversion with caching
- 🗺️ **Interactive Maps**: Property and activity location visualization
- 📦 **Package Bundling**: Flight+Hotel, Hotel+Car, Flight+Hotel+Car with savings calculation
- 🎫 **Things to Do**: Activity search with category, duration, and rating filters
- 🍪 **GDPR-Compliant**: Cookie consent management
- 🔒 **Security**: CSP headers, input sanitization, rate limiting
- 📱 **Responsive Design**: Modern UI optimized for all devices
- ✅ **Test Coverage**: Comprehensive test suite with Jest and React Testing Library

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Supabase** account ([sign up free](https://supabase.com))
- **Google Gemini API key** (optional, for AI assistant)
- **Exchange Rate API key** (optional, for currency conversion)

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

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (Optional - for AI assistant)
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Exchange Rate API (Optional - for currency conversion)
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find your credentials:**

- **Supabase**: Project Settings → API
  - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (keep secret!)
  
- **Google Gemini**: [Get API Key](https://makersuite.google.com/app/apikey)

- **Exchange Rate API**: [Get API Key](https://www.exchangerate-api.com/) (free tier available)

### 5. Run Database Migrations

In your Supabase dashboard SQL Editor, run the migrations in order:

1. `supabase/migrations/001_initial_schema.sql` - Creates main tables (offers, users, bookings)
2. `supabase/migrations/002_affiliate_tracking.sql` - Creates affiliate tracking tables
3. (Optional) `supabase/seed.sql` - Populates sample data

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In the Vercel project settings, add all environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (optional)
   - `NEXT_PUBLIC_GEMINI_API_KEY` (optional)
   - `EXCHANGE_RATE_API_KEY` (optional)
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

4. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? alotrips
# - Directory? ./
# - Override settings? N
# - Add environment variables? Y (add all from .env.example)
```

#### Production Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations run in Supabase
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Supabase RLS policies configured (if using)
- [ ] Domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics configured (optional)
- [ ] Error monitoring set up (optional - Sentry, etc.)

### Environment-Specific Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Development command: `npm run dev`
- Framework: Next.js
- Region: `iad1` (US East)

To change the region, edit `vercel.json`:
```json
{
  "regions": ["iad1"]  // Options: iad1, sfo1, hnd1, etc.
}
```

## Database Schema

The application uses three main tables:

- **offers**: Travel offers (flights, hotels, cars) with pricing and metadata
- **users**: User profiles with preferences and rewards
- **bookings**: Booking history and transactions

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## 📡 API Documentation

### Search API

**GET** `/api/search`

Search for travel offers across all verticals.

**Query Parameters:**
- `vertical` (required): `stays` | `flights` | `cars` | `packages` | `cruises` | `things-to-do`
- `destination` (required): Destination city or airport code
- `origin` (optional): Origin city or airport code (required for flights)
- `startDate` (required): Start date in `YYYY-MM-DD` format
- `endDate` (optional): End date in `YYYY-MM-DD` format
- `travelers` (optional): Number of travelers (default: 1)
- `adults` (optional): Number of adults
- `children` (optional): Number of children
- `rooms` (optional): Number of rooms (default: 1)
- `tripType` (optional): `round-trip` | `one-way` | `multi-city` (default: `round-trip`)

**Example:**
```bash
GET /api/search?vertical=flights&destination=Paris&origin=New%20York&startDate=2024-06-01&endDate=2024-06-10&tripType=round-trip
```

**Response:**
```json
{
  "offers": [
    {
      "id": "offer-id",
      "provider": "EXPEDIA",
      "vertical": "flights",
      "title": "Flight Title",
      "total_price": 600,
      "currency": "USD",
      ...
    }
  ]
}
```

### Currency API

**GET** `/api/currency/rates`

Get exchange rates for currency conversion.

**Query Parameters:**
- `from` (optional): Base currency (default: `USD`)
- `to` (optional): Target currency (default: `EUR`)
- `currencies` (optional): Comma-separated list of currencies

**Example:**
```bash
GET /api/currency/rates?from=USD&to=EUR
```

### User Profile API

**GET** `/api/user/profile` - Get current user profile  
**PUT** `/api/user/profile` - Update user profile

### Bookings API

**GET** `/api/bookings?userId={userId}` - Get user bookings

### Admin API

**GET** `/api/admin/affiliate/stats` - Get affiliate dashboard statistics  
**GET** `/api/admin/users` - List users (admin only)  
**GET** `/api/admin/bookings` - List bookings (admin only)

### Tracking API

**POST** `/api/tracking/event` - Track user events (clicks, views)  
**POST** `/api/affiliate/postback` - Receive conversion postbacks from partners

## 📁 Project Structure

```
AloTrips/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── search/              # Search endpoint
│   │   ├── currency/            # Currency conversion
│   │   ├── tracking/            # Event tracking
│   │   ├── admin/               # Admin endpoints
│   │   └── user/                 # User endpoints
│   ├── [vertical]/              # Vertical pages (stays, flights, etc.)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── App.tsx                  # Main app component
│   ├── OfferCard.tsx            # Offer display card
│   ├── FiltersPanel.tsx         # Search filters
│   ├── MapView.tsx              # Interactive map
│   └── ...                      # Other components
├── lib/                          # Utilities and business logic
│   ├── providers/               # Provider adapters
│   ├── currency/                # Currency conversion
│   ├── tracking/                # Affiliate tracking
│   ├── filters.ts               # Filter & sort logic
│   ├── packages/                # Package bundling
│   ├── upsells/                 # Upsell recommendations
│   └── supabase/                # Supabase client setup
├── services/                     # Service layer
│   └── searchService.ts         # Search service
├── hooks/                        # React hooks
│   └── useTracking.ts           # Tracking hook
├── types/                        # TypeScript types
│   ├── api.ts                   # API types
│   └── database.ts              # Database types
├── __tests__/                    # Test files
│   └── lib/                     # Unit tests
├── supabase/                     # Database
│   └── migrations/              # SQL migrations
├── constants.ts                  # App constants
├── middleware.ts                 # Next.js middleware (rate limiting)
├── next.config.js                # Next.js configuration
├── jest.config.js                # Jest configuration
└── package.json                  # Dependencies
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

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Test coverage includes:
- Currency conversion utilities
- Tracking utilities (click IDs, UTM params)
- Filter and sort logic
- Upsell recommendation engine
- Package bundling logic

## 📚 Additional Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[CHANGELOG.md](./CHANGELOG.md)** - Project changelog
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Development roadmap

## 🔧 Development

### Adding a New Provider

1. Create adapter in `lib/providers/[provider].ts`
2. Implement `ProviderAdapter` interface
3. Add normalization logic in `lib/providers/normalizer.ts`
4. Register in `lib/providers/index.ts`
5. Add API keys to `.env.example`

### Adding a New Vertical

1. Add vertical type to `types.ts`
2. Create vertical page in `app/[vertical]/page.tsx`
3. Add vertical-specific filters in `lib/filters.ts`
4. Update provider adapters to support new vertical
5. Add to sitemap generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

Copyright © 2025 AloTrips.me. A Goldmann LLC company. All rights reserved.

## 🆘 Support

- **Documentation**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- **Issues**: Open an issue on [GitHub](https://github.com/your-repo/issues)
- **Email**: support@alotrips.me

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)
- Icons by [Lucide](https://lucide.dev/)

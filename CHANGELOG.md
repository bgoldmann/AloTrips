# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup and structure
- CHANGELOG.md file for tracking changes
- **Documentation**: Created `DEPLOYMENT.md` with comprehensive deployment guide for Vercel
- **Environment Template**: Created `.env.example` file (note: actual file creation blocked by gitignore, but template exists in `env.txt`)
- **Analytics**: Added Google Analytics (gtag.js) tracking code (G-93ZEJ4BLJ4) to root layout using Next.js Script component

### Changed
- N/A

### Fixed
- **Syntax Error**: Fixed missing closing brace in `else` block in `app/api/search/route.ts` that caused TypeScript compilation error
- **React Hooks**: Fixed `useEffect` dependency issues in `components/AdminPanel.tsx` by using `useCallback` to properly memoize `fetchBookings` and `fetchUsers` functions
- **Typo Fix**: Fixed inconsistent constant name `NO_BAGgage` to `NO_BAGGAGE` in `constants.ts` and `services/searchService.ts`
- **Code Formatting**: Fixed indentation issue in `app/api/search/route.ts` catch block
- **React Hooks**: Fixed improper use of `React.useRef` and `React.useEffect` inside map function in `components/AdminPanel.tsx` - replaced with inline style approach
- **Type Safety**: Removed unnecessary type casting (`as any`) from Supabase queries in multiple API routes:
  - `app/api/search/route.ts`
  - `app/api/admin/bookings/route.ts`
  - `app/api/admin/users/route.ts`
  - `app/api/trips/saved/route.ts`
  - `app/api/properties/reviews/route.ts`
  - `app/api/email/journey/route.ts`
  - `app/api/admin/epc/learn/route.ts`
  - `app/api/user/profile/route.ts`
  - `app/api/tracking/event/route.ts`
  - `app/api/affiliate/postback/route.ts`
- **Memory Leak Prevention**: Added cache size limit (max 1000 entries) to `InMemoryCache` class in `lib/providers/aggregator.ts` to prevent unbounded memory growth
- **Security**: Added try-catch wrapper around `JSON.parse` for `flightSegments` parameter in `app/api/search/route.ts` to prevent crashes from malformed JSON input
- **Type Safety**: Fixed unsafe type assertions in member pricing logic in `app/api/search/route.ts` - replaced `as any` with proper `Object.assign` for extending Offer type
- **Null Safety**: Added comprehensive array type checks (`Array.isArray`) before calling `.map()`, `.filter()`, or `.push()` operations in `app/api/search/route.ts` to prevent runtime errors
- **Null Safety**: Added null check for `segmentOffers[0]` before accessing array elements in multi-city flight handling to prevent potential null pointer errors
- **Type Safety**: Fixed TypeScript errors in user tier lookup by adding proper type assertions and null checks in `app/api/search/route.ts`
- **Type Safety**: Fixed Supabase upsert type error by properly handling promise chain and type assertions
- **Feature**: Added `flightSegments`, `flexibleDays`, and `includeNearbyAirports` parameter handling in `services/searchService.ts` to ensure all search parameters are properly passed to API
- **Feature**: Enhanced multi-city flight search in `components/App.tsx` to properly serialize and send flight segments to the API

### Security
- **Input Validation**: Added safe JSON parsing with error handling for `flightSegments` parameter to prevent potential crashes from malformed user input
- **Type Safety**: Improved type safety by removing unsafe type casts in database operations
- **Authentication**: Added authentication checks to all admin routes (`/api/admin/*`) - now requires admin role or Platinum tier
- **Authorization**: Added proper user session checks in user profile and saved trips routes, replacing hardcoded user IDs
- **Access Control**: Added ownership verification for saved trips (users can only access/modify their own trips)
- **Input Validation**: Added validation for pagination parameters (page, limit) with bounds checking to prevent abuse
- **Status Validation**: Added validation for booking status values to prevent invalid state changes
- **Rate Limiting**: Added size limit (10,000 entries) to rate limit store to prevent memory leaks in middleware

### Documentation
- **Code Audit**: Performed comprehensive codebase review and identified:
  - Unused root `App.tsx` file (duplicate of `components/App.tsx`) - not imported anywhere, safe to remove
  - Missing `.env.example` file - template exists in `env.txt` but should be copied to `.env.example` for new developers
  - Missing `DEPLOYMENT.md` - now created with full deployment instructions
  - TODO comments identified for future implementation:
    - `lib/auth/admin.ts`: Role-based access control needs proper implementation
    - `lib/errors/logger.ts`: Error tracking service integration (Sentry) pending
    - `lib/providers/expedia.ts`: Actual Expedia Rapid API integration pending
    - `lib/providers/travelpayouts.ts`: Actual Travelpayouts API integration and health check pending
    - `lib/providers/skyscanner.ts`: Actual Skyscanner API integration pending
    - `lib/providers/kiwi.ts`: Actual Kiwi Tequila API integration pending


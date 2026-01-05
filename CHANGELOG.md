# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial conversion from Vite React app to Next.js App Router
- Supabase integration for database and backend services
- Vercel deployment configuration
- API routes for search functionality (`/api/search`, `/api/user/profile`, `/api/bookings`, `/api/admin/stats`)
- Database schema and migrations for offers, users, bookings
- Environment variable configuration for Supabase and Gemini API
- Next.js middleware for Supabase session management
- Tailwind CSS configuration
- TypeScript configuration for Next.js
- Comprehensive README with setup instructions

### Changed
- Migrated from Vite to Next.js 15 for better Vercel optimization and SEO
- Converted all interactive components to Next.js client components (`'use client'`)
- Updated search service to fetch from API instead of using mock data directly
- Updated App component to fetch user profile from API
- Updated UserProfile and AdminPanel to fetch data from Supabase via API routes
- Replaced direct mock data access with API calls

### Technical
- Next.js 15 App Router architecture
- Supabase client-side and server-side integration with `@supabase/ssr`
- Type-safe database queries with Supabase TypeScript types
- Server-side API routes for data operations
- Client-side components for interactive UI
- Middleware for session management


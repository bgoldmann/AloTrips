# Setup Guide for AloTrips.me

This guide will walk you through setting up AloTrips.me locally and deploying to Vercel with Supabase.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)
- A Google Gemini API key (optional, for AI assistant)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: AloTrips (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for the project to initialize

### 2.2 Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Wait for success message
6. Create a new query and run `supabase/seed.sql` to populate initial data

### 2.3 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (this is your `SUPABASE_SERVICE_ROLE_KEY`) - Keep this secret!

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Gemini API (Optional - for AI assistant)
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Gemini API Key (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to `.env.local`

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the AloTrips homepage with the search interface.

## Step 5: Verify Database Connection

1. In your browser, navigate to the search page
2. Select a vertical (Flights, Stays, or Cars)
3. Click "Search"
4. You should see results from the database

If you see results, your Supabase connection is working! 🎉

## Step 6: Deploy to Vercel

### 6.1 Prepare for Deployment

1. Make sure your code is pushed to GitHub
2. Ensure `.env.local` is in `.gitignore` (it should be)

### 6.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GEMINI_API_KEY` (optional)
     - `NEXT_PUBLIC_GEMINI_API_KEY` (optional)
     - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL after first deploy)
6. Click "Deploy"
7. Wait for deployment to complete (2-3 minutes)

### 6.3 Update App URL

After first deployment:

1. Copy your Vercel deployment URL (e.g., `https://alotrips.vercel.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Redeploy (or it will auto-redeploy on next push)

## Step 7: Configure Supabase for Production

### 7.1 Update Supabase RLS Policies (if needed)

The migration includes basic RLS policies. For production, you may want to:

1. Go to Supabase Dashboard → Authentication → Policies
2. Review and adjust policies based on your needs
3. Consider adding authentication for user-specific data

### 7.2 Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Database Connection Issues

- **Error**: "Failed to fetch offers"
  - Check that Supabase URL and keys are correct
  - Verify migrations ran successfully
  - Check Supabase project is active (not paused)

### Environment Variables Not Working

- Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing `.env.local`
- In Vercel, ensure variables are set for all environments (Production, Preview, Development)

### Build Errors

- Run `npm run build` locally to catch errors before deploying
- Check that all dependencies are in `package.json`
- Ensure TypeScript types are correct

### No Search Results

- Verify seed data was inserted: Go to Supabase → Table Editor → `offers` table
- Check that offers have the correct `vertical` value
- Verify API route is working: Check browser Network tab

## Next Steps

- [ ] Set up authentication (Supabase Auth)
- [ ] Add real API integrations (replace mock data)
- [ ] Configure SEO (meta tags, sitemap)
- [ ] Set up analytics
- [ ] Add error tracking (Sentry, etc.)

## Support

For issues:
1. Check the [README.md](./README.md)
2. Review [CHANGELOG.md](./CHANGELOG.md)
3. Open an issue on GitHub


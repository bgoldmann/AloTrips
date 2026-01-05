# Deployment Guide

This guide covers deploying AloTrips.me to production on Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set in your Vercel project:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your production domain)

**Optional:**
- `GEMINI_API_KEY` (for AI assistant)
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `EXCHANGE_RATE_API_KEY` (for currency conversion)
- Provider API keys (Travelpayouts, Skyscanner, etc.)

### 2. Database Setup

1. **Run Migrations**
   - Go to Supabase SQL Editor
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_affiliate_tracking.sql`

2. **Configure Row Level Security (RLS)**
   - Enable RLS on sensitive tables if needed
   - Configure policies for user data access

3. **Set Up Indexes**
   - Add indexes on frequently queried columns
   - Monitor query performance in Supabase dashboard

### 3. Build Configuration

The `vercel.json` file is pre-configured with:
- Build command: `npm run build`
- Framework: Next.js
- Region: `iad1` (US East)

### 4. Domain Configuration

1. **Add Custom Domain** (Optional)
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy after domain changes

## Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Via Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Click "Deploy"

#### Via CLI:
```bash
vercel --prod
```

### Step 3: Verify Deployment

1. **Check Build Logs**
   - Ensure build completes successfully
   - Check for any warnings or errors

2. **Test Key Features**
   - Search functionality
   - User authentication
   - API endpoints
   - Admin dashboard

3. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor Supabase usage
   - Check error logs

## Post-Deployment

### 1. Set Up Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider integrating Sentry
- **Uptime Monitoring**: Set up with UptimeRobot or similar

### 2. Configure CDN

Vercel automatically provides:
- Global CDN
- Image optimization
- Automatic HTTPS

### 3. Set Up CI/CD

Vercel automatically:
- Deploys on every push to `main`
- Creates preview deployments for PRs
- Runs build checks

### 4. Database Backups

Configure Supabase backups:
- Go to Supabase project settings
- Enable daily backups
- Set retention period

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run build` locally first
- Check for type errors: `npx tsc --noEmit`

**Issue**: Environment variables not found
- **Solution**: Ensure all variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)

### Runtime Errors

**Issue**: API routes return 500 errors
- **Solution**: Check Vercel function logs
- Verify Supabase connection
- Check environment variables

**Issue**: Database connection errors
- **Solution**: Verify Supabase URL and keys
- Check Supabase project status
- Verify network access

### Performance Issues

**Issue**: Slow page loads
- **Solution**: Enable Vercel Analytics
- Check image optimization
- Review bundle size
- Consider enabling ISR (Incremental Static Regeneration)

## Rollback

If deployment fails:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find last successful deployment
   - Click "..." → "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

## Production Best Practices

1. **Security**
   - Never commit `.env.local` files
   - Use Vercel environment variables
   - Enable Supabase RLS
   - Regularly update dependencies

2. **Performance**
   - Monitor Core Web Vitals
   - Optimize images
   - Use Next.js Image component
   - Enable caching where appropriate

3. **Monitoring**
   - Set up error alerts
   - Monitor API usage
   - Track conversion rates
   - Review analytics regularly

4. **Updates**
   - Test in preview deployments first
   - Use feature flags for major changes
   - Monitor after deployments
   - Keep dependencies updated

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on GitHub


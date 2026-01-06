# Deployment Guide

Complete guide for deploying AloTrips.me to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run in Supabase
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Supabase RLS policies configured
- [ ] Domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics configured (optional)
- [ ] Error monitoring set up (optional - Sentry, etc.)

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In the Vercel project settings, add all environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (optional)
   - `NEXT_PUBLIC_GEMINI_API_KEY` (optional)
   - `EXCHANGE_RATE_API_KEY` (optional)
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
   - Provider API keys (optional):
     - `TRAVELPAYOUTS_API_KEY`
     - `SKYSCANNER_API_KEY`
     - `EXPEDIA_API_KEY`
     - `KIWI_API_KEY`

4. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

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

### Production Deployment

For production deployment:

```bash
# Deploy to production
vercel --prod
```

## Environment-Specific Configuration

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

## Post-Deployment Steps

### 1. Update App URL

After first deployment:

1. Copy your Vercel deployment URL (e.g., `https://alotrips.vercel.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Redeploy (or it will auto-redeploy on next push)

### 2. Configure Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued (automatic)

### 3. Set Up Supabase for Production

1. **Review RLS Policies**
   - Go to Supabase Dashboard → Authentication → Policies
   - Ensure policies are configured for production use
   - Test with production credentials

2. **Configure CORS** (if needed)
   - Add your production domain to Supabase allowed origins
   - Go to Project Settings → API → CORS

3. **Set Up Database Backups**
   - Configure automatic backups in Supabase
   - Set up point-in-time recovery if needed

### 4. Monitor Performance

- **Vercel Analytics**: Enable in Vercel Dashboard
- **Error Tracking**: Set up Sentry or similar service
- **Performance Monitoring**: Use Vercel Speed Insights

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Production app URL | `https://alotrips.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Public Gemini API key | - |
| `EXCHANGE_RATE_API_KEY` | Exchange rate API key | - |
| `TRAVELPAYOUTS_API_KEY` | Travelpayouts API key | - |
| `SKYSCANNER_API_KEY` | Skyscanner API key | - |
| `EXPEDIA_API_KEY` | Expedia API key | - |
| `KIWI_API_KEY` | Kiwi API key | - |

## Troubleshooting Deployment

### Build Failures

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run build` locally first to catch errors
- Check that all types are properly defined
- Ensure all imports are correct

**Issue**: Build fails with module not found
- **Solution**: Check `package.json` has all dependencies
- Run `npm install` locally to verify
- Check for missing peer dependencies

### Runtime Errors

**Issue**: API routes return 500 errors
- **Check**: Vercel function logs in dashboard
- **Verify**: Environment variables are set correctly
- **Test**: API route directly with curl or Postman

**Issue**: Database connection fails
- **Check**: Supabase project is active (not paused)
- **Verify**: Environment variables are correct
- **Test**: Connection in Supabase dashboard

**Issue**: Images not loading
- **Check**: `next.config.js` remote patterns
- **Verify**: Image URLs are valid
- **Solution**: Add domain to `remotePatterns` in `next.config.js`

### Performance Issues

**Issue**: Slow page loads
- **Check**: Vercel Analytics for performance metrics
- **Optimize**: Images, fonts, and bundle size
- **Consider**: Enabling Vercel Edge Functions for API routes

**Issue**: High function execution time
- **Check**: Vercel function logs for slow queries
- **Optimize**: Database queries and API calls
- **Consider**: Adding caching layers

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. Push to `main` branch
2. Vercel detects the push
3. Builds the project
4. Deploys to production
5. Sends deployment notification

### Preview Deployments

Every pull request gets a preview deployment:
- Automatic preview URL
- Isolated environment
- Test before merging

## Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the deployment you want to rollback to
3. Click the three dots menu
4. Select "Promote to Production"

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use service role key carefully**: Only in server-side code
3. **Enable RLS**: Use Row Level Security in Supabase
4. **Rate limiting**: Already configured in `middleware.ts`
5. **Input validation**: Sanitize all user inputs
6. **HTTPS only**: Vercel provides SSL automatically

## Monitoring and Alerts

### Set Up Alerts

1. **Vercel Alerts**: Configure in project settings
2. **Error Tracking**: Set up Sentry or similar
3. **Uptime Monitoring**: Use UptimeRobot or similar
4. **Database Monitoring**: Use Supabase dashboard

### Key Metrics to Monitor

- Deployment success rate
- API response times
- Error rates
- Database query performance
- Function execution times
- Build times

## Support

For deployment issues:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review Vercel documentation
3. Check Supabase status page
4. Open an issue on GitHub


# Troubleshooting Guide

Common issues and solutions for AloTrips.me development and deployment.

## Development Issues

### Build Errors

**Issue**: `Module not found` errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

**Issue**: TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit

# Fix common issues:
# - Missing type definitions: npm install --save-dev @types/[package]
# - Import errors: Check tsconfig.json paths configuration
```

**Issue**: Next.js build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Runtime Errors

**Issue**: "Cannot connect to Supabase"
- **Check**: Environment variables are set in `.env.local`
- **Verify**: Supabase project is active
- **Test**: Connection in Supabase dashboard

**Issue**: API routes return 500 errors
- **Check**: Vercel function logs (if deployed)
- **Verify**: Environment variables are correct
- **Test**: API route directly with curl or Postman

**Issue**: Images not loading
- **Check**: `next.config.js` remote patterns
- **Verify**: Image URLs are valid
- **Solution**: Add domain to `remotePatterns` in `next.config.js`

### Database Issues

**Issue**: Migration errors
- **Check**: SQL syntax in migration files
- **Verify**: Supabase project has correct permissions
- **Solution**: Run migrations one at a time

**Issue**: RLS (Row Level Security) blocking queries
- **Check**: RLS policies in Supabase dashboard
- **Verify**: Service role key is used for admin operations
- **Solution**: Temporarily disable RLS for testing (not recommended for production)

## Testing Issues

**Issue**: Tests fail with "Cannot find module"
```bash
# Clear Jest cache
npm test -- --clearCache
```

**Issue**: Tests timeout
- **Solution**: Increase timeout in `jest.config.js`
- **Check**: Async operations are properly awaited

**Issue**: Mock errors
- **Check**: `jest.setup.js` mocks are correct
- **Verify**: Mock implementations match actual APIs

## Deployment Issues

### Vercel Deployment

**Issue**: Build fails on Vercel
- **Check**: Build logs in Vercel dashboard
- **Verify**: All dependencies are in `package.json`
- **Solution**: Test build locally: `npm run build`

**Issue**: Environment variables not working
- **Check**: Variables are set in Vercel dashboard
- **Verify**: Variable names match exactly (case-sensitive)
- **Note**: `NEXT_PUBLIC_*` variables are exposed to client

**Issue**: Function timeout
- **Solution**: Increase timeout in `vercel.json`
- **Check**: API routes are optimized
- **Consider**: Breaking large operations into smaller chunks

### Supabase Issues

**Issue**: Connection pool exhausted
- **Solution**: Use connection pooling
- **Check**: Close connections properly
- **Consider**: Upgrade Supabase plan

**Issue**: Rate limiting
- **Check**: Supabase usage dashboard
- **Solution**: Implement caching
- **Consider**: Upgrade plan if needed

## Performance Issues

**Issue**: Slow page loads
- **Check**: Bundle size with `npm run build`
- **Solution**: Code splitting, lazy loading
- **Verify**: Images are optimized

**Issue**: API responses slow
- **Check**: Provider API response times
- **Solution**: Implement caching
- **Consider**: Increase timeout values

**Issue**: Database queries slow
- **Check**: Query performance in Supabase
- **Solution**: Add indexes
- **Verify**: Queries are optimized

## Provider Integration Issues

**Issue**: Provider API errors
- **Check**: API keys are valid
- **Verify**: API rate limits not exceeded
- **Solution**: Check provider status page
- **Fallback**: System uses mock data if provider fails

**Issue**: No results from providers
- **Check**: Search parameters are valid
- **Verify**: Provider supports the search criteria
- **Solution**: Test with different parameters

## Currency Conversion Issues

**Issue**: Currency rates not updating
- **Check**: Exchange Rate API key is valid
- **Verify**: API quota not exceeded
- **Solution**: System falls back to cached rates

**Issue**: Incorrect conversions
- **Check**: Fallback rates in `lib/currency/converter.ts`
- **Verify**: API response format
- **Solution**: Update fallback rates if needed

## Common Fixes

### Clear All Caches
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install

# Clear Jest cache
npm test -- --clearCache
```

### Reset Database
```bash
# In Supabase SQL Editor, run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then re-run migrations
```

### Check Logs
```bash
# Local development
npm run dev
# Check console for errors

# Vercel deployment
# Check Vercel dashboard → Functions → Logs

# Supabase
# Check Supabase dashboard → Logs
```

## Getting Help

1. **Check Documentation**
   - README.md
   - API Documentation
   - Component documentation

2. **Search Issues**
   - GitHub Issues
   - Stack Overflow
   - Next.js Discord

3. **Create Issue**
   - Include error messages
   - Provide steps to reproduce
   - Include environment details

## Prevention Tips

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Test updates in development first

2. **Error Handling**
   - Implement proper error boundaries
   - Log errors appropriately
   - Provide user-friendly error messages

3. **Testing**
   - Write tests for critical paths
   - Test before deploying
   - Use preview deployments

4. **Monitoring**
   - Set up error tracking
   - Monitor performance metrics
   - Review logs regularly


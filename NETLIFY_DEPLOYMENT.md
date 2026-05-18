# Netlify Deployment Guide for M Coding Website

## Issue Resolved

### Problem
The deployment was failing with exit code 2 during the `@netlify/plugin-nextjs` onBuild event.

### Root Cause
The project was configured with the **legacy Netlify plugin** (`@netlify/plugin-nextjs`), which is only compatible with Next.js versions **prior to 13.5**. This project uses Next.js 15.5.9, which requires the newer Essential Next.js plugin.

### Solution Applied
1. ✅ Removed `[[plugins]]` section from `netlify.toml`
2. ✅ Removed `@netlify/plugin-nextjs` from `package.json` devDependencies
3. ✅ Simplified build command to `npm run build` (removed `--legacy-peer-deps`)
4. ✅ Updated and committed changes to GitHub

## How Netlify Handles Next.js 15

For Next.js 13.5+, Netlify **automatically** uses the **Essential Next.js plugin** powered by the [OpenNext adapter](https://github.com/opennextjs/opennextjs-netlify). This means:

- **No manual plugin configuration needed** - Netlify detects Next.js and applies the correct adapter
- **Full App Router support** - Server Components, Server Actions, Streaming all work
- **Automatic edge optimization** - Middleware runs on Edge Functions
- **Built-in caching** - Incremental Static Regeneration (ISR) and Data Cache work out of the box
- **Image optimization** - `next/image` uses Netlify Image CDN automatically

## Current Configuration

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

This minimal configuration is all that's needed!

## Auto-Deployment Status

If your Netlify site (https://m-coding.ie) has auto-deployment enabled:

1. **Automatic trigger**: Pushes to the `main` branch trigger deployments
2. **Build logs**: Check https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
3. **Expected build time**: 2-5 minutes for typical builds

## Monitoring Deployment

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your M Coding site
3. Click "Deploys" to see build status
4. Latest commit: `be1a17b` - "Update package-lock.json after removing legacy plugin"

## Features Now Supported

- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ React Server Components
- ✅ Server Actions
- ✅ Next.js Middleware (Edge Functions)
- ✅ Image Optimization (Netlify Image CDN)
- ✅ API Routes
- ✅ Dynamic Routes

## Build Verification

Local build test completed successfully:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (10/10)
Route (app)                                 Size  First Load JS
┌ ○ /                                      953 B         108 kB
├ ○ /about                               5.16 kB         112 kB
├ ○ /products                            3.27 kB         110 kB
└ ○ /services                              162 B         106 kB
```

## Troubleshooting

If deployment still fails:

1. **Check build logs** in Netlify Dashboard
2. **Verify Node version**: Ensure Netlify uses Node 20 (configured in netlify.toml)
3. **Clear build cache**: In Netlify, go to Site Settings → Build & Deploy → Clear cache and retry
4. **Check environment variables**: Ensure no conflicting env vars are set

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [OpenNext Netlify Adapter](https://github.com/opennextjs/opennextjs-netlify)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)

# CV Enhancements Setup Guide

This guide will help you set up the new CV enhancement features: Contact Form, Enhanced PDF Export, and Scroll-Triggered Animations.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (for deployment)
- Resend account (for contact form emails)
- Upstash account (for rate limiting)

## Installation

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Environment Variables Setup

### 1. Resend API (Contact Form)

**Purpose:** Send emails from the contact form

**Steps:**
1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_EMAIL_TO=ruslan.lapinyak@gmail.com
   ```

**Verify Domain (Optional but Recommended):**
- Add your domain in Resend dashboard
- Add DNS records to verify ownership
- This allows sending from your custom domain

### 2. Upstash Redis (Rate Limiting)

**Purpose:** Prevent spam on contact form (3 requests/hour per IP)

**Steps:**
1. Go to [console.upstash.com](https://console.upstash.com) and sign up
2. Create a new Redis database
3. Copy the REST API credentials
4. Add to `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
   ```

**Note:** You can use the existing Vercel KV if you prefer, but Upstash Redis is recommended for better control.

### 3. GitHub Personal Access Token (GitHub Stats)

**Purpose:** Avoid rate limiting on GitHub Stats API

**Steps:**
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "CV GitHub Stats")
4. Select scopes: **No scopes needed** for public stats only
5. Click "Generate token" and copy it
6. Add to `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
   ```

**Note:** This token is optional but highly recommended to prevent 503 errors from GitHub Stats API rate limiting.

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your CV.

**Note:** Rate limiting is automatically disabled in development mode for easier testing.

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm test -- contact-form
npm test -- pdf-export
npm test -- animations
```

### Property-Based Tests
Property-based tests run 100 iterations by default. To change:
```typescript
// In test files
fc.assert(fc.property(...), { numRuns: 200 });
```

## Deployment to Vercel

### 1. Set Environment Variables

Using Vercel CLI:
```bash
vercel env add RESEND_API_KEY
vercel env add CONTACT_EMAIL_TO
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

Or via Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development

### 2. Deploy

```bash
vercel --prod
```

### 3. Verify Deployment

After deployment, test:
- ✅ Contact form sends emails
- ✅ Rate limiting works (try 4 submissions in an hour)
- ✅ PDF exports correctly
- ✅ Animations trigger on scroll
- ✅ Both EN and UA languages work

## Troubleshooting

### Contact Form Not Sending Emails

**Check:**
1. `RESEND_API_KEY` is set correctly
2. `CONTACT_EMAIL_TO` is a valid email
3. Check Resend dashboard for delivery logs
4. Verify domain if using custom domain

**Common Issues:**
- API key not set in production environment
- Email address not verified in Resend
- Rate limit exceeded (check Redis)

### Rate Limiting Not Working

**Check:**
1. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
2. Redis database is active in Upstash console
3. Check Redis logs in Upstash dashboard

**Common Issues:**
- Credentials expired or incorrect
- Redis database paused or deleted
- IP detection not working (check headers)

### PDF Export Fails

**Check:**
1. Browser console for errors
2. CV data is valid (no missing required fields)
3. Images are accessible (profile photo)

**Common Issues:**
- Large images causing memory issues
- Invalid CV data structure
- Browser compatibility (try Chrome/Firefox)

### Animations Not Working

**Check:**
1. Framer Motion is installed
2. No JavaScript errors in console
3. `prefers-reduced-motion` is not set (or animations are disabled intentionally)

**Common Issues:**
- Intersection Observer not supported (old browsers)
- Performance issues on low-end devices
- CSS conflicts with existing styles

## Features Overview

### Contact Form
- **Location:** New section after AI Assistant
- **Validation:** Real-time with Zod schema
- **Rate Limit:** 3 requests/hour per IP
- **Languages:** EN and UA supported

### Enhanced PDF Export
- **Button Location:** Header/Navigation
- **Format:** Professional A4 layout
- **Features:** Clickable links, proper typography, print-optimized
- **Filename:** `{Name}_CV_{lang}_{date}.pdf`

### Scroll Animations
- **Trigger:** Elements entering viewport
- **Types:** Fade-in, fade-up, scale-in, stagger
- **Accessibility:** Respects `prefers-reduced-motion`
- **Performance:** 60fps on modern devices

## Support

For issues or questions:
1. Check this setup guide
2. Review the design document: `.kiro/specs/cv-enhancements/design.md`
3. Check requirements: `.kiro/specs/cv-enhancements/requirements.md`
4. Review tasks: `.kiro/specs/cv-enhancements/tasks.md`

## Next Steps

After setup is complete:
1. Test contact form locally
2. Generate a PDF and verify formatting
3. Check animations on different screen sizes
4. Deploy to Vercel
5. Test all features in production
6. Monitor Resend and Upstash dashboards for usage

Happy coding! 🚀

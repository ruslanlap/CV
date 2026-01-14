# Deployment Guide

This guide walks you through deploying the CV website to Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables Ready
Ensure you have all required environment variables:

```env
# Required for Contact Form
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL_TO=your_email@example.com

# Required for Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# Optional but Recommended
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
FIREWORKS_API_KEY=fw_xxxxxxxxxxxxx
```

### 2. Build Test
Verify the project builds successfully:

```bash
npm run build
```

Expected output: No errors, all pages generated successfully.

### 3. Local Testing
Test all features locally:

```bash
npm run dev
```

- ✅ Contact form sends emails
- ✅ PDF export works
- ✅ Animations trigger on scroll
- ✅ Both EN and UA languages work
- ✅ Theme toggle works
- ✅ No console errors

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended for First Deploy)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add CV enhancements: contact form, PDF export, animations"
git push origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

#### Step 3: Add Environment Variables
1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL_TO`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `GITHUB_TOKEN` (optional)
   - `FIREWORKS_API_KEY` (optional)
3. Select environments: Production, Preview, Development
4. Click "Save"

#### Step 4: Redeploy
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Method 2: Vercel CLI (For Quick Updates)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Link Project (First Time Only)
```bash
vercel link
```

Follow prompts:
- Set up and deploy? → `Y`
- Which scope? → Select your account
- Link to existing project? → `Y` (if exists) or `N` (new project)
- Project name → Enter name or press Enter

#### Step 4: Add Environment Variables
```bash
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL_TO production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add GITHUB_TOKEN production
```

Paste the value when prompted.

#### Step 5: Deploy to Production
```bash
vercel --prod
```

## Post-Deployment Verification

### 1. Test Contact Form
1. Navigate to your deployed site
2. Scroll to Contact section
3. Fill out the form with test data
4. Submit and verify:
   - ✅ Success message appears
   - ✅ Email received at `CONTACT_EMAIL_TO`
   - ✅ Reply-to is set to visitor's email

### 2. Test Rate Limiting
1. Submit contact form 3 times within an hour
2. On 4th attempt, verify:
   - ✅ Error message about rate limit
   - ✅ Time until next allowed request shown

### 3. Test PDF Export
1. Click PDF button in header
2. Verify:
   - ✅ PDF opens in new tab
   - ✅ All sections present
   - ✅ Links are clickable
   - ✅ Formatting looks professional
   - ✅ Images render correctly

### 4. Test Animations
1. Scroll through the page
2. Verify:
   - ✅ Sections fade in smoothly
   - ✅ Cards stagger nicely
   - ✅ No janky animations
   - ✅ 60fps performance

### 5. Test Both Languages
1. Switch between `/en` and `/ua`
2. Verify:
   - ✅ All content translates
   - ✅ Contact form labels in correct language
   - ✅ PDF exports in correct language
   - ✅ Navigation works

### 6. Test Theme Toggle
1. Toggle between light and dark themes
2. Verify:
   - ✅ All colors change appropriately
   - ✅ Theme persists on page reload
   - ✅ No flash of unstyled content

### 7. Test Mobile Responsiveness
1. Open DevTools → Device Toolbar
2. Test on:
   - ✅ iPhone SE (375px)
   - ✅ iPad (768px)
   - ✅ Desktop (1920px)
3. Verify:
   - ✅ Contact form is usable
   - ✅ Navigation menu works
   - ✅ PDF button accessible
   - ✅ No horizontal scroll

## Monitoring

### Vercel Dashboard
Monitor your deployment:
- **Analytics**: Page views, performance metrics
- **Logs**: Runtime logs, errors
- **Deployments**: History, rollback options

### Resend Dashboard
Monitor email delivery:
- **Logs**: Email delivery status
- **Analytics**: Open rates, bounce rates
- **Domains**: Domain verification status

### Upstash Console
Monitor rate limiting:
- **Metrics**: Request counts, hit rates
- **Data Browser**: View rate limit keys
- **Logs**: Redis operations

## Troubleshooting

### Contact Form Not Working

**Symptom**: Form submits but no email received

**Solutions**:
1. Check Vercel logs for errors
2. Verify `RESEND_API_KEY` is set in production
3. Check Resend dashboard for delivery logs
4. Verify `CONTACT_EMAIL_TO` is correct
5. Check spam folder

### Rate Limiting Not Working

**Symptom**: Can submit form more than 3 times/hour

**Solutions**:
1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
2. Check Upstash console - database should be active
3. Check Vercel logs for Redis connection errors
4. Verify IP detection is working (check headers)

### PDF Export Fails

**Symptom**: PDF button doesn't work or shows error

**Solutions**:
1. Check browser console for errors
2. Try different browser (Chrome recommended)
3. Check if images are loading
4. Verify CV data structure is valid
5. Check Vercel logs for server errors

### Animations Not Smooth

**Symptom**: Janky or laggy animations

**Solutions**:
1. Check browser performance (60fps target)
2. Verify `prefers-reduced-motion` is not set
3. Test on different device
4. Check for JavaScript errors
5. Verify Framer Motion is loaded

### Build Fails

**Symptom**: Deployment fails during build

**Solutions**:
1. Run `npm run build` locally to reproduce
2. Check for TypeScript errors
3. Verify all dependencies are installed
4. Check Node.js version (18+ required)
5. Review build logs in Vercel

## Rollback

If something goes wrong, you can rollback:

### Via Vercel Dashboard
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via Vercel CLI
```bash
vercel rollback
```

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Project Settings → Domains
2. Enter your domain (e.g., `cv.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### SSL Certificate
Vercel automatically provisions SSL certificates for all domains.

## Performance Optimization

### Enable Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Monitor Core Web Vitals

### Enable Speed Insights
1. Install package:
   ```bash
   npm install @vercel/speed-insights
   ```
2. Add to layout:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/next';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```
3. Redeploy

## Security

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel's encrypted environment variables
- ✅ Rotate API keys regularly
- ✅ Use different keys for development and production

### Rate Limiting
- ✅ Contact form: 3 requests/hour per IP
- ✅ AI endpoints: 5 requests/day per IP
- ✅ Monitor Upstash for abuse

### Content Security Policy
Already configured in `next.config.js`:
- ✅ Restricts script sources
- ✅ Prevents XSS attacks
- ✅ Allows only trusted domains

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitor Costs
- **Vercel**: Free tier includes 100GB bandwidth
- **Resend**: Free tier includes 3,000 emails/month
- **Upstash**: Free tier includes 10,000 commands/day

### Backup
- Git repository is your backup
- Vercel keeps deployment history
- Export environment variables regularly

## Support

For deployment issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Resend documentation: [resend.com/docs](https://resend.com/docs)
3. Check Upstash documentation: [docs.upstash.com](https://docs.upstash.com)
4. Review this guide and SETUP.md

## Success Criteria

Your deployment is successful when:
- ✅ Site loads at your Vercel URL
- ✅ Contact form sends emails
- ✅ Rate limiting works (4th request blocked)
- ✅ PDF exports correctly
- ✅ Animations are smooth
- ✅ Both languages work
- ✅ Theme toggle persists
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Lighthouse score 90+

Congratulations! Your CV is now live! 🎉

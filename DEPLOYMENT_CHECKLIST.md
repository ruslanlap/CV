# Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

### Code Quality
- [x] All TypeScript errors resolved
- [x] Build completes successfully (`npm run build`)
- [x] No console errors in development
- [x] All features tested locally

### Environment Variables
- [x] `RESEND_API_KEY` - Contact form email service
- [x] `CONTACT_EMAIL_TO` - Email recipient address
- [x] `UPSTASH_REDIS_REST_URL` - Rate limiting database
- [x] `UPSTASH_REDIS_REST_TOKEN` - Rate limiting auth
- [ ] `GITHUB_TOKEN` - Optional, for GitHub stats
- [x] `FIREWORKS_API_KEY` - Optional, for AI features

### Documentation
- [x] README.md updated with new features
- [x] SETUP.md includes setup instructions
- [x] ACCESSIBILITY.md documents accessibility features
- [x] DEPLOYMENT.md provides deployment guide

## Deployment Steps

### Option A: Vercel Dashboard
- [ ] Push code to GitHub
- [ ] Import repository to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Verify deployment URL

### Option B: Vercel CLI
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Add environment variables: `vercel env add [VAR_NAME]`
- [ ] Deploy: `vercel --prod`

## Post-Deployment Testing

### Contact Form
- [ ] Navigate to contact section
- [ ] Fill out form with test data
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check email received at `CONTACT_EMAIL_TO`
- [ ] Verify reply-to is set correctly
- [ ] Test rate limiting (4th submission should fail)

### PDF Export
- [ ] Click PDF button in header
- [ ] Verify PDF opens in new tab
- [ ] Check all sections are present
- [ ] Verify links are clickable
- [ ] Check formatting and typography
- [ ] Test in both EN and UA languages

### Animations
- [ ] Scroll through entire page
- [ ] Verify smooth fade-in animations
- [ ] Check stagger effects on cards
- [ ] Test performance (should be 60fps)
- [ ] Verify reduced motion preference is respected

### Languages
- [ ] Test `/en` route
- [ ] Test `/ua` route
- [ ] Verify all content translates
- [ ] Check contact form labels
- [ ] Test PDF export in both languages

### Theme Toggle
- [ ] Toggle between light and dark themes
- [ ] Verify colors change correctly
- [ ] Check theme persists on reload
- [ ] Test in both languages

### Responsive Design
- [ ] Test on mobile (375px - iPhone SE)
- [ ] Test on tablet (768px - iPad)
- [ ] Test on desktop (1920px+)
- [ ] Verify contact form is usable on mobile
- [ ] Check navigation menu on mobile
- [ ] Verify no horizontal scroll

### Accessibility
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Verify skip to main content link works
- [ ] Check focus indicators are visible
- [ ] Test with screen reader (optional)
- [ ] Verify color contrast is sufficient

### Performance
- [ ] Run Lighthouse audit (target 90+ score)
- [ ] Check Core Web Vitals
- [ ] Verify images load quickly
- [ ] Check bundle size is reasonable
- [ ] Test on slow 3G connection

## Monitoring Setup

### Vercel Dashboard
- [ ] Enable Analytics
- [ ] Set up error notifications
- [ ] Review deployment logs

### Resend Dashboard
- [ ] Check email delivery logs
- [ ] Verify domain (if using custom domain)
- [ ] Monitor usage limits

### Upstash Console
- [ ] Check Redis metrics
- [ ] Monitor rate limit hits
- [ ] Verify database is active

## Rollback Plan

If issues occur:
- [ ] Know how to rollback via Vercel dashboard
- [ ] Have previous working deployment URL
- [ ] Can quickly disable features if needed

## Success Criteria

Deployment is successful when:
- [x] Build completes without errors
- [ ] Site loads at Vercel URL
- [ ] Contact form sends emails
- [ ] Rate limiting works (4th request blocked)
- [ ] PDF exports correctly in both languages
- [ ] Animations are smooth (60fps)
- [ ] Both EN and UA languages work
- [ ] Theme toggle persists
- [ ] Mobile responsive on all devices
- [ ] No console errors
- [ ] Lighthouse score 90+
- [ ] All accessibility features work

## Notes

**Current Status**: Ready for deployment ✅

**Environment Variables Set**:
- ✅ RESEND_API_KEY
- ✅ CONTACT_EMAIL_TO
- ✅ UPSTASH_REDIS_REST_URL
- ✅ UPSTASH_REDIS_REST_TOKEN
- ✅ FIREWORKS_API_KEY
- ⚠️ GITHUB_TOKEN (optional, not set)

**Next Steps**:
1. Push to GitHub
2. Deploy via Vercel Dashboard or CLI
3. Add environment variables to Vercel
4. Test all features in production
5. Monitor for 24 hours

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Vercel URL**: _____________

**Status**: ⬜ Success ⬜ Issues ⬜ Rollback Required

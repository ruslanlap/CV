# Implementation Plan: CV Enhancements

## Overview

This implementation plan breaks down the CV enhancements into discrete, manageable tasks. The approach follows an incremental strategy: set up infrastructure first, then implement each feature (contact form, PDF export, animations) with testing, and finally integrate everything together.

## Current Status

✅ **Completed:**
- All dependencies installed (@react-pdf/renderer, resend, zod, @upstash/ratelimit, @upstash/redis, fast-check)
- Type definitions created (contact.ts, pdf.ts, animation.ts)
- Environment variables template created
- Basic PDF page exists at `/cv/pdf` (needs enhancement with @react-pdf/renderer)
- Framer Motion set up with basic animations in CVView

🔨 **To Do:**
- Contact form implementation
- Enhanced PDF export with @react-pdf/renderer
- Scroll-triggered animations system
- Property-based testing

## Tasks

- [x] 1. Project setup and dependencies
  - Install required packages: @react-pdf/renderer, resend, zod, @upstash/ratelimit, @upstash/redis, fast-check
  - Set up environment variables for Resend API and Upstash Redis
  - Create type definitions for contact form and PDF data
  - _Requirements: 4.9_

- [ ] 2. Contact Form - Core Implementation
  - [x] 2.1 Create Zod validation schema
    - Create src/lib/validation/contact-schema.ts
    - Define validation rules for name (2-100 chars), email (valid format), subject (3-200 chars), message (10-2000 chars)
    - Export schema and type inference
    - _Requirements: 1.3, 1.4, 1.7_

  - [x] 2.2 Create ContactForm component with form fields
    - Create src/components/ContactForm.tsx
    - Implement form UI with name, email, subject, message fields
    - Add Tailwind CSS styling matching Catppuccin theme
    - Implement responsive layout for mobile/desktop
    - Add proper ARIA labels and accessibility attributes
    - _Requirements: 1.1, 4.1, 4.5_

  - [x] 2.3 Implement form validation and state management
    - Add real-time validation with debouncing (300ms)
    - Display field-specific error messages inline
    - Implement loading state during submission
    - Disable submit button when submitting
    - Reset form after successful submission
    - Add success/error toast notifications
    - _Requirements: 1.3, 1.4, 1.6, 1.7, 1.8_

  - [ ] 2.4 Write property test for form validation
    - **Property 1: Form validation completeness**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.7**

  - [x] 2.5 Add bilingual support to form
    - Create translation objects for EN and UA in component
    - Implement language-specific labels, placeholders, and messages
    - Add language prop to component
    - _Requirements: 1.10_

  - [ ]* 2.6 Write property test for language-specific content
    - **Property 4: Language-specific content**
    - **Validates: Requirements 1.10**

- [ ] 3. Contact Form - API and Email Integration
  - [x] 3.1 Create rate limiting utility
    - Create src/lib/rate-limit.ts
    - Set up Upstash Redis/KV connection
    - Configure rate limiter (3 requests per hour per IP)
    - Export rate limit function
    - _Requirements: 1.9_

  - [x] 3.2 Create email template utility
    - Create src/lib/email-templates.ts
    - Implement HTML email template function
    - Implement plain text fallback function
    - Include visitor info and message content
    - _Requirements: 1.2, 1.5_

  - [x] 3.3 Create API route for contact form
    - Create src/app/api/contact/route.ts
    - Implement POST endpoint with request validation
    - Integrate rate limiting
    - Integrate Resend email service
    - Add error handling and response formatting
    - Set reply-to header with visitor's email
    - _Requirements: 1.2, 1.5, 1.9, 4.8_

  - [ ]* 3.4 Write property test for rate limiting
    - **Property 5: Rate limiting enforcement**
    - **Validates: Requirements 1.9**

  - [ ] 3.5 Write unit tests for email template
    - Test HTML email generation
    - Test plain text fallback
    - Test email metadata (from, to, reply-to)
    - _Requirements: 1.2_

  - [x] 3.6 Connect form to API endpoint
    - Implement form submission handler in ContactForm
    - Handle API responses (success/error)
    - Display appropriate feedback to user
    - Handle network errors gracefully
    - _Requirements: 1.2, 1.5, 4.7_

  - [ ]* 3.7 Write integration test for contact form flow
    - Test complete submission flow
    - Test error scenarios
    - Test success feedback
    - _Requirements: 1.2, 1.5_

- [ ] 4. Checkpoint - Contact Form Complete
  - Ensure all contact form tests pass
  - Verify form works in both EN and UA languages
  - Test rate limiting functionality
  - Manually test email delivery
  - Ask the user if questions arise

- [ ] 5. PDF Export - Document Structure with @react-pdf/renderer
  - [x] 5.1 Create PDF styles utility
    - Create src/lib/pdf-styles.ts
    - Define StyleSheet matching Catppuccin theme
    - Set typography (fonts, sizes, weights)
    - Define spacing, margins, and layout constants
    - Optimize colors for print
    - _Requirements: 2.3, 2.4, 2.6, 4.1_

  - [x] 5.2 Create PDFDocument component
    - Create src/components/PDFDocument.tsx
    - Set up @react-pdf/renderer Document structure
    - Create page layout with proper margins (2.5cm)
    - Add PDF metadata (title, author, subject, keywords, creation date)
    - _Requirements: 2.1, 2.7_

  - [ ]* 5.3 Write property test for PDF metadata
    - **Property 8: PDF metadata completeness**
    - **Validates: Requirements 2.7**

  - [x] 5.4 Implement PDF header section
    - Render name, role, location in header
    - Include profile photo with proper resolution
    - Add contact information (email, phone, telegram)
    - Apply proper styling and spacing
    - _Requirements: 2.1, 2.11_

  - [ ]* 5.5 Write property test for PDF image rendering
    - **Property 11: PDF image rendering**
    - **Validates: Requirements 2.11**

- [ ] 6. PDF Export - Content Sections
  - [x] 6.1 Implement Summary and Skills sections
    - Render summary text with proper formatting
    - Create skill groups with proper layout
    - Apply proper spacing between sections
    - _Requirements: 2.1, 2.4_

  - [x] 6.2 Implement Experience section
    - Render job entries with company, role, period
    - Format bullet points correctly
    - Handle page breaks intelligently (wrap="false" on job entries)
    - _Requirements: 2.1, 2.2_

  - [x] 6.3 Implement Projects section
    - Render project entries with name, description
    - Add clickable links with proper styling
    - Include tech stack information
    - _Requirements: 2.1, 2.5_

  - [ ]* 6.4 Write property test for PDF link functionality
    - **Property 7: PDF link functionality**
    - **Validates: Requirements 2.5**

  - [x] 6.5 Implement Education, Languages, and Hobbies sections
    - Render courses with names and dates
    - Display languages with proficiency levels
    - List hobbies with proper formatting
    - _Requirements: 2.1_

  - [ ]* 6.6 Write property test for PDF structure integrity
    - **Property 6: PDF structure integrity**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ] 9. Scroll Animations - Infrastructure
  - [ ] 9.1 Create animation variants library
    - Create src/lib/animation-variants.ts
    - Define fadeInUp variant (opacity 0→1, y 20→0)
    - Define fadeIn variant (opacity 0→1)
    - Define scaleIn variant (opacity 0→1, scale 0.95→1)
    - Define staggerContainer variant with staggerChildren
    - Add timing and easing configurations
    - _Requirements: 3.2_

  - [ ] 9.2 Create useReducedMotion hook
    - Create src/hooks/useReducedMotion.ts
    - Detect prefers-reduced-motion media query
    - Return boolean for motion preference
    - Handle SSR safely
    - _Requirements: 3.5_

  - [ ]* 9.3 Write property test for reduced motion accessibility
    - **Property 13: Reduced motion accessibility**
    - **Validates: Requirements 3.5**

  - [ ] 9.4 Create useScrollAnimation hook
    - Create src/hooks/useScrollAnimation.ts
    - Implement Intersection Observer setup
    - Add threshold and rootMargin options
    - Track element visibility state (isInView, hasBeenInView)
    - Implement triggerOnce option
    - Handle cleanup on unmount
    - _Requirements: 3.1, 3.7_

  - [ ] 9.5 Create AnimatedSection wrapper component
    - Create src/components/AnimatedSection.tsx
    - Accept animation variant as prop
    - Use useScrollAnimation hook
    - Apply Framer Motion animations
    - Handle reduced motion preference (disable animations)
    - _Requirements: 3.1, 3.2, 3.5, 4.3_

  - [ ]* 9.6 Write property test for animation state management
    - **Property 14: Animation state management**
    - **Validates: Requirements 3.6, 3.7**

- [ ] 10. Scroll Animations - Application
  - [ ] 10.1 Update CVView to use animation variants
    - Import animation variants from lib
    - Replace inline variants with imported ones
    - Ensure consistency across all animated elements
    - _Requirements: 3.1, 3.2_

  - [ ] 10.2 Add animations to hero section (Header)
    - Update src/components/Header.tsx
    - Animate header on page load (immediate, no scroll trigger)
    - Add fade-in for profile image
    - Animate name and role text
    - _Requirements: 3.8_

  - [ ] 10.3 Wrap section headers with AnimatedSection
    - Update Section component or wrap in CVView
    - Use fadeIn variant for section titles
    - Trigger when entering viewport
    - _Requirements: 3.1_

  - [ ] 10.4 Enhance Experience cards animations
    - Already using motion.div in CVView
    - Ensure fadeInUp variant is applied
    - Verify stagger effect works correctly
    - _Requirements: 3.10_

  - [ ] 10.5 Enhance Skills section animations
    - Already using motion.div in CVView
    - Consider adding scaleIn for individual badges
    - Verify stagger effect on skill groups
    - _Requirements: 3.9_

  - [ ] 10.6 Enhance Projects section animations
    - Already using motion.div in CVView
    - Ensure fadeInUp variant is applied
    - Verify stagger delay between cards
    - _Requirements: 3.10_

  - [ ] 10.7 Add animation to sticky navigation
    - Update src/components/Navigation.tsx
    - Detect when navigation becomes sticky
    - Add smooth transition animation (slide-down or fade)
    - _Requirements: 3.11_

  - [ ]* 10.8 Write property test for animation triggering and sequencing
    - **Property 12: Animation triggering and sequencing**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [ ]* 10.9 Write property test for Framer Motion integration
    - **Property 16: Framer Motion integration**
    - **Validates: Requirements 4.3**

- [ ] 11. Checkpoint - Animations Complete
  - Ensure all animation tests pass
  - Verify animations trigger correctly on scroll
  - Test reduced motion preference
  - Check animation performance (60fps)
  - Test on mobile and desktop
  - Ask the user if questions arise

- [ ] 12. Integration and Polish
  - [x] 12.1 Add contact form to CV layout
    - Update src/app/en/page.tsx and src/app/ua/page.tsx
    - Create new section for contact form after AI Assistant
    - Add Section wrapper with proper ID
    - Pass language prop to ContactForm
    - _Requirements: 4.4_

  - [x] 12.2 Update Navigation component
    - Add "Contact" link to SECTIONS array in src/components/Navigation.tsx
    - Use appropriate icon (LuMail or LuMessageSquare)
    - Ensure smooth scroll to contact form works
    - Update both EN and UA labels
    - _Requirements: 4.4_

  - [x] 12.3 Add PDF export button to Header
    - Update src/components/Header.tsx
    - Add PDFExportButton to children area
    - Pass cv and lang props
    - Ensure responsive positioning
    - _Requirements: 4.4, 4.5_

  - [ ] 12.4 Implement comprehensive error handling
    - Add error boundaries for contact form
    - Add error boundaries for PDF generation
    - Implement graceful degradation for animations
    - Add user-friendly error messages
    - Log errors to console for debugging
    - _Requirements: 4.7_

  - [ ]* 12.5 Write property test for error handling
    - **Property 19: Error handling**
    - **Validates: Requirements 4.7**

  - [ ] 12.6 Verify theme consistency
    - Audit all new components for Catppuccin theme usage
    - Check color variables are used correctly (text, subtext, accent, surface, etc.)
    - Verify dark/light mode support
    - Test theme toggle with new features
    - _Requirements: 4.1_

  - [ ]* 12.7 Write property test for theme consistency
    - **Property 15: Theme consistency**
    - **Validates: Requirements 4.1_

  - [ ] 12.8 Test responsive design
    - Test contact form on mobile (320px-767px)
    - Test PDF export button on mobile
    - Test animations on tablet (768px-1023px)
    - Test all features on desktop (1024px+)
    - Fix any layout issues
    - _Requirements: 4.5_

  - [ ]* 12.9 Write property test for responsive design
    - **Property 17: Responsive design**
    - **Validates: Requirements 4.5**

- [ ] 13. Final Testing and Deployment
  - [ ]* 13.1 Run all property-based tests
    - Execute all property tests with 100 iterations
    - Fix any failing tests
    - Verify all properties pass

  - [ ]* 13.2 Run integration tests
    - Test complete user flows
    - Test error scenarios
    - Test language switching across features

  - [ ] 13.3 Performance optimization
    - Check bundle size impact (use next build and analyze)
    - Optimize images if needed
    - Lazy load ContactForm if below fold
    - Verify 60fps animation performance
    - _Requirements: 3.12_

  - [ ] 13.4 Accessibility audit
    - Test keyboard navigation on contact form
    - Verify screen reader compatibility
    - Check color contrast ratios (WCAG AA)
    - Test with reduced motion enabled
    - Test focus management
    - _Requirements: 3.5_

  - [ ] 13.5 Cross-browser testing
    - Test in Chrome, Firefox, Safari, Edge
    - Verify PDF export works in all browsers
    - Check animation performance across browsers
    - Test contact form submission
    - Verify email delivery

  - [ ] 13.6 Update documentation
    - Update README.md with new features
    - Document environment variables in SETUP.md
    - Add setup instructions for Resend API key
    - Add setup instructions for Upstash Redis/KV
    - Document API endpoints
    - _Requirements: 4.9_

  - [ ] 13.7 Deploy to Vercel
    - Set up environment variables in Vercel dashboard
    - Deploy and test in production
    - Verify all features work correctly
    - Monitor for errors in Vercel logs
    - Test email delivery from production
    - _Requirements: 4.10_

- [ ] 14. Final Checkpoint
  - Ensure all tests pass
  - Verify all features work in production
  - Confirm no console errors or warnings
  - Test complete user journey (view CV → contact → PDF export)
  - Get user approval for completion

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end functionality
- The implementation follows a logical progression: infrastructure → features → integration → deployment
- Existing animations in CVView can be enhanced rather than rewritten from scratch
- The current PDF page at `/cv/pdf` should be replaced with the new @react-pdf/renderer implementation

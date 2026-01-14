# Design Document: CV Enhancements

## Overview

This design document outlines the implementation approach for three major enhancements to the CV website: a contact form with email integration, an improved PDF export system, and scroll-triggered animations. The implementation will leverage existing technologies (Next.js, React, Framer Motion, Tailwind CSS) while introducing new libraries for PDF generation and email services.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CV Website                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Contact    │  │     PDF      │  │  Animation   │      │
│  │     Form     │  │   Generator  │  │    Engine    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Route   │  │  react-pdf   │  │Framer Motion │      │
│  │  /api/contact│  │   Renderer   │  │  + Observers │      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │Email Service │                                           │
│  │   (Resend)   │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **UI Library**: React 18+
- **Animation**: Framer Motion (existing)
- **Styling**: Tailwind CSS with Catppuccin theme (existing)
- **PDF Generation**: @react-pdf/renderer
- **Email Service**: Resend API
- **Form Validation**: Zod
- **Rate Limiting**: @upstash/ratelimit with Vercel KV
- **Scroll Detection**: Intersection Observer API

## Components and Interfaces

### 1. Contact Form Component

**Component Structure:**

```typescript
// src/components/ContactForm.tsx
interface ContactFormProps {
  lang: "en" | "ua";
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

interface FormState {
  data: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
}
```

**Key Features:**
- Real-time validation using Zod schema
- Debounced input validation (300ms)
- Loading states with disabled submit button
- Success/error toast notifications
- Automatic form reset after successful submission
- Bilingual labels and error messages
- Accessible form with proper ARIA labels

**Validation Schema:**

```typescript
const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});
```

### 2. API Route for Contact Form

**Endpoint:** `/api/contact`

```typescript
// src/app/api/contact/route.ts
interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

**Security Measures:**
- Rate limiting: 3 requests per hour per IP
- Input sanitization
- CORS headers
- Request validation with Zod
- Email service error handling

**Rate Limiting Implementation:**

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});
```

### 3. PDF Generator Component

**Component Structure:**

```typescript
// src/components/PDFDocument.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface PDFDocumentProps {
  cv: CV;
  lang: "en" | "ua";
}
```

**PDF Structure:**
- Page 1: Header, Summary, Skills, Experience (part 1)
- Page 2: Experience (part 2), Projects (part 1)
- Page 3: Projects (part 2), Education, Languages, Hobbies

**Styling Approach:**
- Custom stylesheet matching Catppuccin theme
- Professional typography (Inter font family)
- Proper spacing and margins (2.5cm margins)
- Print-optimized colors (darker text, lighter backgrounds)
- Clickable links with underline styling

**PDF Metadata:**

```typescript
const metadata = {
  title: `${cv.name} - CV`,
  author: cv.name,
  subject: "Curriculum Vitae",
  keywords: "cv, resume, developer",
  creator: "CV Website",
  producer: "React-PDF",
};
```

### 4. PDF Export Button Component

```typescript
// src/components/PDFExportButton.tsx
interface PDFExportButtonProps {
  cv: CV;
  lang: "en" | "ua";
}
```

**Features:**
- Loading state during PDF generation
- Progress indicator
- Automatic download trigger
- Filename format: `{name}_CV_{lang}_{date}.pdf`
- Error handling with user feedback

### 5. Scroll Animation System

**Animation Hook:**

```typescript
// src/hooks/useScrollAnimation.ts
interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn {
  ref: RefObject<HTMLElement>;
  isInView: boolean;
  hasBeenInView: boolean;
}
```

**Animation Variants:**

```typescript
// src/lib/animation-variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};
```

**Reduced Motion Support:**

```typescript
const prefersReducedMotion = useReducedMotion();

const variants = prefersReducedMotion 
  ? { hidden: {}, visible: {} }  // No animation
  : fadeInUp;  // Normal animation
```

**Animation Application Strategy:**
- Hero section: Immediate animation on mount
- Section headers: Fade in when entering viewport
- Cards (Experience, Skills, Projects): Staggered fade-up
- Badges: Subtle scale-in with stagger
- Navigation: Smooth slide-down when becoming sticky

## Data Models

### Contact Form Data

```typescript
interface ContactFormData {
  name: string;          // 2-100 characters
  email: string;         // Valid email format
  subject: string;       // 3-200 characters
  message: string;       // 10-2000 characters
  timestamp: Date;       // Submission time
  language: "en" | "ua"; // Form language
}
```

### Email Template Data

```typescript
interface EmailData {
  from: string;          // Sender email
  to: string;            // Recipient (CV owner)
  subject: string;       // Email subject
  replyTo: string;       // Visitor's email
  html: string;          // HTML email body
  text: string;          // Plain text fallback
}
```

### PDF Generation Data

```typescript
interface PDFData {
  cv: CV;                // Full CV data
  lang: "en" | "ua";     // Language selection
  generatedAt: Date;     // Generation timestamp
  metadata: PDFMetadata; // PDF metadata
}

interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: Date;
}
```

### Animation State

```typescript
interface AnimationState {
  elementId: string;
  isInView: boolean;
  hasBeenInView: boolean;
  animationComplete: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Contact Form Properties

**Property 1: Form validation completeness**
*For any* form submission attempt, all required fields (name, email, subject, message) should be validated, and submission should only proceed if all validations pass.
**Validates: Requirements 1.2, 1.3, 1.4, 1.7**

**Property 2: Form state management**
*For any* successful form submission, the form should transition through states (submitting → success) correctly, disable the submit button during submission, and reset to initial state after success.
**Validates: Requirements 1.6, 1.8**

**Property 3: Email format validation**
*For any* string entered in the email field, the validation should correctly identify valid and invalid email formats according to RFC 5322 standards.
**Validates: Requirements 1.7**

**Property 4: Language-specific content**
*For any* language selection (EN or UA), all form labels, placeholders, validation messages, and success/error messages should display in the selected language.
**Validates: Requirements 1.10**

**Property 5: Rate limiting enforcement**
*For any* IP address, the system should enforce the rate limit (3 requests per hour) and reject additional requests with appropriate error messages.
**Validates: Requirements 1.9**

### PDF Export Properties

**Property 6: PDF structure integrity**
*For any* CV data, the generated PDF should include all sections (header, summary, skills, experience, projects, education, languages, hobbies) with proper page breaks, typography, spacing, and margins.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Property 7: PDF link functionality**
*For any* link in the CV data (project links, GitHub, email, etc.), the generated PDF should render it as a clickable hyperlink with visual distinction (underline or color).
**Validates: Requirements 2.5**

**Property 8: PDF metadata completeness**
*For any* generated PDF, the document metadata should include title, author, subject, keywords, creator, producer, and creation date fields.
**Validates: Requirements 2.7**

**Property 9: PDF language consistency**
*For any* language selection, the generated PDF content should match the selected language, including all section headers, labels, and text content.
**Validates: Requirements 2.8**

**Property 10: PDF download behavior**
*For any* successful PDF generation, the system should automatically trigger a download with a filename in the format `{name}_CV_{lang}_{date}.pdf`.
**Validates: Requirements 2.10**

**Property 11: PDF image rendering**
*For any* CV with a profile photo, the generated PDF should include the image with appropriate resolution (minimum 150 DPI) and positioning.
**Validates: Requirements 2.11**

### Animation Properties

**Property 12: Animation triggering and sequencing**
*For any* section with multiple elements, when the section enters the viewport, animations should trigger with appropriate timing, easing, and stagger delays for visual flow.
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 13: Reduced motion accessibility**
*For any* user with `prefers-reduced-motion: reduce` set, all animations should be disabled or reduced to simple opacity transitions.
**Validates: Requirements 3.5**

**Property 14: Animation state management**
*For any* element, animations should trigger immediately if visible on page load, and should not re-trigger when scrolling back to already-viewed content.
**Validates: Requirements 3.6, 3.7**

### Integration Properties

**Property 15: Theme consistency**
*For any* new component (contact form, PDF export button), the styling should use Catppuccin theme variables and match the existing design system.
**Validates: Requirements 4.1**

**Property 16: Framer Motion integration**
*For any* new animation, it should use Framer Motion's motion components and variants, consistent with existing animation patterns.
**Validates: Requirements 4.3**

**Property 17: Responsive design**
*For any* viewport size (mobile: 320px-767px, tablet: 768px-1023px, desktop: 1024px+), all new features should render correctly and maintain usability.
**Validates: Requirements 4.5**

**Property 18: Data source consistency**
*For any* CV data, the PDF export should use the same data source (cv.en.ts or cv.ua.ts) as the web view, ensuring content parity.
**Validates: Requirements 4.6**

**Property 19: Error handling**
*For any* error condition (network failure, validation error, API error), the system should handle it gracefully, display user-friendly messages, and maintain page functionality.
**Validates: Requirements 4.7**

## Error Handling

### Contact Form Errors

1. **Validation Errors**
   - Display field-specific errors inline
   - Highlight invalid fields with red border
   - Show error icon next to field
   - Prevent form submission

2. **Network Errors**
   - Display toast notification with retry option
   - Keep form data intact
   - Log error to console for debugging
   - Suggest checking internet connection

3. **Rate Limit Errors**
   - Display friendly message explaining rate limit
   - Show time until next allowed request
   - Suggest alternative contact methods (email, LinkedIn)

4. **Email Service Errors**
   - Display generic error message to user
   - Log detailed error server-side
   - Send notification to admin
   - Provide fallback contact information

### PDF Export Errors

1. **Generation Errors**
   - Display error toast with retry button
   - Log error details to console
   - Fallback to browser print dialog
   - Provide manual download link if possible

2. **Download Errors**
   - Retry download automatically (once)
   - Display error message with manual retry option
   - Suggest alternative browsers if persistent

### Animation Errors

1. **Performance Issues**
   - Detect low frame rates
   - Automatically disable complex animations
   - Fall back to simple transitions
   - Respect reduced motion preferences

2. **Intersection Observer Errors**
   - Gracefully degrade to no animations
   - Log error for debugging
   - Ensure content remains visible and accessible

## Testing Strategy

### Unit Testing

**Contact Form:**
- Test form validation logic with various inputs
- Test form state transitions
- Test error message display
- Test language switching
- Test form reset after submission

**PDF Generator:**
- Test PDF structure with mock CV data
- Test metadata generation
- Test link rendering
- Test image inclusion
- Test language-specific content

**Animation System:**
- Test animation variant generation
- Test reduced motion detection
- Test animation state management
- Test intersection observer setup

### Property-Based Testing

We will use **fast-check** (JavaScript property-based testing library) for comprehensive testing. Each property test will run a minimum of 100 iterations.

**Property Test Configuration:**

```typescript
import fc from "fast-check";

// Run each property test 100 times
const testConfig = { numRuns: 100 };
```

**Test Tags:**
Each property test will include a comment tag referencing the design property:
```typescript
// Feature: cv-enhancements, Property 1: Form validation completeness
```

**Key Property Tests:**

1. **Form Validation** (Property 1)
   - Generate random form data (valid and invalid)
   - Verify validation logic correctly identifies issues
   - Ensure submission only proceeds with valid data

2. **Email Format Validation** (Property 3)
   - Generate random email strings
   - Verify correct identification of valid/invalid formats
   - Test edge cases (special characters, internationalized domains)

3. **PDF Structure** (Property 6)
   - Generate random CV data
   - Verify all sections present in PDF
   - Check page breaks don't split sections awkwardly

4. **Language Consistency** (Property 4, 9)
   - Test both EN and UA languages
   - Verify all text content matches selected language
   - Check no mixed-language content

5. **Animation Triggering** (Property 12)
   - Simulate various scroll positions
   - Verify animations trigger at correct thresholds
   - Test stagger timing is consistent

6. **Responsive Design** (Property 17)
   - Test various viewport sizes
   - Verify layout adapts correctly
   - Check no horizontal overflow

### Integration Testing

- Test complete contact form submission flow
- Test PDF generation and download flow
- Test animations across different sections
- Test language switching affects all features
- Test error scenarios end-to-end

### Manual Testing Checklist

- [ ] Contact form displays correctly on all screen sizes
- [ ] Form validation provides helpful error messages
- [ ] Email successfully sends and arrives
- [ ] Rate limiting prevents spam
- [ ] PDF exports with correct formatting
- [ ] PDF links are clickable
- [ ] PDF matches web content
- [ ] Animations trigger smoothly on scroll
- [ ] Reduced motion preference is respected
- [ ] All features work in both EN and UA languages
- [ ] Theme consistency maintained across new features
- [ ] No console errors or warnings
- [ ] Performance remains smooth (60fps)

## Implementation Notes

### Environment Variables

```env
# Resend API
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL_TO=ruslan.lapinyak@gmail.com

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

### Dependencies to Add

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^3.1.14",
    "resend": "^3.0.0",
    "zod": "^3.22.4",
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.25.0"
  },
  "devDependencies": {
    "fast-check": "^3.15.0",
    "@types/react-pdf": "^7.0.0"
  }
}
```

### File Structure

```
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts          # Contact form API endpoint
├── components/
│   ├── ContactForm.tsx           # Contact form component
│   ├── PDFDocument.tsx           # PDF template component
│   ├── PDFExportButton.tsx       # PDF export button
│   └── AnimatedSection.tsx       # Reusable animated wrapper
├── hooks/
│   ├── useScrollAnimation.ts     # Scroll animation hook
│   └── useReducedMotion.ts       # Reduced motion detection
├── lib/
│   ├── animation-variants.ts     # Animation variant definitions
│   ├── email-templates.ts        # Email HTML templates
│   ├── pdf-styles.ts             # PDF stylesheet
│   └── rate-limit.ts             # Rate limiting configuration
└── types/
    └── contact.ts                # Contact form types
```

### Performance Considerations

1. **Contact Form**
   - Debounce validation (300ms)
   - Lazy load CAPTCHA if needed
   - Optimize bundle size

2. **PDF Export**
   - Generate PDF client-side to reduce server load
   - Show progress indicator for large CVs
   - Cache font files

3. **Animations**
   - Use CSS transforms (GPU-accelerated)
   - Implement will-change hints
   - Lazy load animation library
   - Disable animations on low-end devices
   - Use requestAnimationFrame for smooth performance

### Accessibility Considerations

1. **Contact Form**
   - Proper label associations
   - ARIA error messages
   - Keyboard navigation
   - Focus management
   - Screen reader announcements

2. **PDF Export**
   - Accessible button with clear label
   - Loading state announcement
   - Success/error feedback

3. **Animations**
   - Respect prefers-reduced-motion
   - Ensure content readable without animations
   - No flashing or rapid movements
   - Maintain focus visibility during animations

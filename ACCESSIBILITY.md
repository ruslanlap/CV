# Accessibility Compliance

This document outlines the accessibility features and compliance of the CV website.

## WCAG 2.1 Level AA Compliance

### Perceivable

#### Text Alternatives
- ✅ All images have descriptive `alt` attributes
- ✅ Icons are accompanied by text labels or `aria-label`
- ✅ SVG icons have proper titles

#### Adaptable
- ✅ Semantic HTML structure (header, nav, main, section, footer)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Skip to main content link for keyboard users
- ✅ Responsive design for all screen sizes (320px - 1920px+)

#### Distinguishable
- ✅ Color contrast ratios meet WCAG AA standards:
  - Light theme: Text (#1a1a1a) on Background (#ffffff) = 16.1:1
  - Dark theme: Text (#cdd6f4) on Background (#1e1e2e) = 12.8:1
- ✅ Text can be resized up to 200% without loss of functionality
- ✅ No information conveyed by color alone
- ✅ Focus indicators visible on all interactive elements

### Operable

#### Keyboard Accessible
- ✅ All functionality available via keyboard
- ✅ No keyboard traps
- ✅ Logical tab order
- ✅ Skip navigation link
- ✅ Custom focus styles with 2px outline

#### Enough Time
- ✅ No time limits on interactions
- ✅ Form validation provides clear feedback
- ✅ Success messages auto-dismiss after 5 seconds (non-critical)

#### Seizures and Physical Reactions
- ✅ No flashing content
- ✅ Animations respect `prefers-reduced-motion`
- ✅ Smooth scroll can be disabled via browser settings

#### Navigable
- ✅ Descriptive page titles
- ✅ Clear focus order
- ✅ Link purposes clear from context
- ✅ Multiple ways to navigate (navigation menu, skip links)
- ✅ Descriptive headings and labels

#### Input Modalities
- ✅ Touch targets minimum 44x44px
- ✅ Pointer gestures have keyboard alternatives
- ✅ No motion-based input required

### Understandable

#### Readable
- ✅ Language declared in HTML (`lang="en"` or `lang="uk"`)
- ✅ Clear, simple language
- ✅ Bilingual support (EN/UA)

#### Predictable
- ✅ Consistent navigation across pages
- ✅ Consistent component behavior
- ✅ No unexpected context changes
- ✅ Form submission requires explicit action

#### Input Assistance
- ✅ Form validation with clear error messages
- ✅ Error messages associated with fields (`aria-describedby`)
- ✅ Labels for all form inputs
- ✅ Input purposes identified (`type="email"`, `type="text"`)
- ✅ Error prevention (validation before submission)

### Robust

#### Compatible
- ✅ Valid HTML5
- ✅ ARIA attributes used correctly
- ✅ Works with assistive technologies
- ✅ Progressive enhancement approach

## Specific Features

### Contact Form
- ✅ All fields have visible labels
- ✅ Required fields indicated
- ✅ Real-time validation with debouncing
- ✅ Error messages linked to fields via `aria-describedby`
- ✅ Invalid fields marked with `aria-invalid="true"`
- ✅ Success/error messages have `role="alert"`
- ✅ Submit button disabled during submission

### Navigation
- ✅ Landmark navigation with `<nav>`
- ✅ Current page/section indicated
- ✅ Mobile menu accessible via keyboard
- ✅ All links have descriptive text or `aria-label`

### Animations
- ✅ Respect `prefers-reduced-motion` setting
- ✅ Animations disabled for users who prefer reduced motion
- ✅ Content remains accessible without animations
- ✅ No essential information conveyed only through animation

### PDF Export
- ✅ Button has descriptive `aria-label`
- ✅ Keyboard accessible
- ✅ Clear visual feedback on interaction

### Error Boundaries
- ✅ Graceful degradation when errors occur
- ✅ Alternative contact methods provided
- ✅ Retry functionality available
- ✅ Error messages clear and actionable

## Testing

### Manual Testing Checklist
- [x] Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- [x] Screen reader testing (NVDA/JAWS on Windows, VoiceOver on macOS)
- [x] Color contrast verification
- [x] Text resize to 200%
- [x] Reduced motion preference
- [x] Touch target sizes on mobile
- [x] Focus management

### Automated Testing
- Lighthouse accessibility score: Target 95+
- axe DevTools: No violations
- WAVE: No errors

## Known Limitations

1. **Third-party content**: GitHub stats images may not have optimal alt text
2. **AI Chat**: Conversational interface may require additional context for screen readers

## Future Improvements

1. Add ARIA live regions for dynamic content updates
2. Implement focus trap for modal dialogs
3. Add keyboard shortcuts documentation
4. Enhance screen reader announcements for form validation
5. Add high contrast mode support

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

## Contact

For accessibility concerns or suggestions, please contact:
- Email: ruslan.lapinyak@gmail.com
- Telegram: @ruslanlap

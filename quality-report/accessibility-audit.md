# Accessibility (a11y) Audit

**Overall Grade: C+**

## Summary

The application has basic accessibility features in place (proper form labels, semantic HTML in some areas) but is missing several critical accessibility features. There are no ARIA attributes, limited keyboard navigation considerations, and missing screen reader support for dynamic content.

---

## What's Working

### 1. Form Label Associations
All form inputs have proper `htmlFor`/`id` associations:

```typescript
// /app/components/ui.tsx
<label htmlFor={inputId} className="block text-sm font-medium text-foreground">
  {label}
</label>
<input ref={ref} id={inputId} ... />
```

**Grade: A**

### 2. Focus Styles
The components include focus ring styles:

```typescript
'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
```

**Grade: B** (visible focus, but could be more prominent)

### 3. Semantic Language Declaration
```typescript
// /app/layout.tsx
<html lang="en">
```

**Grade: A**

### 4. Button Disabled States
Buttons properly communicate disabled state:

```typescript
'disabled:opacity-50 disabled:cursor-not-allowed'
```

**Grade: B** (visual indicator present)

---

## Critical Issues

### 1. No ARIA Attributes
**Severity:** High
**Search Results:** 0 matches for `aria-` or `role=`

Missing attributes include:
- `aria-label` for icon buttons
- `aria-describedby` for form hints
- `aria-live` for dynamic content
- `aria-invalid` for form errors
- `role="alert"` for error messages

**Example - Icon buttons need labels:**
```typescript
// Current (inaccessible)
<Button variant="ghost" onClick={() => router.push('/')}>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Start Over
</Button>

// Should be
<Button
  variant="ghost"
  onClick={() => router.push('/')}
  aria-label="Go back to start"
>
  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
  Start Over
</Button>
```

### 2. No Skip Navigation Link
**Severity:** High

Keyboard users must tab through entire header/nav to reach main content. Add:

```typescript
// At top of layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>

// In page
<main id="main-content" tabIndex={-1}>
```

### 3. Dynamic Content Not Announced
**Severity:** High
**File:** `/app/results/page.tsx`

The loading state changes and analysis results are not announced to screen readers:

```typescript
// Current
<p className="text-muted">{analysisStage}</p>

// Should be
<p
  className="text-muted"
  role="status"
  aria-live="polite"
>
  {analysisStage}
</p>
```

### 4. Missing Heading Hierarchy
**Severity:** Medium

The heading structure skips levels in some places:

```
h1: "Idea Analyzer" (page title)
  h2: "Tell us about your product"
    (No h3s, directly to content)
```

### 5. Form Hints Not Linked
**Severity:** Medium
**File:** `/app/components/ui.tsx`

```typescript
// Current - hint not connected to input
{hint && <p className="text-sm text-muted">{hint}</p>}
<textarea ... />

// Should use aria-describedby
const hintId = `${textareaId}-hint`;
{hint && <p id={hintId} className="text-sm text-muted">{hint}</p>}
<textarea aria-describedby={hint ? hintId : undefined} ... />
```

### 6. Error Messages Not Linked
**Severity:** Medium

```typescript
// Current
{error && <p className="text-sm text-danger">{error}</p>}

// Should be
const errorId = `${inputId}-error`;
<input aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
{error && <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>}
```

---

## Moderate Issues

### 1. Color Contrast Concerns
**File:** `/app/globals.css`

The `--muted` color (#737373 on #fafafa background) may not meet WCAG AA contrast ratio:
- Current ratio: ~4.48:1 (just passes AA for large text)
- Required for body text: 4.5:1 (AA)

**Recommendation:** Darken muted text to #666666 (~5.74:1)

### 2. Progress Steps Not Accessible
**File:** `/app/components/ui.tsx`

```typescript
// Current - visually indicates step, but not for screen readers
<div className={clsx(
  'flex items-center justify-center w-8 h-8 rounded-full',
  { 'bg-primary': index <= currentStep }
)}>
  {index + 1}
</div>

// Should add semantic meaning
<ol className="flex items-center justify-center gap-2" role="list" aria-label="Form progress">
  {steps.map((step, index) => (
    <li
      key={step}
      aria-current={index === currentStep ? 'step' : undefined}
    >
      <span className="sr-only">
        Step {index + 1}: {step} - {index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming'}
      </span>
      ...
    </li>
  ))}
</ol>
```

### 3. Details/Disclosure Pattern
**File:** `/app/components/ui.tsx`

The native `<details>` element is used correctly, which has built-in accessibility. However, the custom styling may need adjustments for focus visibility.

---

## Minor Issues

### 1. Missing Page Descriptions
**File:** `/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: "Idea Analyzer",
  description: "Validate your product idea before you build",
};
```

Good, but each page should have unique descriptions.

### 2. Link vs Button
Some buttons that navigate should potentially be links:

```typescript
// Button for navigation
<Button onClick={() => router.push('/')}>Start Over</Button>

// Could be a link for better semantics
<Link href="/" className="btn">Start Over</Link>
```

### 3. No Touch Target Sizing
Buttons meet minimum 44x44px requirement, but some interactive elements (step indicators, details toggle) may be too small on mobile.

---

## Keyboard Navigation Testing

### Tab Order
| Element | Tab Order | Issues |
|---------|-----------|--------|
| Product Name input | 1 | OK |
| Category select | 2 | OK |
| Problem textarea | 3 | OK |
| ... (continues logically) | | |
| Back button | n-1 | OK |
| Next/Analyze button | n | OK |

Tab order is logical and follows visual order.

### Focus Management
| Action | Focus Handling | Issues |
|--------|----------------|--------|
| Step navigation | No focus management | Focus should move to new step |
| Form submission | No focus management | Focus should move to results |
| Error state | No focus management | Focus should move to error |

---

## Screen Reader Testing (Estimated)

Without actual screen reader testing, estimated issues:

| Issue | Impact |
|-------|--------|
| Loading state changes not announced | Users don't know status |
| Score/verdict not announced when loaded | Key info missed |
| Icon-only buttons not labeled | Unknown button purpose |
| Form hints not connected | Missing context |

---

## WCAG 2.1 Compliance Checklist

### Level A (Required)
| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.1.1 Non-text Content | Fail | Icons not labeled |
| 1.3.1 Info and Relationships | Partial | Forms OK, steps missing semantics |
| 1.3.2 Meaningful Sequence | Pass | Content order logical |
| 2.1.1 Keyboard | Partial | Accessible but no skip link |
| 2.4.1 Bypass Blocks | Fail | No skip navigation |
| 2.4.2 Page Titled | Pass | Titles present |
| 3.1.1 Language of Page | Pass | lang="en" |
| 4.1.2 Name, Role, Value | Fail | Missing ARIA |

### Level AA (Recommended)
| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.4.3 Contrast | Marginal | Muted text borderline |
| 1.4.4 Resize Text | Pass | Responsive design |
| 2.4.6 Headings and Labels | Partial | Some hierarchy issues |
| 3.3.1 Error Identification | Partial | Errors shown but not linked |
| 3.3.2 Labels/Instructions | Pass | Labels present |

---

## Recommendations

### Immediate (Must Fix)
| Priority | Fix |
|----------|-----|
| 1 | Add `aria-live="polite"` to loading/status messages |
| 2 | Add skip navigation link |
| 3 | Add `aria-label` to icon buttons |
| 4 | Link error messages with `aria-describedby` |

### Short-term
| Priority | Fix |
|----------|-----|
| 5 | Link hint text with `aria-describedby` |
| 6 | Add semantic markup to progress steps |
| 7 | Improve focus management on step changes |
| 8 | Test with actual screen reader |

### Long-term
| Priority | Fix |
|----------|-----|
| 9 | Add comprehensive keyboard shortcuts |
| 10 | Implement reduced motion support |
| 11 | Add high contrast mode |
| 12 | Conduct user testing with assistive technology users |

---

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
- [React ARIA](https://react-spectrum.adobe.com/react-aria/)
- [Axe DevTools](https://www.deque.com/axe/)

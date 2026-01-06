# Technical Debt Inventory

**Overall Technical Debt Level: Medium**

## Summary

The codebase is relatively new and clean, but has accumulated some technical debt primarily in areas of error handling, missing infrastructure (testing, error boundaries), and code organization. Most debt items are low-effort to fix.

---

## Debt Categories

### Category Breakdown

| Category | Items | Severity | Effort to Fix |
|----------|-------|----------|---------------|
| Infrastructure | 5 | High | Medium |
| Code Quality | 4 | Medium | Low |
| Architecture | 3 | Low | Medium |
| Dependencies | 2 | Low | Low |

---

## Infrastructure Debt

### TD-001: No Automated Testing
**Severity:** High | **Effort:** High | **File:** Project-wide

**Issue:** Zero test files exist. No unit tests, integration tests, or E2E tests.

**Risk:** Regressions can go unnoticed. Refactoring is risky. Cannot validate Claude API contract.

**Remediation:**
1. Install Vitest + Testing Library
2. Add unit tests for lib/ functions
3. Add component tests for UI
4. Add E2E tests for critical paths

**Estimated Hours:** 16-24

---

### TD-002: No Error Boundary
**Severity:** High | **Effort:** Low | **File:** Missing `error.tsx`

**Issue:** No error.tsx files for route-level error handling. React errors cause white screen.

**Risk:** Poor user experience on errors. Errors may go unlogged.

**Remediation:**
```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Estimated Hours:** 1-2

---

### TD-003: No Loading State File
**Severity:** Medium | **Effort:** Low | **File:** Missing `loading.tsx`

**Issue:** No loading.tsx for route-level loading states. Manual loading UI is inline.

**Risk:** Inconsistent loading experience across routes.

**Remediation:**
```typescript
// app/results/loading.tsx
export default function Loading() {
  return <div>Analyzing...</div>;
}
```

**Estimated Hours:** 1

---

### TD-004: No API Timeout
**Severity:** High | **Effort:** Low | **File:** `/app/api/analyze/route.ts`

**Issue:** Claude API call has no timeout. Could hang indefinitely.

**Risk:** User waits forever. Server resources tied up.

**Remediation:**
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);

const message = await anthropic.messages.create({
  // ...
}, { signal: controller.signal });

clearTimeout(timeout);
```

**Estimated Hours:** 0.5

---

### TD-005: No API Rate Limiting
**Severity:** Medium | **Effort:** Medium | **File:** `/app/api/analyze/route.ts`

**Issue:** No rate limiting on API route. Users can spam analysis requests.

**Risk:** Claude API costs spike. Denial of service possible.

**Remediation:**
- Add rate limiting middleware (e.g., using Vercel's built-in or upstash/ratelimit)
- Consider adding API key requirement

**Estimated Hours:** 2-4

---

## Code Quality Debt

### TD-006: ESLint Error - require() Import
**Severity:** Medium | **Effort:** Low | **File:** `/lib/store.ts:44`

**Issue:**
```typescript
const { VERDICT_CONFIG } = require('./types');
```

**Risk:** Bypasses TypeScript. Inconsistent module system.

**Remediation:**
```typescript
import { VERDICT_CONFIG } from './types';
```

**Estimated Hours:** 0.1

---

### TD-007: ESLint Error - setState in Effect
**Severity:** Medium | **Effort:** Low | **File:** `/app/page.tsx:52-55`

**Issue:**
```typescript
useEffect(() => {
  setProductSpec((prev) => ({ ...prev, ...stored.productSpec }));
}, []);
```

**Risk:** Cascading renders. React anti-pattern.

**Remediation:**
Use lazy initial state:
```typescript
const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>(() => {
  if (typeof window === 'undefined') return { category: 'b2b-saas' };
  const stored = getStoredData();
  return { category: 'b2b-saas', ...stored.productSpec };
});
```

**Estimated Hours:** 0.5

---

### TD-008: Console Statements
**Severity:** Low | **Effort:** Low | **Files:** Multiple

**Issue:**
```
app/api/analyze/route.ts:66:    console.error('Analysis error:', error);
app/results/page.tsx:73:    console.error('API analysis failed, using fallback:', error);
```

**Risk:** Pollutes production logs. May expose sensitive info.

**Remediation:**
- Use proper logging library (pino, winston)
- Or conditional logging: `process.env.NODE_ENV === 'development' && console.error(...)`

**Estimated Hours:** 1

---

### TD-009: Inline Type Definition
**Severity:** Low | **Effort:** Low | **File:** `/app/results/page.tsx:10-23`

**Issue:**
```typescript
interface ExtendedAnalysisResult extends AnalysisResult {
  dimensionScores?: { ... };
  detailedAnalysis?: string;
}
```

**Risk:** Type duplication. Inconsistent type definitions across files.

**Remediation:** Move to `/lib/types.ts`

**Estimated Hours:** 0.25

---

## Architecture Debt

### TD-010: Large Page Components
**Severity:** Low | **Effort:** Medium | **Files:** Page components

**Issue:**
- `/app/page.tsx`: 299 lines
- `/app/results/page.tsx`: 469 lines

**Risk:** Hard to maintain. Hard to test. Mixing concerns.

**Remediation:**
- Extract form steps into separate components
- Extract result sections into components
- Move business logic to custom hooks

**Estimated Hours:** 4-6

---

### TD-011: Fallback Analysis in Page Component
**Severity:** Low | **Effort:** Low | **File:** `/app/results/page.tsx:79-194`

**Issue:** 115 lines of fallback analysis logic inline in component.

**Risk:** Bloats bundle. Hard to test. Mixing concerns.

**Remediation:**
```typescript
// lib/fallback-analysis.ts
export function fallbackAnalysis(...): ExtendedAnalysisResult { ... }
```

**Estimated Hours:** 0.5

---

### TD-012: No Form Validation Library
**Severity:** Low | **Effort:** Medium | **File:** `/app/page.tsx`

**Issue:** Manual form validation with inline checks.

**Risk:** Inconsistent validation. Verbose code.

**Remediation:**
Consider react-hook-form + Zod:
```typescript
const schema = z.object({
  name: z.string().min(1, 'Required'),
  thesis: z.string().min(10, 'Too short'),
});
```

**Estimated Hours:** 4

---

## Dependencies Debt

### TD-013: Build Warning - Multiple Lockfiles
**Severity:** Low | **Effort:** Low | **File:** Project structure

**Issue:**
```
Warning: Next.js inferred your workspace root, but it may not be correct.
Detected additional lockfiles:
  * /Users/nathan/code/lab/goodcraft-app-idea-analyze/analyzer-v2/package-lock.json
  * /Users/nathan/code/lab/package-lock.json
```

**Risk:** Inconsistent dependency resolution. Build confusion.

**Remediation:**
- Configure `turbopack.root` in next.config.ts
- Or remove parent lockfile if not needed

**Estimated Hours:** 0.25

---

### TD-014: Unused Template Assets
**Severity:** Low | **Effort:** Low | **File:** `/public/`

**Issue:** Default Next.js SVGs remain from template:
- file.svg
- globe.svg
- next.svg
- vercel.svg
- window.svg

**Risk:** Unnecessary files in deployment.

**Remediation:** Delete unused files.

**Estimated Hours:** 0.1

---

## Technical Debt Summary Table

| ID | Description | Severity | Effort | Priority Score |
|----|-------------|----------|--------|----------------|
| TD-001 | No automated testing | High | High | Critical |
| TD-004 | No API timeout | High | Low | Critical |
| TD-002 | No error boundary | High | Low | High |
| TD-005 | No rate limiting | Medium | Medium | High |
| TD-006 | require() import | Medium | Low | Medium |
| TD-007 | setState in effect | Medium | Low | Medium |
| TD-003 | No loading.tsx | Medium | Low | Medium |
| TD-008 | Console statements | Low | Low | Low |
| TD-009 | Inline type | Low | Low | Low |
| TD-010 | Large components | Low | Medium | Low |
| TD-011 | Inline fallback logic | Low | Low | Low |
| TD-012 | No form library | Low | Medium | Low |
| TD-013 | Multiple lockfiles | Low | Low | Low |
| TD-014 | Unused assets | Low | Low | Low |

---

## Debt Burndown Plan

### Week 1 (Quick Wins)
- [ ] TD-006: Fix require() import (0.1h)
- [ ] TD-007: Fix setState in effect (0.5h)
- [ ] TD-002: Add error.tsx (1h)
- [ ] TD-004: Add API timeout (0.5h)
- [ ] TD-014: Remove unused assets (0.1h)
**Total: ~2.5 hours**

### Week 2 (Infrastructure)
- [ ] TD-003: Add loading.tsx (1h)
- [ ] TD-008: Replace console.error (1h)
- [ ] TD-009: Move inline type (0.25h)
- [ ] TD-011: Extract fallback analysis (0.5h)
- [ ] TD-013: Fix lockfile warning (0.25h)
**Total: ~3 hours**

### Week 3-4 (Major Items)
- [ ] TD-001: Add basic test suite (16h)
- [ ] TD-005: Add rate limiting (4h)
**Total: ~20 hours**

### Future
- [ ] TD-010: Refactor large components (6h)
- [ ] TD-012: Add form validation library (4h)

---

## Metrics

- **Total Debt Items:** 14
- **Critical/High Severity:** 4
- **Estimated Total Hours:** 40-50 hours
- **Quick Wins (< 1 hour):** 8 items

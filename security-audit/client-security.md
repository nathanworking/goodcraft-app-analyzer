# Client-Side Security Audit - Idea Analyzer v2

**Audit Date:** January 6, 2026
**Scope:** React components in `/app/` directory

---

## Components Analyzed

1. `/app/page.tsx` - Main form page
2. `/app/results/page.tsx` - Results display page
3. `/app/components/ui.tsx` - Reusable UI components
4. `/app/layout.tsx` - Root layout
5. `/lib/store.ts` - LocalStorage management

---

## Security Findings

### 1. XSS (Cross-Site Scripting) Analysis

**Status:** PASS

**Analysis:**
- No use of `dangerouslySetInnerHTML`
- No use of `innerHTML`
- All user input is rendered through React's built-in escaping
- No direct DOM manipulation with user data

**Verified Code Patterns:**
```typescript
// All user data is safely rendered via React:
<dd>{productSpec.name || '-'}</dd>
<dd className="flex-1">{productSpec.thesis || '-'}</dd>
<li key={i} className="text-sm text-muted">• {s}</li>
```

**Note:** React's JSX automatically escapes values, preventing XSS when used correctly.

---

### 2. LocalStorage Security (LOW SEVERITY)

**Location:** `/lib/store.ts`

**Current Implementation:**
```typescript
const STORAGE_KEY = 'idea-analyzer-data';

interface StoredData {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
  result: AnalysisResult | null;
}

export function getStoredData(): StoredData {
  if (typeof window === 'undefined') {
    return { productSpec: {}, founderContext: {}, result: null };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore parse errors
  }
  return { productSpec: {}, founderContext: {}, result: null };
}
```

**Issues:**
1. **Data Persistence:** User input persists indefinitely until manually cleared
2. **No Encryption:** Data stored in plain text
3. **Shared Device Risk:** Multiple users on same browser can see each other's data
4. **No Expiration:** Data never expires

**Risk Assessment:** LOW
- Data is not highly sensitive (product ideas)
- No authentication tokens or passwords stored
- Expected behavior for form state preservation

**Recommendations:**
1. Add data expiration:
```typescript
interface StoredData {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
  result: AnalysisResult | null;
  timestamp: number;
}

export function getStoredData(): StoredData {
  // ...
  if (data) {
    const parsed = JSON.parse(data);
    // Expire data after 7 days
    if (Date.now() - (parsed.timestamp || 0) > 7 * 24 * 60 * 60 * 1000) {
      clearStoredData();
      return { productSpec: {}, founderContext: {}, result: null, timestamp: Date.now() };
    }
    return parsed;
  }
}
```

2. Add clear data button prominently in UI

---

### 3. JSON.parse Error Handling (INFO)

**Location:** `/lib/store.ts`

**Current Implementation:**
```typescript
try {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
} catch {
  // Ignore parse errors
}
```

**Analysis:**
The try-catch is correctly implemented, preventing crashes from malformed localStorage data. However, silently ignoring errors could mask issues.

**Recommendation:**
Add logging for debugging:
```typescript
} catch (error) {
  console.warn('Failed to parse stored data, clearing:', error);
  clearStoredData();
}
```

---

### 4. Form Input Handling (PASS)

**Location:** `/app/page.tsx`

**Analysis:**
- All inputs use controlled components with React state
- Input values are properly type-checked
- Number inputs have min/max constraints:
```typescript
<Input
  label="Hours per week available"
  type="number"
  min={1}
  max={80}
  value={founderContext.hoursPerWeek || 20}
  onChange={(e) => updateFounder({ hoursPerWeek: parseInt(e.target.value) || 20 })}
/>
```

**Note:** The `parseInt` with fallback to 20 prevents NaN issues.

---

### 5. Navigation Security (PASS)

**Location:** `/app/page.tsx`, `/app/results/page.tsx`

**Analysis:**
- Uses Next.js `useRouter` for navigation
- No open redirects
- Internal navigation only

```typescript
const router = useRouter();
// ...
router.push('/results'); // Safe internal navigation
router.push('/'); // Safe internal navigation
```

---

### 6. API Fetch Security (PASS)

**Location:** `/app/results/page.tsx`

**Current Implementation:**
```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productSpec, founderContext }),
});

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error || 'Analysis failed');
}
```

**Analysis:**
- Uses relative URL (same-origin)
- Proper Content-Type header
- Error handling for failed responses
- No credentials or authentication tokens to protect

---

### 7. File Download Security (INFO)

**Location:** `/app/results/page.tsx`

**Current Implementation:**
```typescript
const handleExport = () => {
  if (!result) return;

  const markdown = generateMarkdownExport(result, productSpec, founderContext);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${result.productName.toLowerCase().replace(/\s+/g, '-')}-analysis.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
```

**Analysis:**
- Blob URL is properly revoked after use
- Filename is sanitized (spaces to dashes, lowercase)
- Content is generated from known data structure

**Minor Issue:** Filename sanitization could be more thorough:
```typescript
// Current: only handles spaces
result.productName.toLowerCase().replace(/\s+/g, '-')

// Better: remove all unsafe characters
result.productName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
```

---

### 8. Third-Party Dependencies Security (PASS)

**Client-side Dependencies:**
- `react` / `react-dom` - Well-maintained, no known XSS issues
- `lucide-react` - SVG icons, no security concerns
- `clsx` - Class name utility, no security concerns

**Analysis:**
No high-risk client-side dependencies identified.

---

### 9. CSRF Protection Analysis (LOW SEVERITY)

**Current State:** No explicit CSRF protection

**Analysis:**
The application makes POST requests to `/api/analyze` without CSRF tokens. However:
- Next.js uses SameSite cookies by default (mitigates CSRF in modern browsers)
- No authentication means CSRF has limited impact
- The API doesn't perform sensitive actions (no data modification, deletion)

**Recommendation:**
If authentication is added in the future, implement CSRF protection:
```typescript
// Use Next.js built-in csrf package or custom token
import { csrf } from 'next/headers';

// In API route:
const { token } = await csrf();
```

---

### 10. Content Security (INFO)

**Dynamic Require Usage:**

**Location:** `/lib/store.ts`

```typescript
export function generateMarkdownExport(...) {
  const { VERDICT_CONFIG } = require('./types');
  // ...
}
```

**Analysis:**
Using `require()` in client-side code is unconventional but not a security issue here. It's used to import a constant from the same codebase.

**Recommendation:**
Convert to ES6 import for consistency:
```typescript
import { VERDICT_CONFIG } from './types';
```

---

### 11. Sensitive Data in UI (PASS)

**Analysis:**
No sensitive data displayed in the UI:
- No API keys
- No authentication tokens
- No personally identifiable information (PII)
- User input is business ideas only

---

### 12. Error Display Security (PASS)

**Location:** `/app/results/page.tsx`

```typescript
if (error) {
  return (
    <main className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-8 h-8 mx-auto mb-4 text-danger" />
        <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
        <p className="text-muted mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>Try Again</Button>
      </div>
    </main>
  );
}
```

**Analysis:**
Error messages from the API are displayed to users. This could be a concern if API returns sensitive details, but:
- API should be fixed to return generic messages (see api-security.md)
- Client-side display is secondary concern

---

## Security Recommendations Summary

| Priority | Issue | Severity | Status |
|----------|-------|----------|--------|
| 1 | XSS Prevention | N/A | PASS |
| 2 | LocalStorage Data Expiration | LOW | Needs Fix |
| 3 | CSRF Protection | LOW | Acceptable |
| 4 | Filename Sanitization | INFO | Nice to Have |
| 5 | Dynamic Require | INFO | Nice to Have |

---

## Best Practices Observed

1. **React Controlled Components** - All forms use controlled inputs
2. **Type Safety** - TypeScript used throughout
3. **Safe Navigation** - No open redirects
4. **Proper Error Handling** - Try-catch blocks where needed
5. **No Inline Event Handlers** - All handlers properly bound
6. **Resource Cleanup** - Blob URLs revoked after use

---

## Testing Recommendations

1. **XSS Testing:**
   - Try `<script>alert('XSS')</script>` in all input fields
   - Try `javascript:alert('XSS')` in text inputs
   - Verify all inputs render safely

2. **LocalStorage Testing:**
   - Verify data clears properly with clearStoredData()
   - Test behavior with corrupted localStorage data
   - Test cross-tab data consistency

3. **Error Handling:**
   - Test with network disconnected
   - Test with invalid API responses
   - Test with slow network conditions

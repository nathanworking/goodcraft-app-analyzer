# Security Recommendations - Idea Analyzer v2

**Audit Date:** January 6, 2026
**Priority Levels:** P0 (Critical), P1 (High), P2 (Medium), P3 (Low)

---

## Executive Summary

This document provides prioritized security recommendations with implementation examples. All code examples are ready to use with minimal modifications.

---

## P1: High Priority Fixes (Implement within 24-48 hours)

### 1. Implement Rate Limiting

**Issue:** No rate limiting on `/api/analyze` endpoint
**Risk:** API abuse, cost exhaustion, DoS attacks
**Effort:** Medium (2-4 hours)

#### Option A: Simple In-Memory Rate Limiter

Create `/lib/rate-limit.ts`:
```typescript
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetIn: record.resetTime - now };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, 60 * 1000);
```

Update `/app/api/analyze/route.ts`:
```typescript
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
          'Retry-After': Math.ceil(resetIn / 1000).toString(),
        },
      }
    );
  }

  // ... rest of handler
}
```

#### Option B: Upstash Redis Rate Limiter (Recommended for Production)

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
});
```

---

### 2. Add Security Headers

**Issue:** No security headers configured
**Risk:** XSS, clickjacking, MIME sniffing
**Effort:** Low (1 hour)

Create `/middleware.ts` in the project root:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // XSS protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.anthropic.com",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // Feature permissions
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### 3. Improve Error Handling

**Issue:** Verbose error messages expose internal details
**Risk:** Information disclosure
**Effort:** Low (30 minutes)

Update `/app/api/analyze/route.ts`:
```typescript
} catch (error) {
  // Log full error for debugging (server-side only)
  console.error('Analysis error:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
    // Don't log stack traces in production
    ...(process.env.NODE_ENV !== 'production' && {
      stack: error instanceof Error ? error.stack : undefined,
    }),
  });

  // Determine error type for user-friendly message
  const isRateLimit = error instanceof Error &&
    (error.message.includes('rate_limit') || error.message.includes('429'));

  const isAuthError = error instanceof Error &&
    (error.message.includes('authentication') || error.message.includes('401'));

  if (isRateLimit) {
    return NextResponse.json(
      { error: 'Service is temporarily busy. Please try again in a few minutes.' },
      { status: 503 }
    );
  }

  if (isAuthError) {
    return NextResponse.json(
      { error: 'Service configuration error. Please contact support.' },
      { status: 500 }
    );
  }

  // Generic error for all other cases
  return NextResponse.json(
    { error: 'Analysis failed. Please try again.' },
    { status: 500 }
  );
}
```

---

## P2: Medium Priority Fixes (Implement within 1 week)

### 4. Input Validation with Zod

**Issue:** Minimal input validation
**Risk:** Malformed input, injection attacks
**Effort:** Medium (2-3 hours)

```bash
npm install zod
```

Create `/lib/validation.ts`:
```typescript
import { z } from 'zod';

// Sanitize string input
function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 10000); // Max length
}

export const ProductSpecSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name too long')
    .transform(sanitizeString),
  thesis: z
    .string()
    .max(2000, 'Description too long')
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  targetUser: z
    .string()
    .max(1000)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  category: z
    .enum([
      'b2b-saas',
      'b2c-saas',
      'developer-tools',
      'fintech',
      'marketplace',
      'creator-tools',
      'other',
    ])
    .optional(),
  mvpFeatures: z
    .string()
    .max(5000)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  pricing: z
    .string()
    .max(500)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  distribution: z
    .string()
    .max(2000)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
});

export const FounderContextSchema = z.object({
  technicalSkill: z
    .enum(['non-technical', 'beginner', 'intermediate', 'senior', 'expert'])
    .optional(),
  domainExperience: z
    .string()
    .max(2000)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  existingAudience: z
    .string()
    .max(1000)
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  hoursPerWeek: z
    .number()
    .min(1)
    .max(168)
    .optional(),
  runwayMonths: z
    .number()
    .min(1)
    .max(120)
    .optional(),
  riskTolerance: z
    .enum(['conservative', 'moderate', 'aggressive'])
    .optional(),
});

export const AnalyzeRequestSchema = z.object({
  productSpec: ProductSpecSchema,
  founderContext: FounderContextSchema.optional(),
});

export type ValidatedRequest = z.infer<typeof AnalyzeRequestSchema>;
```

Update `/app/api/analyze/route.ts`:
```typescript
import { AnalyzeRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = AnalyzeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { productSpec, founderContext } = validationResult.data;
    // ... continue with validated data
  }
}
```

---

### 5. Request Body Size Limit

**Issue:** No request size limit
**Risk:** Memory exhaustion, DoS
**Effort:** Low (15 minutes)

Update `/app/api/analyze/route.ts`:
```typescript
const MAX_BODY_SIZE = 50 * 1024; // 50KB

export async function POST(request: NextRequest) {
  // Check content length
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 }
    );
  }

  try {
    const body = await request.json();
    // ... rest of handler
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

---

### 6. Disable Production Source Maps

**Issue:** Source maps expose source code
**Risk:** Intellectual property exposure
**Effort:** Low (5 minutes)

Update `/next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Additional security configurations
  poweredByHeader: false, // Remove X-Powered-By header

  // Strict mode for better error catching
  reactStrictMode: true,
};

export default nextConfig;
```

---

### 7. Add API Key Validation

**Issue:** No validation that API key exists
**Risk:** Runtime errors, unclear error messages
**Effort:** Low (15 minutes)

Update `/app/api/analyze/route.ts`:
```typescript
// Validate at startup
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY environment variable is not set');
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Service not configured. Please contact administrator.' },
      { status: 503 }
    );
  }
  // ... rest of handler
}
```

---

## P3: Low Priority Fixes (Implement when convenient)

### 8. LocalStorage Data Expiration

**Issue:** User data persists indefinitely
**Risk:** Stale data, privacy concerns
**Effort:** Low (30 minutes)

Update `/lib/store.ts`:
```typescript
const STORAGE_KEY = 'idea-analyzer-data';
const EXPIRATION_DAYS = 7;
const EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

interface StoredData {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
  result: AnalysisResult | null;
  timestamp: number;
}

export function getStoredData(): Omit<StoredData, 'timestamp'> {
  if (typeof window === 'undefined') {
    return { productSpec: {}, founderContext: {}, result: null };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as StoredData;

      // Check if data has expired
      if (parsed.timestamp && Date.now() - parsed.timestamp > EXPIRATION_MS) {
        clearStoredData();
        return { productSpec: {}, founderContext: {}, result: null };
      }

      return {
        productSpec: parsed.productSpec || {},
        founderContext: parsed.founderContext || {},
        result: parsed.result || null,
      };
    }
  } catch (error) {
    console.warn('Failed to parse stored data:', error);
    clearStoredData();
  }

  return { productSpec: {}, founderContext: {}, result: null };
}

export function setStoredData(data: Partial<Omit<StoredData, 'timestamp'>>): void {
  if (typeof window === 'undefined') return;

  const existing = getStoredData();
  const updated: StoredData = {
    ...existing,
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
```

---

### 9. Improved Filename Sanitization

**Issue:** Filename sanitization could be more thorough
**Risk:** File system issues, XSS in download names
**Effort:** Low (10 minutes)

Update `/app/results/page.tsx`:
```typescript
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove multiple dashes
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .substring(0, 50) // Limit length
    || 'analysis'; // Fallback
}

const handleExport = () => {
  if (!result) return;

  const markdown = generateMarkdownExport(result, productSpec, founderContext);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(result.productName)}-analysis.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
```

---

### 10. Security Event Logging

**Issue:** No security event logging
**Risk:** Difficult to detect and investigate attacks
**Effort:** Medium (1-2 hours)

Create `/lib/security-logger.ts`:
```typescript
type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'validation_error'
  | 'api_error'
  | 'large_request'
  | 'suspicious_input';

interface SecurityEvent {
  type: SecurityEventType;
  ip: string;
  userAgent?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // In production, send to logging service (e.g., LogDNA, Datadog)
  if (process.env.NODE_ENV === 'production') {
    // await fetch('https://logs.example.com/security', {
    //   method: 'POST',
    //   body: JSON.stringify(fullEvent),
    // });
    console.log('[SECURITY]', JSON.stringify(fullEvent));
  } else {
    console.log('[SECURITY]', fullEvent);
  }
}
```

Usage in API route:
```typescript
import { logSecurityEvent } from '@/lib/security-logger';

// When rate limit exceeded
logSecurityEvent({
  type: 'rate_limit_exceeded',
  ip,
  userAgent: request.headers.get('user-agent') || undefined,
  details: { remaining: 0 },
});

// When validation fails
logSecurityEvent({
  type: 'validation_error',
  ip,
  details: { errors: validationResult.error.issues },
});
```

---

## Implementation Checklist

### Immediate (P1)
- [ ] Add rate limiting to API endpoint
- [ ] Create middleware.ts with security headers
- [ ] Update error handling in API route

### This Week (P2)
- [ ] Install and configure Zod validation
- [ ] Add request body size limits
- [ ] Disable production source maps
- [ ] Add API key presence validation

### When Convenient (P3)
- [ ] Add localStorage data expiration
- [ ] Improve filename sanitization
- [ ] Set up security event logging

---

## Testing After Implementation

1. **Rate Limiting Test:**
   ```bash
   for i in {1..10}; do curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"productSpec":{"name":"test"}}'; done
   ```

2. **Security Headers Test:**
   ```bash
   curl -I http://localhost:3000
   ```

3. **Large Request Test:**
   ```bash
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -d "$(head -c 100000 /dev/zero | tr '\0' 'a')"
   ```

4. **Validation Test:**
   ```bash
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"productSpec":{"name":"","hoursPerWeek":500}}'
   ```

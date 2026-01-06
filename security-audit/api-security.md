# API Security Audit - Idea Analyzer v2

**Audit Date:** January 6, 2026
**Scope:** `/app/api/analyze/route.ts` and related API handling

---

## API Endpoint Overview

### POST /api/analyze
- **Purpose:** Accepts product specification and founder context, returns AI analysis
- **Authentication:** None
- **Rate Limiting:** None
- **Request Validation:** Minimal

---

## Detailed Findings

### 1. Rate Limiting (HIGH SEVERITY)

**Current State:** No rate limiting implemented

**Risk Analysis:**
- Unlimited API calls can exhaust Anthropic API credits
- No protection against automated abuse
- Potential for denial of service
- Could be used to scrape AI responses

**Affected Code:**
```typescript
// /app/api/analyze/route.ts - Line 8
export async function POST(request: NextRequest) {
  // No rate limiting check before processing
  try {
    const body = await request.json();
    // ... processes request immediately
```

**Recommendation:**
Implement rate limiting using:
1. Next.js middleware with IP-based limits
2. A rate limiting library (e.g., `@upstash/ratelimit`)
3. Vercel Edge Config for serverless-compatible limiting

**Example Fix:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      }
    );
  }
  // ... continue with request
}
```

---

### 2. Input Validation (MEDIUM SEVERITY)

**Current State:** Only checks for `productSpec.name`

**Affected Code:**
```typescript
// /app/api/analyze/route.ts - Lines 10-21
const body = await request.json();
const { productSpec, founderContext } = body as {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
};

if (!productSpec?.name) {
  return NextResponse.json(
    { error: 'Product name is required' },
    { status: 400 }
  );
}
```

**Issues:**
1. Type assertion (`as`) provides no runtime validation
2. No length limits on text fields
3. No sanitization of input strings
4. No validation of enum values (category, skill level, etc.)
5. No validation of numeric ranges (hours, months)

**Risk Analysis:**
- Excessively long strings could cause performance issues
- Malicious strings could attempt prompt injection
- Invalid enum values could cause unexpected behavior

**Recommendation:**
Implement comprehensive validation using Zod:

```typescript
import { z } from 'zod';

const ProductSpecSchema = z.object({
  name: z.string().min(1).max(100),
  thesis: z.string().max(2000).optional(),
  targetUser: z.string().max(1000).optional(),
  category: z.enum(['b2b-saas', 'b2c-saas', 'developer-tools', 'fintech', 'marketplace', 'creator-tools', 'other']).optional(),
  mvpFeatures: z.string().max(5000).optional(),
  pricing: z.string().max(500).optional(),
  distribution: z.string().max(2000).optional(),
});

const FounderContextSchema = z.object({
  technicalSkill: z.enum(['non-technical', 'beginner', 'intermediate', 'senior', 'expert']).optional(),
  domainExperience: z.string().max(2000).optional(),
  existingAudience: z.string().max(1000).optional(),
  hoursPerWeek: z.number().min(1).max(168).optional(),
  runwayMonths: z.number().min(1).max(120).optional(),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
});

const RequestSchema = z.object({
  productSpec: ProductSpecSchema,
  founderContext: FounderContextSchema.optional(),
});
```

---

### 3. Error Handling (MEDIUM SEVERITY)

**Current State:** Raw error messages exposed

**Affected Code:**
```typescript
// /app/api/analyze/route.ts - Lines 65-72
} catch (error) {
  console.error('Analysis error:', error);
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  );
}
```

**Issues:**
1. `error.message` could contain sensitive information (API keys, internal paths)
2. Stack traces logged to console could be captured if logging is misconfigured
3. Anthropic API errors might reveal configuration details

**Recommendation:**
```typescript
} catch (error) {
  // Log full error for debugging (ensure logs are secured)
  console.error('Analysis error:', error);

  // Return generic message to client
  const isRateLimitError = error instanceof Error &&
    error.message.includes('rate_limit');

  return NextResponse.json(
    {
      error: isRateLimitError
        ? 'Service temporarily unavailable. Please try again later.'
        : 'Analysis failed. Please try again.',
      code: isRateLimitError ? 'RATE_LIMITED' : 'ANALYSIS_ERROR',
    },
    { status: isRateLimitError ? 503 : 500 }
  );
}
```

---

### 4. Request Body Size (MEDIUM SEVERITY)

**Current State:** No body size limit configured

**Affected Code:**
```typescript
// No bodyParser configuration
const body = await request.json();
```

**Risk Analysis:**
- Large payloads could consume server memory
- Could be used for denial of service
- May cause timeouts and failed requests

**Recommendation:**
Add route segment config:

```typescript
// /app/api/analyze/route.ts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50kb',
    },
  },
};
```

Or in Next.js 14+, use route segment config:
```typescript
export const maxDuration = 30; // seconds
```

And validate in code:
```typescript
const contentLength = request.headers.get('content-length');
if (contentLength && parseInt(contentLength) > 50000) {
  return NextResponse.json(
    { error: 'Request too large' },
    { status: 413 }
  );
}
```

---

### 5. API Key Handling (HIGH SEVERITY)

**Current State:** Anthropic client initialized at module level

**Affected Code:**
```typescript
// /app/api/analyze/route.ts - Line 6
const anthropic = new Anthropic();
```

**Analysis:**
The Anthropic SDK reads `ANTHROPIC_API_KEY` from environment variables by default. This is good practice. However:

1. **No validation that key exists** - If key is missing, errors will occur at runtime
2. **No key rotation mechanism** - Single key used for all requests
3. **No usage tracking** - No way to monitor API consumption

**Recommendation:**
```typescript
// Add at top of file
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

---

### 6. Response Data Handling (LOW SEVERITY)

**Current State:** Raw AI response parsing

**Affected Code:**
```typescript
// /lib/analyzer-prompt.ts - Lines 133-143
try {
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[1]);
    return { success: true, data: parsed };
  }
  const parsed = JSON.parse(response);
  return { success: true, data: parsed };
} catch {
```

**Issues:**
1. JSON.parse could fail on malformed responses
2. No schema validation on parsed data
3. Parsed data is trusted directly

**Recommendation:**
Add schema validation to parsed response:
```typescript
const AnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(10),
  verdict: z.enum(['build', 'build-with-changes', 'maybe', 'pivot', 'pass']),
  verdictSummary: z.string(),
  strengths: z.array(z.string()),
  mustAddress: z.array(z.string()),
  risks: z.array(z.string()),
  metrics: z.object({
    timeToMvp: z.string(),
    timeToFirstRevenue: z.string(),
    usersNeeded: z.string(),
    competition: z.string(),
  }),
  actions: z.array(z.string()),
});
```

---

### 7. CORS Configuration (INFO)

**Current State:** Using Next.js defaults

**Analysis:**
Next.js API routes have same-origin restrictions by default. For a single-domain application, this is acceptable.

**Note:** If API needs to be accessed from other domains in the future, explicit CORS headers should be configured.

---

### 8. HTTP Methods (INFO)

**Current State:** Only POST handler defined

**Analysis:**
This is correct - only POST is needed. Next.js will automatically return 405 for other methods.

---

## Security Recommendations Summary

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Implement rate limiting | Medium |
| 2 | Add request body size limits | Low |
| 3 | Improve error handling | Low |
| 4 | Add input validation with Zod | Medium |
| 5 | Validate API key presence | Low |
| 6 | Add response schema validation | Medium |

---

## Testing Recommendations

1. **Rate Limit Testing:** Use tools like `ab` or `siege` to test behavior under load
2. **Input Fuzzing:** Test with malformed, oversized, and malicious inputs
3. **Error Handling:** Test various failure scenarios (network errors, API limits)
4. **Prompt Injection:** Test with inputs designed to manipulate AI responses

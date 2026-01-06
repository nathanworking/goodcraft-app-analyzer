# Refactoring Suggestions

**Effort Estimate:** 20-30 hours total for all suggestions

## Summary

This document outlines code improvements that would enhance maintainability, testability, and developer experience. Each suggestion includes before/after code examples and estimated effort.

---

## High Priority Refactoring

### 1. Fix setState in useEffect Anti-Pattern

**File:** `/app/page.tsx`
**Effort:** 30 minutes
**Impact:** Eliminates ESLint error, follows React best practices

#### Before (Current)
```typescript
const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>({
  category: 'b2b-saas',
});
const [founderContext, setFounderContext] = useState<Partial<FounderContext>>({
  technicalSkill: 'intermediate',
  riskTolerance: 'moderate',
  hoursPerWeek: 20,
  runwayMonths: 12,
});

useEffect(() => {
  const stored = getStoredData();
  if (stored.productSpec && Object.keys(stored.productSpec).length > 0) {
    setProductSpec((prev) => ({ ...prev, ...stored.productSpec }));
  }
  if (stored.founderContext && Object.keys(stored.founderContext).length > 0) {
    setFounderContext((prev) => ({ ...prev, ...stored.founderContext }));
  }
}, []);
```

#### After (Recommended)
```typescript
const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>(() => {
  // Lazy initialization - runs once on mount
  if (typeof window === 'undefined') {
    return { category: 'b2b-saas' };
  }
  const stored = getStoredData();
  return {
    category: 'b2b-saas',
    ...(stored.productSpec || {}),
  };
});

const [founderContext, setFounderContext] = useState<Partial<FounderContext>>(() => {
  if (typeof window === 'undefined') {
    return {
      technicalSkill: 'intermediate',
      riskTolerance: 'moderate',
      hoursPerWeek: 20,
      runwayMonths: 12,
    };
  }
  const stored = getStoredData();
  return {
    technicalSkill: 'intermediate',
    riskTolerance: 'moderate',
    hoursPerWeek: 20,
    runwayMonths: 12,
    ...(stored.founderContext || {}),
  };
});

// Remove the useEffect entirely
```

---

### 2. Fix require() Import

**File:** `/lib/store.ts`
**Effort:** 5 minutes
**Impact:** Eliminates ESLint error, proper ES modules

#### Before (Current)
```typescript
export function generateMarkdownExport(result: AnalysisResult, productSpec: Partial<ProductSpec>, founderContext: Partial<FounderContext>): string {
  const { VERDICT_CONFIG } = require('./types');
  const verdictConfig = VERDICT_CONFIG[result.verdict];
  // ...
}
```

#### After (Recommended)
```typescript
import { VERDICT_CONFIG, AnalysisResult, ProductSpec, FounderContext, Verdict } from './types';

export function generateMarkdownExport(
  result: AnalysisResult,
  productSpec: Partial<ProductSpec>,
  founderContext: Partial<FounderContext>
): string {
  const verdictConfig = VERDICT_CONFIG[result.verdict];
  // ...
}
```

---

### 3. Add API Timeout and Error Handling

**File:** `/app/api/analyze/route.ts`
**Effort:** 30 minutes
**Impact:** Prevents hanging requests, better error handling

#### Before (Current)
```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 8192,
  messages: [{ role: 'user', content: prompt }],
});
```

#### After (Recommended)
```typescript
const TIMEOUT_MS = 60000; // 60 seconds

async function createMessageWithTimeout(
  prompt: string,
  timeoutMs: number = TIMEOUT_MS
): Promise<Anthropic.Message> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const message = await anthropic.messages.create(
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      },
      { signal: controller.signal }
    );
    return message;
  } finally {
    clearTimeout(timeoutId);
  }
}

// In the route handler:
try {
  const message = await createMessageWithTimeout(prompt);
  // ...
} catch (error) {
  if (error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Analysis timed out. Please try again.' },
      { status: 504 }
    );
  }
  throw error;
}
```

---

## Medium Priority Refactoring

### 4. Extract Analysis Logic to Custom Hook

**File:** `/app/results/page.tsx`
**Effort:** 2-3 hours
**Impact:** Separation of concerns, testability, reusability

#### Before (Current)
The `ResultsPage` component contains:
- `analyzeIdea` async function (inline)
- `fallbackAnalysis` function (inline)
- Loading state management
- Error handling
- Rendering logic

All in ~470 lines.

#### After (Recommended)

**New file: `/lib/hooks/useAnalysis.ts`**
```typescript
import { useState, useEffect } from 'react';
import { ProductSpec, FounderContext } from '../types';
import { getStoredData, setStoredData } from '../store';
import { analyzeIdea } from '../analyze';

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
}

const PROGRESS_STAGES = [
  'Analyzing team requirements...',
  'Evaluating build complexity...',
  'Researching competition...',
  'Modeling financial path...',
  'Assessing user acquisition...',
  'Checking technical risks...',
  'Analyzing defensibility...',
  'Evaluating capital efficiency...',
  'Exploring pivot potential...',
  'Synthesizing findings...',
];

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('Starting analysis...');
  const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>({});
  const [founderContext, setFounderContext] = useState<Partial<FounderContext>>({});

  useEffect(() => {
    const stored = getStoredData();
    if (!stored.productSpec?.name) {
      setError('No product data found');
      setIsLoading(false);
      return;
    }

    setProductSpec(stored.productSpec);
    setFounderContext(stored.founderContext);

    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < PROGRESS_STAGES.length) {
        setProgress(PROGRESS_STAGES[stageIndex]);
        stageIndex++;
      }
    }, 2000);

    analyzeIdea(stored.productSpec, stored.founderContext)
      .then((analysisResult) => {
        clearInterval(stageInterval);
        setResult(analysisResult);
        setStoredData({ result: analysisResult });
        setIsLoading(false);
      })
      .catch((err) => {
        clearInterval(stageInterval);
        setError(err.message);
        setIsLoading(false);
      });

    return () => clearInterval(stageInterval);
  }, []);

  return { result, isLoading, error, progress, productSpec, founderContext };
}
```

**New file: `/lib/analyze.ts`**
```typescript
import { ProductSpec, FounderContext, AnalysisResult } from './types';
import { fallbackAnalysis } from './fallback-analysis';

export async function analyzeIdea(
  productSpec: Partial<ProductSpec>,
  founderContext: Partial<FounderContext>
): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productSpec, founderContext }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    return normalizeResult(data.result, productSpec);
  } catch (error) {
    console.error('API analysis failed, using fallback:', error);
    return fallbackAnalysis(productSpec, founderContext);
  }
}
```

**Updated `/app/results/page.tsx`**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { AnalysisResults } from './AnalysisResults';

export default function ResultsPage() {
  const router = useRouter();
  const { result, isLoading, error, progress, productSpec, founderContext } = useAnalysis();

  if (isLoading) {
    return <LoadingState progress={progress} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => router.push('/')} />;
  }

  if (!result) {
    router.push('/');
    return null;
  }

  return (
    <AnalysisResults
      result={result}
      productSpec={productSpec}
      founderContext={founderContext}
    />
  );
}
```

---

### 5. Extract Result Page Sections

**File:** `/app/results/page.tsx`
**Effort:** 1-2 hours
**Impact:** Better organization, reusability, testability

#### After (Recommended Structure)
```
app/
  results/
    page.tsx              # Main page (slim)
    components/
      VerdictSection.tsx
      DimensionScores.tsx
      StrengthsWeaknesses.tsx
      MetricsSection.tsx
      ActionPlan.tsx
      InputSummary.tsx
```

**Example: `VerdictSection.tsx`**
```typescript
import { VerdictBox } from '@/app/components/ui';
import { AnalysisResult, VERDICT_CONFIG } from '@/lib/types';

interface VerdictSectionProps {
  result: AnalysisResult;
}

export function VerdictSection({ result }: VerdictSectionProps) {
  const verdictConfig = VERDICT_CONFIG[result.verdict];

  return (
    <section aria-label="Analysis verdict" className="mb-8">
      <VerdictBox
        emoji={verdictConfig.emoji}
        label={verdictConfig.label}
        score={result.overallScore}
        summary={result.verdictSummary}
        bgColor={verdictConfig.bgColor}
      />
    </section>
  );
}
```

---

### 6. Add Form Validation with Zod

**File:** `/app/page.tsx`
**Effort:** 2-3 hours
**Impact:** Type-safe validation, better error messages, API contract enforcement

#### Current Approach
```typescript
const canProceed = () => {
  if (step === 0) {
    return productSpec.name && productSpec.thesis && productSpec.mvpFeatures;
  }
  // ...
};
```

#### Recommended Approach
```typescript
// lib/schemas.ts
import { z } from 'zod';

export const productSpecSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  thesis: z.string().min(20, 'Problem statement should be at least 20 characters'),
  targetUser: z.string().optional(),
  category: z.enum(['b2b-saas', 'b2c-saas', 'developer-tools', 'fintech', 'marketplace', 'creator-tools', 'other']),
  mvpFeatures: z.string().min(10, 'MVP features are required'),
  pricing: z.string().optional(),
  distribution: z.string().optional(),
});

export const founderContextSchema = z.object({
  technicalSkill: z.enum(['non-technical', 'beginner', 'intermediate', 'senior', 'expert']),
  domainExperience: z.string().optional(),
  existingAudience: z.string().optional(),
  hoursPerWeek: z.number().min(1).max(80),
  runwayMonths: z.number().min(1).max(60),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']),
});

// In component:
const productErrors = useMemo(() => {
  const result = productSpecSchema.safeParse(productSpec);
  return result.success ? {} : result.error.flatten().fieldErrors;
}, [productSpec]);
```

---

## Low Priority Refactoring

### 7. Consolidate Color Constants

**File:** `/app/globals.css`
**Effort:** 30 minutes
**Impact:** Consistency, maintainability

#### Suggestion
Create a shared color tokens file that can be used by both CSS and TypeScript:

```typescript
// lib/colors.ts
export const colors = {
  light: {
    background: '#fafafa',
    foreground: '#0a0a0a',
    muted: '#737373',
    // ...
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    muted: '#a3a3a3',
    // ...
  },
};
```

---

### 8. Add Proper TypeScript Types for API Response

**File:** `/lib/types.ts`
**Effort:** 1 hour
**Impact:** Type safety for API contract

```typescript
// Add to types.ts
export interface APIAnalyzeRequest {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
}

export interface APIAnalyzeResponse {
  success: boolean;
  result?: AnalysisResult & {
    dimensionScores?: DimensionScores;
    detailedAnalysis?: string;
  };
  error?: string;
  rawResponse?: string;
}

export interface DimensionScores {
  team: number;
  buildComplexity: number;
  competition: number;
  financialPath: number;
  userAcquisition: number;
  technicalRisk: number;
  defensibility: number;
  capitalEfficiency: number;
  pivotPotential: number;
}
```

---

### 9. Add Accessibility Improvements to UI Components

**File:** `/app/components/ui.tsx`
**Effort:** 2 hours
**Impact:** WCAG compliance, better screen reader support

#### Example: Improved Textarea Component
```typescript
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        {hint && (
          <p id={hintId} className="text-sm text-muted">
            {hint}
          </p>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={clsx(
            'w-full px-3 py-2 bg-card border border-border rounded-lg',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
```

---

## Refactoring Checklist

### Quick Wins (< 1 hour each)
- [ ] Fix require() import in store.ts
- [ ] Fix setState in useEffect
- [ ] Add API timeout
- [ ] Move ExtendedAnalysisResult to types.ts

### Medium Effort (1-3 hours each)
- [ ] Extract useAnalysis hook
- [ ] Extract fallback analysis to separate file
- [ ] Add aria attributes to UI components
- [ ] Add error.tsx for route error handling

### Larger Efforts (3+ hours each)
- [ ] Add Zod validation schemas
- [ ] Extract result page sections
- [ ] Add comprehensive testing

---

## Recommended Refactoring Order

1. **Week 1:** Quick wins + error handling
2. **Week 2:** Hook extraction + code organization
3. **Week 3:** Accessibility improvements
4. **Week 4+:** Testing + form validation

Total estimated time: 20-30 hours

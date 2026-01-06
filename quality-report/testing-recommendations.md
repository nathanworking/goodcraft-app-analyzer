# Testing Recommendations

**Overall Grade: F (No Tests)**

## Summary

The codebase currently has **zero automated tests**. No test files were found in the project. This represents a significant risk for a production application, especially one that handles user data and makes external API calls.

---

## Current State

### Test Files Found
```bash
find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules
# Result: No files found
```

### Testing Infrastructure
- No test runner configured (Jest, Vitest, Playwright)
- No testing libraries in package.json
- No test scripts defined
- No CI/CD test pipeline

### Test-Related Files
The `/test-specs/` directory contains **manual test scenarios** (high-value-ideas.md, low-value-ideas.md) but no automated tests.

---

## Testing Strategy Recommendations

### 1. Unit Tests (Priority: High)

#### What to Test

**lib/types.ts** - Type guards and validation
```typescript
// types.test.ts
describe('VERDICT_CONFIG', () => {
  it('should have config for all verdict types', () => {
    const verdicts: Verdict[] = ['build', 'build-with-changes', 'maybe', 'pivot', 'pass'];
    verdicts.forEach(v => {
      expect(VERDICT_CONFIG[v]).toBeDefined();
      expect(VERDICT_CONFIG[v].emoji).toBeDefined();
      expect(VERDICT_CONFIG[v].label).toBeDefined();
    });
  });
});
```

**lib/store.ts** - Storage functions
```typescript
// store.test.ts
describe('getStoredData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default values when no data stored', () => {
    const result = getStoredData();
    expect(result.productSpec).toEqual({});
    expect(result.founderContext).toEqual({});
    expect(result.result).toBeNull();
  });

  it('should return stored data when present', () => {
    const data = { productSpec: { name: 'Test' } };
    localStorage.setItem('idea-analyzer-data', JSON.stringify(data));
    const result = getStoredData();
    expect(result.productSpec.name).toBe('Test');
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('idea-analyzer-data', 'invalid json');
    const result = getStoredData();
    expect(result).toEqual({ productSpec: {}, founderContext: {}, result: null });
  });
});
```

**lib/analyzer-prompt.ts** - Prompt building and parsing
```typescript
// analyzer-prompt.test.ts
describe('buildAnalyzerPrompt', () => {
  it('should include all product fields', () => {
    const productSpec = {
      name: 'TestApp',
      thesis: 'Solves X problem',
      category: 'b2b-saas',
    };
    const prompt = buildAnalyzerPrompt(productSpec, {});
    expect(prompt).toContain('TestApp');
    expect(prompt).toContain('Solves X problem');
    expect(prompt).toContain('b2b-saas');
  });

  it('should handle missing fields gracefully', () => {
    const prompt = buildAnalyzerPrompt({}, {});
    expect(prompt).toContain('Unnamed Product');
    expect(prompt).toContain('Not provided');
  });
});

describe('parseAnalyzerResponse', () => {
  it('should parse valid JSON response', () => {
    const response = '```json\n{"overallScore": 7, "verdict": "build"}\n```';
    const result = parseAnalyzerResponse(response);
    expect(result.success).toBe(true);
    expect(result.data?.overallScore).toBe(7);
  });

  it('should handle malformed JSON gracefully', () => {
    const result = parseAnalyzerResponse('not json at all');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should extract fields from non-JSON response', () => {
    const response = 'The overall score is 6.5 and verdict is maybe';
    const result = parseAnalyzerResponse(response);
    expect(result.success).toBe(true);
    expect(result.data?.overallScore).toBe(6.5);
  });
});
```

---

### 2. Component Tests (Priority: High)

#### What to Test

**app/components/ui.tsx** - UI component behavior
```typescript
// ui.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, Select, Steps } from './ui';

describe('Button', () => {
  it('should render with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('Input', () => {
  it('should associate label with input', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});

describe('Steps', () => {
  it('should highlight current step', () => {
    render(<Steps steps={['One', 'Two', 'Three']} currentStep={1} />);
    // Check step 2 is highlighted
  });
});
```

---

### 3. Integration Tests (Priority: Medium)

#### Page Integration Tests
```typescript
// app/page.integration.test.tsx
describe('Home Page', () => {
  it('should complete form flow from step 1 to 3', async () => {
    render(<Home />);

    // Step 1: Product
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'TestApp' }
    });
    fireEvent.change(screen.getByLabelText(/what problem/i), {
      target: { value: 'Solves testing problems' }
    });
    fireEvent.change(screen.getByLabelText(/mvp features/i), {
      target: { value: '- Feature 1\n- Feature 2' }
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Founder
    await waitFor(() => {
      expect(screen.getByText(/tell us about you/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Review
    await waitFor(() => {
      expect(screen.getByText(/review & analyze/i)).toBeInTheDocument();
      expect(screen.getByText('TestApp')).toBeInTheDocument();
    });
  });

  it('should persist form data to localStorage', async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'TestApp' }
    });

    const stored = JSON.parse(localStorage.getItem('idea-analyzer-data') || '{}');
    expect(stored.productSpec.name).toBe('TestApp');
  });
});
```

---

### 4. API Route Tests (Priority: High)

```typescript
// app/api/analyze/route.test.ts
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: '```json\n{"overallScore":7,"verdict":"build"}\n```' }]
      })
    }
  }))
}));

describe('POST /api/analyze', () => {
  it('should return 400 if product name is missing', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ productSpec: {}, founderContext: {} })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return analysis result on success', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        productSpec: { name: 'TestApp', thesis: 'Testing' },
        founderContext: { technicalSkill: 'senior' }
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.overallScore).toBe(7);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(anthropic.messages, 'create').mockRejectedValueOnce(new Error('API Error'));

    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ productSpec: { name: 'Test' } })
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
```

---

### 5. End-to-End Tests (Priority: Medium)

#### Playwright E2E Tests
```typescript
// e2e/analysis-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Idea Analysis Flow', () => {
  test('complete analysis from start to finish', async ({ page }) => {
    await page.goto('/');

    // Fill product info
    await page.fill('[name="name"]', 'TestApp');
    await page.fill('[name="thesis"]', 'Solves testing problems');
    await page.fill('[name="mvpFeatures"]', '- Testing\n- More testing');
    await page.click('button:has-text("Next")');

    // Fill founder info
    await page.selectOption('select', { label: 'Senior (3-7 years)' });
    await page.click('button:has-text("Next")');

    // Submit analysis
    await page.click('button:has-text("Analyze Idea")');

    // Wait for results
    await expect(page).toHaveURL('/results');
    await expect(page.locator('h1')).toContainText('TestApp Analysis');

    // Verify score is displayed
    await expect(page.locator('.score')).toBeVisible();
  });

  test('should persist data across page refresh', async ({ page }) => {
    await page.goto('/');
    await page.fill('[name="name"]', 'PersistTest');
    await page.reload();
    await expect(page.locator('[name="name"]')).toHaveValue('PersistTest');
  });

  test('should redirect from results if no data', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.goto('/results');
    await expect(page).toHaveURL('/');
  });
});
```

---

### 6. Visual Regression Tests (Priority: Low)

```typescript
// e2e/visual.spec.ts
test('home page matches snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home-page.png');
});

test('results page matches snapshot', async ({ page }) => {
  // Setup: navigate through form and get results
  await expect(page).toHaveScreenshot('results-page.png');
});
```

---

## Recommended Test Setup

### 1. Install Dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D msw  # API mocking
```

### 2. Configure Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.next/']
    }
  }
});
```

### 3. Add Test Scripts
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Coverage Goals

| Area | Current | Target |
|------|---------|--------|
| lib/ functions | 0% | 90% |
| UI components | 0% | 80% |
| Page components | 0% | 70% |
| API routes | 0% | 85% |
| E2E flows | 0% | Core flows covered |

---

## Testing Priority Matrix

| Test Type | Priority | Effort | Impact |
|-----------|----------|--------|--------|
| lib/store.ts unit | High | Low | High |
| lib/analyzer-prompt.ts unit | High | Low | High |
| API route tests | High | Medium | High |
| UI component tests | Medium | Medium | Medium |
| Page integration | Medium | High | High |
| E2E happy path | Medium | Medium | High |
| Visual regression | Low | Low | Medium |

---

## Manual Testing Checklist

Until automated tests are in place, use this manual checklist:

### Form Flow
- [ ] Can fill all fields on step 1
- [ ] Can navigate forward/back between steps
- [ ] Required fields block progression
- [ ] Data persists on page refresh
- [ ] Review step shows entered data

### Analysis
- [ ] Loading state displays with progress
- [ ] Successful analysis shows results
- [ ] Failed analysis shows error message
- [ ] Can retry after error

### Results Page
- [ ] Score displays correctly
- [ ] Verdict matches score range
- [ ] All sections expand/collapse
- [ ] Export downloads .md file
- [ ] Start Over returns to form

### Edge Cases
- [ ] Empty localStorage handled
- [ ] Direct URL to /results redirects
- [ ] Long text inputs don't break layout
- [ ] Works on mobile viewport

# Idea Analyzer: Technical Roadmap

## Current Architecture Assessment

### Existing Stack
- **Framework:** Next.js 16.1.1 (React 19)
- **Styling:** Tailwind CSS 4
- **AI Integration:** Anthropic Claude API (Claude Sonnet)
- **State Management:** React useState/useEffect
- **Storage:** Browser localStorage
- **Hosting:** Likely Vercel (Next.js native)

### Current Capabilities
- Multi-step form input
- 9-agent analysis framework
- Real-time analysis progress
- Results display with dimension scores
- Markdown export
- Fallback analysis when API fails

### Current Limitations
- No user authentication
- No persistent data storage
- No server-side data (localStorage only)
- No multi-user collaboration
- No API for external access
- Single-tenant architecture

---

## Technical Evolution Phases

### Phase 1: Foundation (Months 1-2)
**Goal:** Production-ready infrastructure

### Phase 2: User Data (Months 3-4)
**Goal:** Authentication, persistence, history

### Phase 3: Scale & Features (Months 5-8)
**Goal:** API, collaboration, integrations

### Phase 4: Enterprise (Months 9-12)
**Goal:** Multi-tenant, advanced security

---

## Phase 1: Foundation (Months 1-2)

### 1.1 Database Setup

**Recommended: PostgreSQL with Prisma**

**Why PostgreSQL:**
- Robust, battle-tested
- Excellent with Prisma ORM
- Supabase/Neon for managed hosting
- Good for relational data (users, analyses, teams)

**Why Prisma:**
- Type-safe database access
- Excellent Next.js integration
- Migrations built-in
- Good developer experience

**Initial Schema:**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  analyses      Analysis[]
  subscription  Subscription?
}

model Analysis {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  productName     String
  productSpec     Json
  founderContext  Json
  result          Json
  score           Float
  verdict         String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  @@index([userId])
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  tier      String   // 'free', 'pro', 'team', 'enterprise'
  status    String   // 'active', 'canceled', 'past_due'
  stripeId  String?
  expiresAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 1.2 Authentication

**Recommended: NextAuth.js (Auth.js)**

**Providers to Support:**
- Email/password (with email verification)
- Google OAuth
- GitHub OAuth (for developer audience)

**Implementation:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 1.3 Environment Configuration

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://ideaanalyzer.com"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# AI
ANTHROPIC_API_KEY="..."

# Email (for magic links)
EMAIL_SERVER="smtp://..."
EMAIL_FROM="noreply@ideaanalyzer.com"

# Payments (later)
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
```

### 1.4 Analytics & Monitoring

**Recommended Stack:**
- **Analytics:** PostHog (self-hostable, privacy-friendly)
- **Error Tracking:** Sentry
- **Uptime:** Better Uptime or similar
- **Logging:** Vercel logs + structured logging

**PostHog Integration:**
```typescript
// lib/posthog.ts
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
      capture_pageview: false, // Handle manually for SPA
    })
  }
}

// Track events
export const trackAnalysis = (score: number, verdict: string) => {
  posthog.capture('analysis_completed', {
    score,
    verdict,
  })
}
```

### 1.5 Rate Limiting

**Implementation with Upstash Redis:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 requests per hour
  analytics: true,
})

// In API route
const { success, limit, remaining } = await ratelimit.limit(userId)
if (!success) {
  return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
}
```

---

## Phase 2: User Data (Months 3-4)

### 2.1 Analysis History

**Dashboard Page:**
```typescript
// app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession()

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h1>Your Analyses</h1>
      <AnalysisList analyses={analyses} />
    </div>
  )
}
```

**Features:**
- List all past analyses
- Filter by verdict, score, date
- Search by product name
- Re-run analysis with same inputs
- Compare analyses side-by-side

### 2.2 Multi-Idea Comparison

**Database Addition:**
```prisma
model Comparison {
  id         String    @id @default(cuid())
  userId     String
  name       String
  analysisIds String[]
  createdAt  DateTime  @default(now())
}
```

**UI Component:**
```typescript
// components/ComparisonTable.tsx
interface ComparisonTableProps {
  analyses: Analysis[]
}

export function ComparisonTable({ analyses }: ComparisonTableProps) {
  const dimensions = [
    'team', 'buildComplexity', 'competition',
    'financialPath', 'userAcquisition', 'technicalRisk',
    'defensibility', 'capitalEfficiency', 'pivotPotential'
  ]

  return (
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          {analyses.map(a => <th key={a.id}>{a.productName}</th>)}
        </tr>
      </thead>
      <tbody>
        {dimensions.map(dim => (
          <tr key={dim}>
            <td>{dim}</td>
            {analyses.map(a => (
              <td key={a.id}>{a.result.dimensionScores[dim]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 2.3 Usage Tracking & Limits

**Subscription Enforcement:**
```typescript
// lib/subscription.ts
export async function checkUsageLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  limit: number
}> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const tier = subscription?.tier || 'free'
  const limits = {
    free: 1,
    pro: Infinity,
    team: Infinity,
    enterprise: Infinity,
  }

  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const usageCount = await prisma.analysis.count({
    where: {
      userId,
      createdAt: { gte: thisMonth },
    },
  })

  const limit = limits[tier]
  const remaining = Math.max(0, limit - usageCount)

  return {
    allowed: remaining > 0 || limit === Infinity,
    remaining,
    limit,
  }
}
```

### 2.4 Stripe Integration

**Subscription Checkout:**
```typescript
// app/api/create-checkout/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: { userId },
  })

  return Response.json({ url: session.url })
}
```

**Webhook Handler:**
```typescript
// app/api/stripe-webhook/route.ts
export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'checkout.session.completed':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object)
      break
  }

  return Response.json({ received: true })
}
```

---

## Phase 3: Scale & Features (Months 5-8)

### 3.1 Public API

**API Route Structure:**
```
/api/v1/
  /analyze         POST - Run analysis
  /analyses        GET  - List user's analyses
  /analyses/[id]   GET  - Get specific analysis
  /compare         POST - Compare multiple analyses
  /usage           GET  - Get usage stats
```

**API Authentication:**
```typescript
// lib/api-auth.ts
export async function validateApiKey(key: string): Promise<{
  valid: boolean
  userId?: string
}> {
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  })

  if (!apiKey || apiKey.revokedAt) {
    return { valid: false }
  }

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  })

  return { valid: true, userId: apiKey.userId }
}
```

**OpenAPI Documentation:**
```yaml
openapi: 3.0.0
info:
  title: Idea Analyzer API
  version: 1.0.0
paths:
  /api/v1/analyze:
    post:
      summary: Analyze a startup idea
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalysisRequest'
      responses:
        '200':
          description: Analysis result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalysisResponse'
```

### 3.2 Team/Collaboration Features

**Database Additions:**
```prisma
model Team {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  members   TeamMember[]
  analyses  Analysis[]
  createdAt DateTime @default(now())
}

model TeamMember {
  id     String   @id @default(cuid())
  teamId String
  team   Team     @relation(fields: [teamId], references: [id])
  userId String
  user   User     @relation(fields: [userId], references: [id])
  role   String   // 'owner', 'admin', 'member'
  @@unique([teamId, userId])
}
```

**Team Features:**
- Invite members by email
- Role-based permissions
- Shared analysis workspace
- Team activity feed
- Comments on analyses

### 3.3 Integrations

**Notion Integration:**
```typescript
// lib/integrations/notion.ts
import { Client } from "@notionhq/client"

export async function exportToNotion(
  accessToken: string,
  databaseId: string,
  analysis: Analysis
) {
  const notion = new Client({ auth: accessToken })

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: analysis.productName } }] },
      Score: { number: analysis.score },
      Verdict: { select: { name: analysis.verdict } },
      Date: { date: { start: analysis.createdAt.toISOString() } },
    },
    children: [
      // Markdown content blocks
    ],
  })
}
```

**Slack Integration:**
```typescript
// lib/integrations/slack.ts
export async function postAnalysisToSlack(
  webhookUrl: string,
  analysis: Analysis
) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: `Analysis: ${analysis.productName}` },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Score:* ${analysis.score}/10` },
            { type: 'mrkdwn', text: `*Verdict:* ${analysis.verdict}` },
          ],
        },
        // More blocks...
      ],
    }),
  })
}
```

### 3.4 Caching & Performance

**Redis Caching:**
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function getCachedAnalysis(hash: string) {
  const cached = await redis.get(`analysis:${hash}`)
  return cached ? JSON.parse(cached as string) : null
}

export async function cacheAnalysis(hash: string, result: any) {
  await redis.setex(`analysis:${hash}`, 86400, JSON.stringify(result)) // 24h
}

// Hash input for cache key
export function hashInput(input: any): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(input))
    .digest('hex')
    .slice(0, 16)
}
```

**Analysis Queue:**
```typescript
// For high-volume API usage
import { Queue } from 'bullmq'

const analysisQueue = new Queue('analysis', {
  connection: redis,
})

export async function queueAnalysis(input: AnalysisInput) {
  const job = await analysisQueue.add('analyze', input, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  })
  return job.id
}
```

---

## Phase 4: Enterprise (Months 9-12)

### 4.1 Multi-Tenant Architecture

**Tenant Isolation:**
```prisma
model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  plan        String   // 'starter', 'business', 'enterprise'
  settings    Json
  members     OrgMember[]
  teams       Team[]
  createdAt   DateTime @default(now())
}

model OrgMember {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  role           String       // 'owner', 'admin', 'member'
  @@unique([organizationId, userId])
}
```

**Row-Level Security (if using Supabase):**
```sql
CREATE POLICY "Users can only see their organization's data"
ON analyses
FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM org_members WHERE user_id = auth.uid()
  )
);
```

### 4.2 SSO/SAML

**SAML Integration with Auth.js:**
```typescript
// For enterprise customers
import SAMLStrategy from "passport-saml"

// Custom SAML provider configuration
const samlConfig = {
  entryPoint: "https://idp.customer.com/sso/saml",
  issuer: "idea-analyzer",
  callbackUrl: "https://ideaanalyzer.com/api/auth/saml/callback",
  cert: process.env.SAML_CERT,
}
```

### 4.3 Audit Logging

**Audit Log Schema:**
```prisma
model AuditLog {
  id             String   @id @default(cuid())
  organizationId String
  userId         String
  action         String   // 'analysis.created', 'member.invited', etc.
  resourceType   String
  resourceId     String
  metadata       Json
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime @default(now())
  @@index([organizationId, createdAt])
}
```

**Audit Middleware:**
```typescript
// lib/audit.ts
export async function logAuditEvent({
  organizationId,
  userId,
  action,
  resourceType,
  resourceId,
  metadata,
  request,
}: AuditEventParams) {
  await prisma.auditLog.create({
    data: {
      organizationId,
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    },
  })
}
```

### 4.4 Data Export & Compliance

**GDPR Data Export:**
```typescript
// app/api/account/export/route.ts
export async function POST(req: Request) {
  const session = await getServerSession()

  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      analyses: true,
      subscriptions: true,
      // All related data
    },
  })

  return Response.json(userData, {
    headers: {
      'Content-Disposition': `attachment; filename="data-export-${Date.now()}.json"`,
    },
  })
}
```

**Data Deletion:**
```typescript
// app/api/account/delete/route.ts
export async function DELETE(req: Request) {
  const session = await getServerSession()

  // Soft delete for audit trail
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      deletedAt: new Date(),
      email: `deleted-${session.user.id}@deleted.local`,
      name: '[Deleted User]',
    },
  })

  // Hard delete after retention period (background job)

  return Response.json({ success: true })
}
```

---

## AI Infrastructure Evolution

### Current State
- Direct Claude API calls per analysis
- ~$0.10-0.20 per analysis cost
- No caching or optimization

### Optimizations

**1. Prompt Caching:**
```typescript
// Cache the system prompt since it's constant
const systemPromptHash = hashContent(SYSTEM_PROMPT)
const cachedPrompt = await getCachedPrompt(systemPromptHash)
```

**2. Streaming Responses:**
```typescript
// app/api/analyze-stream/route.ts
export async function POST(req: Request) {
  const { productSpec, founderContext } = await req.json()

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: buildPrompt(...) }],
  })

  return new Response(stream.toReadableStream())
}
```

**3. Dimension-Level Caching:**
Cache individual dimension analyses that are similar across ideas.

**4. Model Selection by Tier:**
```typescript
const modelByTier = {
  free: 'claude-3-haiku',      // Cheaper, faster
  pro: 'claude-sonnet-4-20250514',  // Better quality
  enterprise: 'claude-sonnet-4-20250514', // Best available
}
```

---

## Infrastructure Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────┐
│                    Development                       │
├─────────────────────────────────────────────────────┤
│  Next.js Dev Server (localhost:3000)                │
│  PostgreSQL (Docker/local)                          │
│  Redis (Docker/local or Upstash)                    │
│  Anthropic API (direct)                             │
└─────────────────────────────────────────────────────┘
```

### Production Environment (Initial)
```
┌─────────────────────────────────────────────────────┐
│                    Vercel                            │
├─────────────────────────────────────────────────────┤
│  Next.js App (Edge + Serverless)                    │
│  API Routes                                         │
│  Static Assets (Edge CDN)                           │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Supabase   │ │   Upstash    │ │  Anthropic   │
│  PostgreSQL  │ │    Redis     │ │     API      │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Production Environment (Scale)
```
┌─────────────────────────────────────────────────────┐
│                    Cloudflare                        │
│            (CDN, DDoS, WAF)                         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    Vercel                            │
│  Next.js (Edge Runtime)                             │
│  Serverless Functions                               │
└──────────────────────┬──────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ▼                  ▼                  ▼
┌────────────┐  ┌────────────┐  ┌────────────────────┐
│  Supabase  │  │  Upstash   │  │      BullMQ        │
│ PostgreSQL │  │   Redis    │  │  (Job Processing)  │
└────────────┘  └────────────┘  └────────────────────┘
                                         │
                               ┌─────────▼─────────┐
                               │    Anthropic      │
                               │       API         │
                               └───────────────────┘
```

---

## Security Considerations

### Application Security
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input validation/sanitization
- [ ] SQL injection prevention (Prisma handles)
- [ ] XSS prevention
- [ ] Content Security Policy
- [ ] HTTPS only

### Data Security
- [ ] Encryption at rest (database)
- [ ] Encryption in transit (HTTPS)
- [ ] API key hashing
- [ ] Secure session management
- [ ] Regular security audits

### Compliance Preparation
- [ ] GDPR data export
- [ ] Data deletion capability
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent
- [ ] Audit logging

---

## Deployment Checklist

### Pre-Launch
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate active
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (PostHog) configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

### Launch Day
- [ ] DNS propagation confirmed
- [ ] Health checks passing
- [ ] Error rates normal
- [ ] Performance acceptable
- [ ] Auth flows working
- [ ] Payment flows working

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Address critical bugs
- [ ] Scale as needed

---

## Cost Projections

### Initial (Hobby)
| Service | Cost/Month |
|---------|------------|
| Vercel (Hobby) | $0 |
| Supabase (Free) | $0 |
| Upstash (Free) | $0 |
| Anthropic API | ~$20-50 |
| Domain | ~$1 |
| **Total** | ~$25-55 |

### Growing (1K Users)
| Service | Cost/Month |
|---------|------------|
| Vercel (Pro) | $20 |
| Supabase (Pro) | $25 |
| Upstash (Pro) | $10 |
| Anthropic API | ~$100-200 |
| Email (Resend) | $20 |
| Monitoring | $30 |
| **Total** | ~$210-310 |

### Scale (10K Users)
| Service | Cost/Month |
|---------|------------|
| Vercel (Team) | $100 |
| Supabase (Pro) | $75 |
| Upstash (Enterprise) | $50 |
| Anthropic API | ~$500-1000 |
| Email | $50 |
| Monitoring | $100 |
| Security | $100 |
| **Total** | ~$1,000-1,500 |

---

## Technology Decision Summary

| Layer | Choice | Alternative |
|-------|--------|-------------|
| Framework | Next.js 16+ | Remix, SvelteKit |
| Database | PostgreSQL/Supabase | PlanetScale, Neon |
| ORM | Prisma | Drizzle, TypeORM |
| Auth | NextAuth.js | Clerk, Auth0 |
| Cache | Upstash Redis | Redis Cloud |
| Payments | Stripe | Paddle, LemonSqueezy |
| Hosting | Vercel | Railway, Render |
| AI | Claude API | OpenAI, local models |
| Analytics | PostHog | Mixpanel, Amplitude |
| Errors | Sentry | Bugsnag |

---

*Roadmap updated January 2026*

# GoodCraft Bundle (The Workshop) – Founder Roadmap Workbook

This workbook is the single source of truth for designing, building, and launching GoodCraft Bundle as a unified venture. It is not a pitch deck. It is not marketing copy. It is an execution guide.

You do not add products unless they clearly support the core thesis: being the complete professional toolkit for Webflow developers.

---

## SECTION 1. THE THESIS (LOCKED)

### The Problem
Webflow developers do not fail because they lack design skills. They fail because their professional workflows are fragmented.

Image optimization requires separate tools. Script management is scattered across embed fields. CMS setup is tediously manual. The result: inefficient workflows, slow sites, and frustrated developers.

### The Insight
Webflow developers need a unified professional toolkit—not point solutions.
One platform. Three essential capabilities. Zero friction between them.

### The Product Definition
A professional development platform for Webflow that unifies:

**Transform (Images)**
- Multi-format image optimization (WebP, AVIF, JPEG, PNG)
- Direct Webflow deployment + global CDN
- Core Web Vitals improvement on autopilot

**Script (Code)**
- Professional code editor with Git sync
- Reusable component library (Blocks/Kits)
- Conditional script loading

**Manage (CMS)**
- AI-powered CMS field detection
- Google Sheets bidirectional sync
- Design QA (Polish Checker)

**Together = The Workshop**
Complete infrastructure for Webflow professionals.

---

## SECTION 2. WHO THIS IS FOR (AND WHO IT IS NOT)

### Ideal User
- Webflow agencies managing 5+ client sites
- Professional developers building CMS-heavy sites
- Performance-conscious teams optimizing Core Web Vitals
- Developers who want Git-backed workflows
- Anyone who values automation over manual repetition

### Explicitly Not For
- Webflow beginners building their first site
- Static site builders without custom code or CMS
- Teams with enterprise CDN/DAM infrastructure
- Developers who prefer manual control over everything

If someone builds one simple site per year, they are not the customer.

---

## SECTION 3. CATEGORY & POSITIONING

### Category Name
Professional Development Platform for Webflow

### Positioning Statement
This is not a collection of utilities.
This is not "three apps bundled for a discount."
This is the professional infrastructure Webflow developers deserve.

One platform. Images. Scripts. CMS. Done.

---

## SECTION 4. CORE PRODUCT PRINCIPLES

1. **Unified over fragmented** – One login, one dashboard, shared context
2. **Professional-grade over DIY** – Tools worthy of agency workflows
3. **Automation over repetition** – AI and sync replace manual work
4. **Performance built-in** – Fast images, conditional loading, optimized delivery
5. **Team-ready** – Roles, permissions, audit trails
6. **Webflow-native** – Deep integration, not generic utilities

If a Webflow developer needs to leave the ecosystem for professional tooling, we failed.

---

## SECTION 5. BUNDLE COMPONENTS

### 5.1 GoodCraft Transform (Image Optimization)

**Core Features:**
- Multi-format optimization (WebP, AVIF, JPEG, PNG)
- Batch processing with client-side cropping
- Direct upload to Webflow CMS
- Bunny.net CDN with global edge delivery
- Compression metrics and storage tracking
- BYOC (Bring Your Own CDN) for enterprise

**Tech Stack:** Next.js 16, Sharp 0.34.4, Bunny.net CDN, Redis rate limiting

**Production Readiness:** 9.5/10 (107 tests, 68% coverage, GDPR compliant)

### 5.2 GoodCraft Script (Code Management)

**Core Features:**
- Full CodeMirror 6 editor with 8 themes
- Bidirectional Git sync (GitHub/GitLab)
- Reusable Blocks and curated Kits
- Conditional script loading (page/component/selector)
- Head tags and external resource management
- Complete version history with diffing

**Tech Stack:** Next.js 16, CodeMirror 6, PostgreSQL, Drizzle ORM

**Production Readiness:** 8/10 (Core complete, Git edge cases in progress)

### 5.3 GoodCraft Manage (CMS Operations)

**Core Features:**
- AI-powered field detection (screenshot/HTML to schema)
- Google Sheets bidirectional sync
- Sample data generation and CSV import
- Polish Checker (design QA)
- URL redirect management
- Browser extension with API keys

**Tech Stack:** Next.js 16, Google Gemini 2.0 Flash, Google Sheets API, PostgreSQL

**Production Readiness:** 8.5/10 (MVP complete, UI refinement in progress)

---

## SECTION 6. WHAT IS EXCLUDED (V1)

Do not build:
- Webflow site builder/editor functionality
- npm package management (CDN dependencies only)
- Video optimization
- A/B testing or analytics platforms
- Non-Webflow CMS integrations
- Visual no-code builders
- AI image generation

Stay focused on professional Webflow workflows.

---

## SECTION 7. UNIFIED TECH STACK

### Frontend (Shared)
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### Backend (Shared)
- PostgreSQL (Neon)
- Drizzle ORM
- Next.js API Routes / Server Actions

### Authentication (Shared)
- Clerk (multi-team, org-based)

### External Integrations
- Webflow Data API v2
- GitHub/GitLab APIs (Script)
- Google Sheets API + OAuth 2.0 (Manage)
- Google Generative AI - Gemini 2.0 Flash (Manage)
- Bunny.net CDN (Transform)
- Stripe (payments)

### Monitoring (Shared)
- Sentry
- Better Stack
- PostHog

### Deployment
- Render (primary)
- Vercel (alternative)
- Docker with Node.js 20 LTS

---

## SECTION 8. PRICING MODEL

### Individual Products

**Transform**
| Tier | Price | Images/mo | Storage |
|------|-------|-----------|---------|
| Free | $0 | 50 | 500 MB |
| Default | $8/mo | 500 | 5 GB |
| Plus | $15/mo | 2,000 | 20 GB |
| Pro | $29/mo | 10,000 | 100 GB |

**Script**
| Tier | Price | Sites | Features |
|------|-------|-------|----------|
| Free | $0 | 2 | Editor, themes, conditional loading |
| Unlimited | $6/mo | Unlimited | Git sync, Blocks, Kits |

**Manage**
| Tier | Price | Sites | Features |
|------|-------|-------|----------|
| Free | $0 | 1 | Basic CMS, 10 AI detections |
| Pro | $12/mo | Unlimited | Sheets sync, bulk operations |
| Team | $29/mo | Unlimited | Polish Checker, API, audit logs |

### The Workshop Bundle
| Tier | Price | Includes |
|------|-------|----------|
| Workshop | **$15/mo** | Transform Plus + Script Unlimited + Manage Pro |
| Workshop Annual | **$150/yr** | Save 17% |

**Bundle Value:**
- Individual total: $8 + $6 + $12 = $26/month
- Bundle price: $15/month
- Savings: **42%**

### Enterprise
- Custom pricing
- BYOC (Bring Your Own CDN)
- SSO integration
- SLA guarantees
- Dedicated support

---

## SECTION 9. LANDING PAGE STRUCTURE

### Headline
The Professional Toolkit for Webflow

### Subhead
Optimize images. Manage scripts. Automate CMS. One platform, three essential tools, built for Webflow developers who ship.

### CTA
Start Free | Get The Workshop

### Page Flow

1. **Problem Statement**
   - Webflow gives you design. We give you the developer infrastructure.

2. **Three Pillars**
   - Transform: "Fast images, zero effort"
   - Script: "Professional code, version controlled"
   - Manage: "CMS on autopilot"

3. **The Bundle Pitch**
   - "Get all three for less than two. The Workshop: $15/month."

4. **Social Proof**
   - Testimonials from Webflow agencies
   - Core Web Vitals improvement stats
   - "Time saved" metrics

5. **Pricing Comparison**
   - Individual vs. Bundle
   - Competitor comparison (implicit)

### Philosophy
Lead with Transform (broadest appeal), introduce Script and Manage as complementary, close with bundle value.

---

## SECTION 10. LEGAL & COMPLIANCE

### Data Handling
- User images processed and stored on CDN with retention policies
- Code stored in database, synced to user's Git repos
- CMS operations performed via user's Webflow API tokens
- Google Sheets accessed via OAuth with explicit scopes

### Security
- API keys encrypted with HashiCorp Vault
- Account lockout after failed attempts
- Password validation (zxcvbn + HIBP)
- Full audit logging across all products
- GDPR compliant (data export, deletion)

### Scope
- Never modifies Webflow sites without user action
- Never stores Webflow admin credentials
- All AI suggestions require user confirmation
- Scripts served via CDN, not executed by platform

---

## SECTION 11. DISTRIBUTION STRATEGY

### Primary Channels

1. **Cross-Sell Existing Users**
   - Each product promotes the others
   - Bundle upsell in dashboards
   - Email campaigns to existing users

2. **Content Marketing**
   - Core Web Vitals case studies (Transform)
   - "Git for Webflow" tutorials (Script)
   - AI field detection demos (Manage)

3. **Community Presence**
   - Webflow Forum (tutorials, support)
   - Twitter/X (build in public)
   - YouTube (demo videos)

4. **ProductHunt Launch**
   - Launch bundle as unified offering
   - Leverage visual proof from Transform

### Channel Priority

| Channel | Priority | Best For |
|---------|----------|----------|
| Cross-sell | Highest | Immediate conversion |
| YouTube | High | Demo-heavy features |
| Twitter/X | High | Community building |
| ProductHunt | High | Launch moment |
| Webflow Forum | Medium | Support + discovery |
| SEO | Medium | Long-term organic |

### No Paid Ads (Initially)
Focus on organic growth and cross-sell until PMF is validated.

---

## SECTION 12. CURRENT STATE & NEXT STEPS

### Production Readiness

| Product | Status | Readiness |
|---------|--------|-----------|
| Transform | Production | 9.5/10 |
| Manage | MVP Complete | 8.5/10 |
| Script | Core Complete | 8/10 |

### Completed Across Products
- Clerk authentication (shared)
- PostgreSQL/Drizzle databases
- Webflow API integration
- Stripe subscription management
- Rate limiting and monitoring
- Core feature sets

### In Progress
- Git edge case handling (Script)
- UI/UX refinement (all)
- Polish Checker enhancements (Manage)

### Next Phase (Bundle-Specific)
- Unified dashboard/navigation
- Cross-product onboarding
- Bundle-specific billing flows
- Shared analytics dashboard

---

## SECTION 13. FOUNDER RULES

1. Do not build features that fragment the workflow
2. Do not compete with Webflow—complement it
3. Do not sacrifice individual product quality for bundle marketing
4. Do not overwhelm users with complexity
5. Do not break cross-product consistency
6. Do not add products that don't serve the core Webflow developer

Your job is to make Webflow developers feel professionally equipped.

---

## SECTION 14. SUCCESS METRICS

### Bundle-Specific Metrics
- Workshop bundle adoption rate (% of paying users)
- Cross-product activation (users of 2+ products)
- Bundle LTV vs. single-product LTV
- Churn rate: bundle vs. individual

### Per-Product Health
- Transform: Compression ratio >60%, CDN uptime >99.9%
- Script: Git sync success >99%, Blocks per user
- Manage: AI detection accuracy >90%, Sheets sync reliability

### Business Milestones
| Milestone | Target |
|-----------|--------|
| $5K MRR | 6-9 months |
| $15K MRR | 12-18 months |
| $50K MRR | 24-36 months |
| 50% bundle adoption | 12 months |

---

## SECTION 15. STRATEGIC ADVANTAGES OF BUNDLING

### 1. Distribution Leverage
Each product is a customer acquisition channel for the others. Transform users discover Script. Script users discover Manage. Bundle captures full value.

### 2. Increased LTV
- Single product ARPU: ~$10/month
- Bundle ARPU: $15/month
- Bundle users have higher retention (more integrated into workflow)

### 3. Competitive Moat
No competitor offers all three capabilities. To match the bundle, a competitor needs to build or acquire three products.

### 4. Reduced Churn
Workflow integration across products increases switching costs. Leaving means finding three replacements.

### 5. Pricing Flexibility
Bundle anchors value. Can adjust individual pricing without changing bundle appeal.

---

## FINAL NOTE

This venture wins by being the obvious professional infrastructure for Webflow developers.

If an agency says "of course we use GoodCraft," you built it correctly.

---

## SECTION 16. GAPS TO FILL

### Bundle-Specific Decisions Needed

- [ ] **Unified Dashboard:** Single app or linked apps?
- [ ] **Shared Billing:** One Stripe subscription or linked subscriptions?
- [ ] **Cross-Product Features:** Priority for shared capabilities?
- [ ] **Brand Architecture:** "GoodCraft Workshop" vs. individual brands?
- [ ] **Enterprise Bundle:** Pricing and SLA for agency accounts?

### Validation Needed
- [ ] Bundle demand vs. individual products (survey existing users)
- [ ] Price sensitivity testing ($15 vs. $19 vs. $12)
- [ ] Cross-sell conversion rates
- [ ] Competitive positioning clarity

### Founder Context Needed
- [ ] Time allocation across three products
- [ ] Revenue targets for bundle vs. individual
- [ ] Exit strategy (lifestyle vs. acquisition)
- [ ] Hiring plans if scale achieved

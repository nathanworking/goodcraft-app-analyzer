# GoodCraft Transform – Founder Roadmap Workbook

This workbook is the single source of truth for designing, building, and launching GoodCraft Transform. It is not a pitch deck. It is not marketing copy. It is an execution guide.

You do not add features unless they clearly support the core thesis: optimizing images for Webflow with zero friction.

---

## SECTION 1. THE THESIS (LOCKED)

### The Problem
Webflow developers do not fail because they cannot design. They fail because image optimization is a constant afterthought.

Large images kill performance. Manual optimization is tedious. Format conversion is confusing. CDN setup is complex. The result: slow sites and poor Core Web Vitals.

### The Insight
Image optimization should not be a separate workflow.
It should happen automatically on the way to Webflow.

### The Product Definition
An image optimization platform that:
- Optimizes images in multiple formats (WebP, AVIF, JPEG, PNG)
- Deploys directly to Webflow via API integration
- Uploads to a global CDN for fast delivery
- Tracks compression metrics and storage savings
- Supports teams with role-based access

Performance is not optional. It should be effortless.

---

## SECTION 2. WHO THIS IS FOR (AND WHO IT IS NOT)

### Ideal User
- Webflow developers building performance-conscious sites
- Agencies managing multiple client sites with heavy image content
- E-commerce operators with large product catalogs
- Marketing teams publishing image-heavy content
- Anyone who cares about Core Web Vitals

### Explicitly Not For
- Developers who manually optimize every image
- Sites with minimal image content
- Teams with existing enterprise image pipelines
- Anyone who does not use Webflow

If someone does not care about page speed, they are not the customer.

---

## SECTION 3. CATEGORY & POSITIONING

### Category Name
Image Optimization Platform for Webflow

### Positioning Statement
This is not a generic image compressor.
This is not a CDN-only solution.
This is not a manual batch tool.
This is an end-to-end image pipeline built for Webflow.

---

## SECTION 4. CORE PRODUCT PRINCIPLES

1. Automatic optimization over manual steps
2. Multiple formats (WebP, AVIF) over single format
3. Direct Webflow integration over download-and-upload
4. CDN delivery over origin serving
5. Team workflows over solo operation
6. Compression visibility over black-box processing

If users have to think about image optimization, you have failed.

---

## SECTION 5. MVP FEATURE SET (CURRENT)

### 5.1 Image Optimization Engine
- Multi-format output: WebP, AVIF, JPEG, PNG
- Batch processing (multiple images at once)
- Client-side image cropping
- Compression ratio calculation and display
- Original file preservation

### 5.2 Team Collaboration
- Multi-team support with shared workspaces
- Role-based access: OWNER, ADMIN, MEMBER, VIEWER
- Team member management
- Multi-site management per team

### 5.3 Site & Organization
- Connect multiple Webflow sites
- Organize images by folders
- Fine-grained permissions
- Per-site configuration

### 5.4 Webflow Integration
- Direct upload to Webflow CMS
- Site detection and info fetching
- Asset tracking for deployed images
- API key validation and testing

### 5.5 CDN & Storage
- Bunny.net CDN integration
- Global edge delivery
- Configurable cache TTL
- Ready-to-use CDN URLs
- Cache purging controls
- BYOC (Bring Your Own CDN) for enterprise

### 5.6 Analytics & Reporting
- Compression metrics per image
- Storage usage tracking against quotas
- Monthly processing counts
- Complete audit logging

### 5.7 Subscription & Billing
- Tiered plans: FREE, TRIAL, DEFAULT, PLUS, PRO, BYOC, ENTERPRISE
- Stripe integration for payments
- Usage quotas (monthly images, storage)
- Team member limits per tier
- 7-day trial period

### 5.8 Security & Compliance
- Account lockout (5 failed attempts = 15 min lockout)
- Password validation (zxcvbn + HIBP checking)
- Email verification required
- GDPR compliance (data export, retention policies)
- Full audit logging
- Redis-based rate limiting
- API keys encrypted with HashiCorp Vault

---

## SECTION 6. WHAT IS EXCLUDED (V1)

Do not build:
- Image editing beyond cropping (filters, effects)
- AI image generation or enhancement
- Video optimization
- Automatic image replacement on live sites
- Performance monitoring dashboards
- A/B testing for images
- WordPress or other CMS integrations

Stay focused on the Webflow image optimization workflow.

---

## SECTION 7. TECH STACK (CURRENT)

### Frontend
- Next.js 16.0.0 (App Router, Turbopack)
- React 19.2.0
- TypeScript 5.9.2
- Tailwind CSS 4
- Untitled UI components
- Motion (animations)

### Backend
- Next.js API Routes
- PostgreSQL 16
- Drizzle ORM 0.44.7
- Sharp 0.34.4 (image processing)
- Redis (Upstash) for caching/rate limiting

### Auth
- Clerk (migrated from NextAuth)
- API token management for desktop app
- Device authorization codes for OAuth-like flow

### CDN & Storage
- Bunny.net CDN
- BYOC support for enterprise

### Payments
- Stripe 19.2.1

### Monitoring
- Sentry 10.25.0
- Better Stack (logging)
- PostHog (analytics)
- Gleap (feedback)

### Security
- HashiCorp Vault (secrets encryption)
- zxcvbn (password strength)
- HIBP (password breach checking)

### Testing
- Vitest 4.0.10 (107 tests, 68% coverage)
- Playwright 1.57.0 (E2E)
- k6 (load testing)

### Deployment
- Render (primary)
- Vercel (alternative)
- Docker (Node.js 20 LTS)
- GitHub Actions CI/CD

---

## SECTION 8. PRICING MODEL

### Suggested Pricing Structure (Based on Tier Names Found)

**FREE Tier**
- $0
- 50 images/month
- 500 MB storage
- WebP + JPEG output
- 1 Webflow site

**TRIAL**
- 7-day access to Pro features
- Full feature trial

**DEFAULT (Starter)**
- $8/month or $80/year
- 500 images/month
- 5 GB storage
- All formats (WebP, AVIF, JPEG, PNG)
- 3 Webflow sites
- CDN delivery

**PLUS**
- $15/month or $150/year
- 2,000 images/month
- 20 GB storage
- Unlimited Webflow sites
- Team collaboration (3 members)
- Priority support

**PRO**
- $29/month or $290/year
- 10,000 images/month
- 100 GB storage
- Unlimited team members
- API access
- Advanced analytics
- Priority support

**BYOC (Enterprise)**
- Custom pricing
- Bring Your Own CDN
- Unlimited everything
- SLA guarantees
- Custom integrations

### Bundle (The Workshop)
- $15/month
- Script + Transform + Manage

---

## SECTION 9. LANDING PAGE STRUCTURE

### Headline
Image Optimization for Webflow, On Autopilot

### Subhead
Optimize, convert, and deploy images directly to Webflow. WebP, AVIF, global CDN—all in one workflow.

### CTA
Start Free

### Supporting Elements
- Before/after compression comparison (visual)
- Format conversion visualization
- CDN speed demonstration (global map)
- Webflow integration flow diagram
- Core Web Vitals improvement showcase

Philosophy: Show the performance gains, make the workflow obvious.

---

## SECTION 10. LEGAL & COMPLIANCE GUARDRAILS

You are processing user-uploaded images.
You are storing optimized versions on CDN.

The system:
- Never stores images longer than necessary (retention policies)
- Supports GDPR data export requests
- Encrypts API keys at rest (Vault)
- Does not access Webflow admin beyond authorized scope
- Logs all operations for audit

Users own their images. You optimize and deliver.

---

## SECTION 11. FIRST USERS & DISTRIBUTION

You do not run ads.

You:
- Target Webflow developers concerned with performance
- Create Core Web Vitals improvement case studies
- Demonstrate compression ratios in tutorials
- Leverage existing Script/Manage user base
- Partner with Webflow performance consultants

Show the speed gains, and users will convert.

---

## SECTION 12. CURRENT STATE & NEXT STEPS

### Completed (Production Readiness: 9.5/10)
- Complete database schema with Drizzle ORM
- Clerk authentication integration
- Sharp-based image optimization engine
- Multi-format output (WebP, AVIF, JPEG, PNG)
- Bunny.net CDN integration
- Webflow API integration
- Stripe subscription management
- Redis rate limiting
- Vault encryption for secrets
- Comprehensive test suite (107 tests, 68% coverage)
- Docker deployment configuration
- GitHub Actions CI/CD
- Sentry error monitoring
- GDPR compliance features

### In Progress
- UI/UX refinement
- Performance optimization
- Enhanced analytics

### Next Phase
- Desktop app (using device auth codes)
- Bulk optimization workflows
- Advanced reporting

---

## SECTION 13. FOUNDER RULES

1. Do not sacrifice image quality for file size
2. Do not complicate the Webflow workflow
3. Do not store images without clear retention
4. Do not break CDN reliability
5. Do not add features that slow down optimization

Your job is to make images fast without users noticing.

---

## SECTION 14. SUCCESS METRICS

Success is not features shipped.

Success is:
- Average compression ratio > 60%
- Time from upload to CDN < 5 seconds
- Webflow deployment success rate > 99%
- Customer sites' Core Web Vitals improvement (LCP)
- Storage quota utilization (indicates value)
- Upgrade rate from free to paid tiers

---

## FINAL NOTE

This product wins by making fast images the default, not the exception.

If developers forget they have an image optimization step, you built it correctly.

---

## SECTION 15. GAPS TO FILL

The following items need founder input or validation before analysis can be fully accurate:

### Pricing (SUGGESTED - Needs Validation)
- [ ] Validate pricing tiers against actual tier names in codebase
- [ ] Confirm image/storage limits per tier
- [ ] Validate BYOC pricing model for enterprise
- [ ] Consider usage-based pricing for high-volume users

### Distribution Strategy (NEEDS INPUT)
- [ ] Define specific content marketing channels
- [ ] Identify Core Web Vitals-focused communities
- [ ] Plan cross-sell strategy from Script/Manage users
- [ ] Define partnership opportunities (Webflow agencies, performance consultants)

### Success Metrics (NEEDS VALIDATION)
- [ ] Current MRR and user counts?
- [ ] Actual compression ratios achieved?
- [ ] CDN delivery performance metrics?
- [ ] Churn rates by tier?

### Competitive Positioning (NEEDS RESEARCH)
- [ ] Direct competitors in Webflow image optimization?
- [ ] How does pricing compare to Cloudinary, ImageKit, etc.?
- [ ] What's the unique value vs. generic image CDNs?

### Desktop App (NEEDS TIMELINE)
- [ ] Priority level for desktop app development?
- [ ] Target release timeline?
- [ ] Key features for desktop version?

### Founder Context (NEEDED FOR ANALYSIS)
- [ ] Time commitment available for this product
- [ ] Primary goal (lifestyle business vs. venture scale)
- [ ] Existing audience/distribution for Webflow tools
- [ ] Current revenue and growth trajectory
- [ ] Risk tolerance and runway

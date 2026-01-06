# GoodCraft Manage – Founder Roadmap Workbook

This workbook is the single source of truth for designing, building, and launching GoodCraft Manage. It is not a pitch deck. It is not marketing copy. It is an execution guide.

You do not add features unless they clearly support the core thesis: reducing friction in Webflow CMS setup and content operations.

---

## SECTION 1. THE THESIS (LOCKED)

### The Problem
Webflow developers do not fail because they cannot build great sites. They fail because CMS setup is tedious and time-consuming.

Manually creating collections. Guessing field types. Copy-pasting content. Keeping external data in sync. Reviewing sites for design inconsistencies.

### The Insight
CMS setup should not require manual configuration.
AI can detect structure from designs and automate the tedious work.

### The Product Definition
A Webflow CMS management platform that:
- Uses AI to detect collection fields from designs or HTML
- Automates sample data generation and bulk imports
- Syncs Webflow collections with Google Sheets
- Analyzes sites for design inconsistencies (Polish Checker)
- Provides a centralized dashboard for all CMS operations

Automation is the antidote to tedium.

---

## SECTION 2. WHO THIS IS FOR (AND WHO IT IS NOT)

### Ideal User
- Webflow developers building CMS-heavy sites
- Agencies with repeatable CMS patterns across clients
- Content teams managing data in Google Sheets
- Designers who want design QA without manual review
- Teams with multiple Webflow sites to manage

### Explicitly Not For
- Static site builders who do not use Webflow CMS
- Developers who prefer manual control over everything
- One-off projects with minimal content needs
- Anyone who does not value automation

If someone enjoys manual CMS setup, they are not the customer.

---

## SECTION 3. CATEGORY & POSITIONING

### Category Name
CMS Management & Design QA Platform for Webflow

### Positioning Statement
This is not a Webflow dashboard clone.
This is not a simple content importer.
This is not a visual inspection tool.
This is an AI-powered operations center for Webflow sites.

---

## SECTION 4. CORE PRODUCT PRINCIPLES

1. AI-assisted over manual entry
2. Bulk operations over one-at-a-time
3. External data sync over copy-paste
4. Automated QA over visual inspection
5. Team workflows over solo operation
6. Speed over perfection

If a feature requires users to do tedious work, find a way to automate it.

---

## SECTION 5. MVP FEATURE SET (CURRENT)

### 5.1 Site Connection
- Connect Webflow sites via API token
- Validate tokens automatically
- Support multiple sites per team
- Team-based access control with roles

### 5.2 Collection Management
- List all collections from connected sites
- Create new collections
- Delete collections
- View collection items
- Publish/unpublish content

### 5.3 AI-Powered Field Detection
- Upload design screenshots → auto-detect CMS fields
- Paste HTML → auto-detect fields and structure
- Uses Google Gemini 2.0 Flash
- Detects field types (PlainText, RichText, Image, DateTime, etc.)
- Suggests collection names and field requirements
- Creates collections with detected schema

### 5.4 Content Operations
- **Sample Data Generation**: Create realistic test data for collections
- **CSV Import**: Bulk upload items with column mapping
- **Item Extraction**: Parse individual items and map to fields

### 5.5 Google Sheets Sync
- Connect Google Sheets to Webflow collections
- Bi-directional data sync
- Field mapping between columns and Webflow fields
- Sync history and error tracking
- Auto-sync capability
- Automatic slug generation

### 5.6 URL Redirects
- Create and manage URL redirects
- Bulk redirect operations
- Track redirect history

### 5.7 Design QA (Polish Checker)
- Analyze sites for design inconsistencies
- **Typography analysis**: font sizes, weights, line heights
- **Spacing analysis**: margins, padding against design scale
- **Color consistency analysis**
- **Border radius consistency**
- Severity levels: Critical, High, Medium, Low
- Browser extension integration via API keys
- Issue tracking and resolution

### 5.8 Team Management
- Multi-team support
- Role-based access (owner, admin, member)
- API key management for extensions

---

## SECTION 6. WHAT IS EXCLUDED (V1)

Do not build:
- Webflow site builder/editor functionality
- Content scheduling or publishing workflows
- SEO analysis or optimization
- Performance monitoring
- Backup and restore functionality
- Multi-language CMS translation
- Visual design system editor

Focus on CMS operations before expanding scope.

---

## SECTION 7. TECH STACK (CURRENT)

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Base UI Components

### Backend
- Next.js API Routes
- PostgreSQL (Neon)
- Drizzle ORM

### Auth
- Clerk

### AI
- Google Generative AI (Gemini 2.0 Flash)
- Anthropic Claude (fallback)

### External APIs
- Webflow Data API v2
- Google Sheets API
- Google OAuth 2.0

### Monitoring
- BetterStack / Sentry

### Deployment
- Render

---

## SECTION 8. PRICING MODEL

### Suggested Pricing (Based on Value Delivered)

**Free Tier**
- $0
- 1 Webflow site
- 10 AI field detections/month
- Basic collection management
- CSV import (100 items/month)

**Pro Tier**
- $12/month or $120/year (Save 17%)
- Unlimited Webflow sites
- Unlimited AI field detections
- Google Sheets sync
- Bulk operations
- Sample data generation
- Priority support

**Team Tier**
- $29/month or $290/year (Save 17%)
- Everything in Pro
- Up to 5 team members
- Polish Checker (Design QA)
- API access
- Audit logs

### Bundle (The Workshop)
- $15/month
- Script + Transform + Manage

Annual billing preferred to align with agency/team workflows.

---

## SECTION 9. LANDING PAGE STRUCTURE

### Headline
CMS Setup on Autopilot

### Subhead
AI-powered field detection. Bulk imports. Google Sheets sync. Design QA. Everything you need to manage Webflow CMS efficiently.

### CTA
Start Free

### Supporting Elements
- AI field detection demo (screenshot to schema in seconds)
- Google Sheets sync workflow visualization
- Polish Checker issue examples
- Time savings comparison (hours → minutes)

Philosophy: Show the automation, demonstrate the time saved.

---

## SECTION 10. LEGAL & COMPLIANCE GUARDRAILS

You are acting on behalf of authenticated Webflow users.
You are using their API tokens to perform operations they authorize.

The system:
- Never stores Webflow credentials (only API tokens)
- Requires explicit user action for destructive operations
- Logs all operations for audit purposes
- Does not modify sites without user initiation

AI suggestions are suggestions. The user decides what to create.

---

## SECTION 11. FIRST USERS & DISTRIBUTION

You do not run ads.

You:
- Target Webflow CMS-heavy project creators
- Demonstrate AI field detection in tutorials
- Share Google Sheets sync workflows
- Leverage existing Transform/Script user base
- Build integrations that solve real workflow problems

Show the time savings, and users will find you.

---

## SECTION 12. CURRENT STATE & NEXT STEPS

### Completed
- Database schema with all core entities
- Clerk authentication and team management
- Webflow API integration
- AI field detection (Gemini)
- Sample data generation
- CSV import functionality
- Google Sheets sync with OAuth
- Polish Checker implementation
- API key management
- Rate limiting and error monitoring

### In Progress
- UI/UX refinement
- Additional Polish analyzers
- Enhanced sync conflict handling

### Next Phase
- Content scheduling
- Multi-site bulk operations
- Advanced analytics

---

## SECTION 13. FOUNDER RULES

1. Do not replace Webflow's editor
2. Do not require users to leave Webflow
3. Do not overwhelm with AI—make it assistive
4. Do not break existing Webflow workflows
5. Do not store data that should live in Webflow

Your job is to make Webflow CMS setup effortless.

---

## SECTION 14. SUCCESS METRICS

Success is not feature count.

Success is:
- Time from design to published collection < 10 minutes
- AI field detection accuracy > 90%
- Google Sheets sync reliability > 99%
- Polish issues found per site scan
- Reduction in manual CMS setup time (measured via surveys)

---

## FINAL NOTE

This product wins by eliminating the tedious parts of Webflow CMS work.

If developers feel like they have a capable assistant, you built it correctly.

---

## SECTION 15. GAPS TO FILL

The following items need founder input or validation before analysis can be fully accurate:

### Pricing (SUGGESTED - Needs Validation)
- [ ] Validate Free tier limits (1 site, 10 AI detections reasonable?)
- [ ] Validate Pro pricing ($12/mo) against competitor pricing
- [ ] Validate Team tier value prop (Polish Checker as differentiator?)
- [ ] Consider usage-based pricing for AI operations

### Distribution Strategy (NEEDS INPUT)
- [ ] Define specific content marketing channels
- [ ] Identify target Webflow communities for outreach
- [ ] Plan cross-sell strategy from Transform/Script users
- [ ] Define partnership opportunities (Webflow agencies, etc.)

### Success Metrics (NEEDS VALIDATION)
- [ ] What specific KPIs are you tracking today?
- [ ] What does "success" look like at 6 months? 12 months?
- [ ] Revenue targets for each tier?

### Competitive Positioning (NEEDS RESEARCH)
- [ ] Who are the direct competitors in Webflow CMS tooling?
- [ ] What differentiates Manage from Webflow's native tools?
- [ ] How does Polish Checker compare to design QA alternatives?

### Founder Context (NEEDED FOR ANALYSIS)
- [ ] Time commitment available for this product
- [ ] Primary goal (lifestyle business vs. venture scale)
- [ ] Existing audience/distribution for Webflow tools
- [ ] Risk tolerance and runway

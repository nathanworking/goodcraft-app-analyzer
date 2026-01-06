# GoodCraft Script – Founder Roadmap Workbook

This workbook is the single source of truth for designing, building, and launching GoodCraft Script. It is not a pitch deck. It is not marketing copy. It is an execution guide.

You do not add features unless they clearly support the core thesis: empowering Webflow developers with professional-grade code management.

---

## SECTION 1. THE THESIS (LOCKED)

### The Problem
Webflow developers do not fail because they lack coding skills. They fail because their tools are inadequate.

Tiny embed fields. No version control. No syntax highlighting. No reusability. Code scattered across dozens of sites with no central source of truth.

### The Insight
Managing code across Webflow sites is not a Webflow problem.
It is a developer tooling problem.

### The Product Definition
A professional script management system that:
- Provides a real code editor with proper syntax highlighting
- Syncs bidirectionally with Git (GitHub/GitLab)
- Enables reusable components across sites
- Deploys scripts conditionally based on page or DOM elements
- Maintains complete version history and audit trails

Professional developers deserve professional tools.

---

## SECTION 2. WHO THIS IS FOR (AND WHO IT IS NOT)

### Ideal User
- Webflow developers managing 3+ client sites
- Agencies with repeatable code patterns across projects
- Developers who already use Git in their workflow
- Teams needing to share and standardize code components
- Performance-conscious developers optimizing script loading

### Explicitly Not For
- Webflow beginners who do not write custom code
- Designers who only use Webflow's native interactions
- One-off site builders with no need for reusability
- Anyone who does not value version control

If someone does not write JavaScript or CSS, they are not the customer.

---

## SECTION 3. CATEGORY & POSITIONING

### Category Name
Script Management Platform for Webflow

### Positioning Statement
This is not a code snippet tool.
This is not a Webflow custom code hack.
This is not a glorified text field.
This is a professional development environment for Webflow.

---

## SECTION 4. CORE PRODUCT PRINCIPLES

1. Developer experience over simplicity
2. Git as the source of truth
3. Reusability over duplication
4. Conditional loading over global bloat
5. Audit trails for everything
6. Performance optimization built in

If a feature does not make developers more efficient, it does not ship.

---

## SECTION 5. MVP FEATURE SET (CURRENT)

### 5.1 Code Editor
- Full CodeMirror 6 integration
- 8 theme options (One Dark, GitHub, Dracula, Nord, Solarized, etc.)
- JavaScript and CSS syntax highlighting
- Bracket matching and auto-indent
- Error checking and validation

### 5.2 Multi-Site Management
- Connect unlimited Webflow sites (paid tier)
- Dashboard overview of all sites
- Per-site script organization
- Team-based access control

### 5.3 Git Integration
- Bidirectional sync with GitHub and GitLab
- Webhook handlers for auto-sync on push
- Conflict detection and resolution UI
- Commit tracking and version history
- SHA-based change detection

### 5.4 Reusable Components (Blocks)
- Create individual code blocks (JS/CSS)
- Attach CDN dependencies to blocks
- Public and private visibility
- Install tracking across sites
- Category and tag organization

### 5.5 Curated Bundles (Kits)
- Combine multiple blocks into complete solutions
- Include setup instructions and documentation
- Webflow copy-paste snippets
- Source attribution and licensing
- Installation tracking

### 5.6 Conditional Script Loading
- Global scripts (all pages)
- Page-specific scripts
- Component selector-based loading (load only when DOM element exists)
- Head, body-start, body-end placement
- ES modules support
- DOM-ready wrapping option

### 5.7 External Resources (Head Tags)
- Manage external scripts and styles
- Analytics, tracking, third-party libraries
- Scope control (global, page, component)

### 5.8 Activity & Audit
- Complete version history with content diffing
- Activity logs for all changes
- User attribution
- Field-level change tracking

---

## SECTION 6. WHAT IS EXCLUDED (V1)

Do not build:
- npm package installation (use CDN dependencies instead)
- Visual script builder / no-code interface
- Performance analytics dashboard
- A/B testing functionality
- Script execution in preview mode
- Multi-language support beyond JS/CSS
- Webflow site cloning or templating

Professional simplicity before feature expansion.

---

## SECTION 7. TECH STACK (CURRENT)

### Frontend
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS v4
- CodeMirror 6

### Backend
- Next.js API Routes
- PostgreSQL with Drizzle ORM
- Server Actions

### Auth
- Clerk (multi-team, org-based)

### Deployment
- Vercel (primary)
- Render (alternative)

### CDN & Delivery
- Vercel Edge for script serving
- Bundling optimization

---

## SECTION 8. PRICING MODEL

### Free Tier
- $0
- 2 Webflow sites
- Full code editor
- All 8 themes
- Page-specific scripts
- Conditional loading

### Unlimited Tier
- $6/month or $60/year (Save 17%)
- Unlimited Webflow sites
- Git integration (GitHub/GitLab)
- Component library (Blocks)
- Curated bundles (Kits)
- Priority support

### Bundle (The Workshop)
- $15/month
- Script + Transform + Manage

Annual billing preferred to align with long-term developer relationships.

---

## SECTION 9. LANDING PAGE STRUCTURE

### Headline
Professional Script Management for Webflow

### Subhead
Write, version, and deploy custom JavaScript and CSS. Sync with Git, reuse components, and load scripts conditionally.

### CTA
Start Free

### Supporting Elements
- Problem/solution comparison (old way vs. Script way)
- Feature highlights with icons
- Use case examples
- Pricing table
- FAQ section

Philosophy: Show the developer experience, not just features.

---

## SECTION 10. LEGAL & COMPLIANCE GUARDRAILS

You are not hosting user websites.
You are not executing code on behalf of users.

The system:
- Serves static script files via CDN
- Does not modify Webflow sites directly
- Does not access Webflow admin credentials
- Stores only code content provided by users

All scripts are user-authored. The platform delivers, not decides.

---

## SECTION 11. FIRST USERS & DISTRIBUTION

You do not run ads.

You:
- Target Webflow developer communities (forums, Discord, Twitter)
- Create educational content about script management best practices
- Build in public and share the roadmap
- Leverage existing Transform/Manage user base
- Partner with Webflow agencies

Trust precedes scale.

---

## SECTION 12. CURRENT STATE & NEXT STEPS

### Completed
- Database schema with full relational structure
- Basic CRUD for all entities
- Clerk authentication and team management
- CodeMirror-based script editor
- Git sync architecture with webhooks
- Activity logging system
- Kits/Blocks foundation
- Responsive dashboard UI

### In Progress
- Complete Git integration UI refinement
- Advanced conflict resolution
- Enhanced error handling

### Next Phase
- Performance analytics (optional)
- Team collaboration features
- API for programmatic access

---

## SECTION 13. FOUNDER RULES

1. Do not add visual builders
2. Do not hide complexity from developers
3. Do not break Git sync reliability
4. Do not sacrifice performance for features
5. Do not compete with Webflow—complement it

Your job is to make Webflow developers feel like real developers.

---

## SECTION 14. SUCCESS METRICS

Success is not page views or signups.

Success is:
- Git sync completion rate > 99%
- Average sites per paid user > 5
- Block reuse rate across sites
- Time from signup to first deployed script
- Net Promoter Score from developers

---

## FINAL NOTE

This product wins by being the obvious choice for any Webflow developer who writes custom code.

If developers feel relief when they find it, you built it correctly.

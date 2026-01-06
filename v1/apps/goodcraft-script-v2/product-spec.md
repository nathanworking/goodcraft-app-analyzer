# GoodCraft Script

## SECTION 1. THE THESIS

### The Problem
Webflow's custom code fields are a joke. A tiny textarea with no syntax highlighting, no version control, no way to share code between sites. You paste code in, pray it works, and hope you remember what you changed when something breaks six months later.

### The Insight
This is the same problem every developer has faced since forever: code without proper tooling is chaos. Webflow solved the visual side brilliantly but left developers with notepad-level code management.

### The Product
A proper code editor and deployment system for Webflow. Write JavaScript and CSS in CodeMirror with real syntax highlighting. Sync with Git. Build a library of reusable components. Load scripts conditionally so you're not bloating every page with code meant for one.

---

## SECTION 2. WHO THIS IS FOR

### Ideal User
- Webflow developers who actually write custom code
- Agencies managing scripts across multiple client sites
- Developers who already use Git and want their Webflow code there too
- Teams that need to share and standardize code patterns

### Not For
- Webflow beginners learning the basics
- Designers who use native interactions only
- Anyone building a single site they'll never touch again

---

## SECTION 3. CATEGORY & POSITIONING

**Category:** Developer tooling for Webflow

**What it is:** A script management system with a real editor, Git sync, reusable components, and conditional loading.

**What it isn't:** A visual builder, a no-code solution, or a way to avoid writing code.

---

## SECTION 4. CORE PRODUCT PRINCIPLES

1. **Developer-first** — Built for people who write code, not people avoiding it
2. **Git is truth** — Your repository is the source, not some cloud dashboard
3. **Conditional by default** — Load code where it's needed, not everywhere
4. **Reusability** — Write once, use across sites
5. **Transparency** — Full version history and audit trails

---

## SECTION 5. MVP FEATURE SET

### Code Editor
- CodeMirror 6 with JavaScript and CSS support
- 8 theme options (One Dark, GitHub, Dracula, etc.)
- Proper bracket matching, auto-indent, error checking

### Site Management
- Connect multiple Webflow sites
- Per-site script organization
- Team-based access control

### Git Integration
- Bidirectional sync with GitHub and GitLab
- Webhook support for auto-sync on push
- Conflict detection and resolution
- Full commit history tracking

### Blocks (Reusable Components)
- Save individual JS/CSS as components
- Attach CDN dependencies
- Install across sites with one click
- Category and tag organization

### Kits (Curated Bundles)
- Combine blocks into complete solutions
- Include setup instructions and Webflow snippets
- Example: Modal + focus trap + keyboard handling = accessible dialog kit

### Conditional Loading
- Global scripts (all pages)
- Page-specific scripts (URL patterns with wildcards)
- Component-based scripts (only load when specific DOM element exists)
- Head, body-start, or body-end placement
- ES modules support
- Bundle optimization

### Activity Logging
- Complete version history
- Content diffing between versions
- User attribution for all changes

---

## SECTION 6. WHAT IS EXCLUDED (V1)

- npm package management (use CDN)
- Visual script builder
- Analytics dashboard
- A/B testing
- Preview mode execution
- Languages beyond JS/CSS

---

## SECTION 7. TECH STACK

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, CodeMirror 6

**Backend:** Next.js API Routes, PostgreSQL, Drizzle ORM

**Auth:** Clerk (multi-team)

**Deployment:** Vercel or Render

**Script Delivery:** Edge-optimized with bundling and aggressive caching

---

## SECTION 8. PRICING MODEL

### Free
- 2 sites
- Full editor
- Conditional loading
- All themes

### Unlimited ($6/month or $60/year)
- Unlimited sites
- Git sync
- Blocks and Kits library
- Priority support

### The Workshop Bundle ($15/month)
- Script + Transform + Manage

---

## SECTION 9. LANDING PAGE STRUCTURE

**Headline:** Professional script management for Webflow

**Subhead:** A real code editor. Git sync. Reusable components. Conditional loading.

**CTA:** Start Free

**Sections:**
1. The problem (show the tiny Webflow embed field)
2. The solution (show the full editor experience)
3. Key features with examples
4. Pricing
5. FAQ

---

## SECTION 10. LEGAL & COMPLIANCE

This is a script hosting and delivery service. We:
- Serve static files via CDN
- Store code content provided by users
- Do not modify Webflow sites directly
- Do not access Webflow admin credentials
- Do not execute code on behalf of users

Users own and are responsible for their code.

---

## SECTION 11. FIRST USERS & DISTRIBUTION

- Webflow developer communities (forums, Discord, X)
- Educational content about script management
- Build in public
- Existing Transform/Manage users
- Agency partnerships

No ads. Trust first.

---

## SECTION 12. EXECUTION PLAN

### Built
- Database schema with full relations
- CRUD for all entities
- Clerk auth with team management
- CodeMirror editor with themes
- Git sync with webhooks
- Activity logging
- Blocks and Kits foundation
- Responsive dashboard

### In Progress
- Git integration polish
- Conflict resolution improvements
- Error handling refinement

### Future
- Team collaboration features
- API access
- Performance analytics (maybe)

---

## SECTION 13. FOUNDER RULES

1. No visual builders — this is for developers
2. No hiding complexity — developers can handle it
3. Git sync must be rock solid
4. Performance over features
5. Complement Webflow, don't compete

---

## SECTION 14. SUCCESS METRICS

- Git sync reliability > 99%
- Sites per paid user > 5
- Block reuse rate across sites
- Time to first deployed script
- Whether developers recommend it to other developers

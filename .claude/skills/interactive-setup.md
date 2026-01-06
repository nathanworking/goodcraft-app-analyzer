# Interactive Setup Skill

Guide the user through filling out their Founder Context and Product Spec step-by-step. This is a conversational, guided experience.

## Workflow

### Step 1: Introduction
Explain that you'll walk them through two parts:
1. **Founder Context** - Who they are and what resources they have (6 sections)
2. **Product Spec** - What they want to build (14 sections)

Ask if they want to:
- Start fresh with both
- Only fill out Founder Context
- Only fill out Product Spec
- Resume/edit existing files

### Step 2: Founder Context (if selected)

Walk through each section one at a time. For each, explain what it is and ask questions conversationally.

**Section 1: Technical Background**
Ask about:
- Their coding skill level (beginner/intermediate/advanced/expert)
- Years of experience
- Primary languages and frameworks they know
- Areas where they'd need help

**Section 2: Domain Experience**
Ask about:
- Industry experience relevant to their idea
- How long they've been in this space
- Any insider knowledge or unfair advantages

**Section 3: Existing Distribution**
Ask about:
- Email list (size, how relevant)
- Social media following (which platforms, how many)
- Professional network
- Communities they're active in
- Any existing customers from other projects

**Section 4: Time & Resources**
Ask about:
- Hours per week they can dedicate
- How flexible their schedule is
- Financial runway (months they can sustain without income)
- Savings or investment available for this

**Section 5: Goals & Risk Tolerance**
Ask about:
- What they're trying to build (lifestyle business, growth company, venture scale, acquisition target)
- Risk tolerance (conservative, moderate, aggressive)
- Minimum acceptable outcome
- Dream outcome

**Section 6: Constraints**
Ask about:
- Any hard deadlines
- Geographic requirements
- Other commitments (job, family, etc.)
- Non-negotiables

After each section, summarize what they said and confirm before moving on.

### Step 3: Product Spec (if selected)

Walk through each section. For complex sections, break into sub-questions.

**Section 1: The Thesis**
- What specific problem are you solving?
- Who has this problem and how painful is it?
- What insight do you have that others don't?
- In one paragraph, what is this product?

**Section 2: Who This Is For**
- Describe your ideal user specifically
- Who is this explicitly NOT for?

**Section 3: Category & Positioning**
- What category does this product sit in?
- What do people compare it to?
- Complete the positioning statement: "For [target] who [situation], [Product] is a [category] that [benefit]. Unlike [alternatives], we [differentiator]."

**Section 4: Core Product Principles**
- What are 3-5 design/product principles that will guide decisions?

**Section 5: MVP Feature Set**
For each core feature:
- What is it?
- Why is it essential for MVP?
- What does "done" look like?

**Section 6: What Is Excluded (V1)**
- What features are you explicitly NOT building in v1?
- Why exclude each one?

**Section 7: Tech Stack**
- What frontend tech?
- What backend?
- What database?
- Where will you host?
- What key APIs or services?
- Why these choices?

**Section 8: Pricing Model**
- What pricing model? (freemium, subscription, usage-based, one-time, etc.)
- What price points?
- Any free tier?
- Why this model?

**Section 9: Landing Page Structure**
- What are the main sections?
- Key messages?
- Social proof strategy?

**Section 10: Legal & Compliance**
- Data handling requirements (GDPR, CCPA, etc.)?
- Industry regulations?
- Terms/Privacy complexity?
- Liability considerations?

**Section 11: First Users & Distribution**
- How will you get your first 10 users?
- First 100?
- First 1000?

**Section 12: Execution Plan**
- What are week 1-2 milestones?
- Week 3-4?
- Through to launch?

**Section 13: Founder Rules**
- What personal principles will guide this project?
- What will you commit to?
- What boundaries won't you cross?

**Section 14: Success Metrics**
- What validation metrics (pre-revenue)?
- What growth metrics?
- What business metrics?

### Step 4: Save Files

After completing each document:
1. Generate the complete markdown file
2. Save to:
   - `founder-context.md` for Founder Context
   - `product-spec.md` for Product Spec
3. Confirm the files are saved

### Step 5: Next Steps

After setup is complete, offer:
1. **Run full analysis** - Execute the 9-agent analysis
2. **Run specific agents** - Choose which analysis dimensions
3. **Review files** - Just save and exit for now
4. **Edit sections** - Go back and modify specific parts

## Tips for the Guide

- Keep questions conversational, not like a form
- If they're unsure, offer examples or suggest "skip for now"
- Validate responses make sense before moving on
- Summarize their inputs periodically
- Allow them to go back and edit previous sections
- Be encouraging but honest if something seems underdeveloped

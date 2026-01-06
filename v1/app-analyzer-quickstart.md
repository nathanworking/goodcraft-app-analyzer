# App Idea Analyzer - Quick Start Guide

## Overview

This system uses Claude Code to run 9 specialized analysis agents against your product specification, giving you a comprehensive viability assessment before committing to a build.

---

## Easiest Way: CLI Commands

From within a Claude Code session in this directory:

### Step 1: Check Status
```
/status
```
See what's ready and what's missing.

### Step 2: Interactive Setup
```
/setup
```
Guided walkthrough to fill out your Founder Context and Product Spec step-by-step. No templates to copy - just answer questions conversationally.

### Step 3: Run Analysis
```
/analyze
```
Execute the full 9-agent analysis and get your viability report.

That's it! The commands handle everything.

---

## Manual Options (if you prefer)

### Option 1: Single Command
```bash
claude "Using the analysis framework in app-idea-analyzer-prompt.md, analyze my product idea in product-spec.md with this founder context: [paste context]"
```

### Option 2: Interactive Session
```bash
claude

# Then in the session:
> Read app-idea-analyzer-prompt.md - this is your analysis framework
> Read product-spec.md - this is the product to analyze
> My founder context: [paste or describe]
> Run the full analysis and produce the executive report
```

### Option 3: With Context File
```bash
claude "Analyze product-spec.md using the framework in app-idea-analyzer-prompt.md and founder context in founder-context.md"
```

---

## Files You Need

1. **Your Product Spec** - A markdown document following the section structure (see template below)
2. **The Master Prompt** - `app-idea-analyzer-prompt.md`
3. **Founder Context** - Either in a separate file or provided inline

---

## Founder Context Template

Copy and fill in:

```markdown
# Founder Context

## Technical Background
- Skill level: [beginner|intermediate|advanced|expert]
- Years of experience: [number]
- Primary stack: [languages, frameworks]
- Gaps: [areas needing support]

## Domain Experience  
- Relevant industry experience: [description]
- Years in domain: [number]
- Unfair advantages: [insider knowledge, connections, etc.]

## Existing Distribution
- Email list: [size and relevance]
- Social following: [platform and size]
- Professional network: [description]
- Community access: [forums, groups, etc.]
- Existing customers/users from other projects: [number]

## Time & Resources
- Hours available per week: [number]
- Schedule flexibility: [description]
- Financial runway: [months]
- Monthly burn rate: [amount]
- Savings/investment available: [range]

## Goals & Risk Tolerance
- Primary goal: [lifestyle_business|growth_business|venture_scale|exit]
- Risk tolerance: [conservative|moderate|aggressive]
- Minimum acceptable outcome: [description]
- Dream outcome: [description]

## Constraints
- Hard deadlines: [any external timelines]
- Geographic constraints: [location requirements]
- Other commitments: [jobs, family, etc.]
- Non-negotiables: [things you won't compromise on]
```

---

## Product Spec Template

If you don't have a spec yet, use this structure:

```markdown
# [Product Name] - Product Specification

## SECTION 1: THE THESIS

### The Problem
[What specific problem are you solving? Who has it? How painful is it?]

### The Insight  
[What do you understand that others don't? Why is now the right time?]

### The Product Definition
[One paragraph describing what this actually is]

---

## SECTION 2: WHO THIS IS FOR

### Ideal User
[Specific description - demographics, psychographics, situation]

### Explicitly Not For
[Who should NOT use this? Be specific.]

---

## SECTION 3: CATEGORY & POSITIONING

### Category Name
[What shelf does this sit on? What do people compare it to?]

### Positioning Statement
[For [target user] who [situation], [Product] is a [category] that [key benefit]. Unlike [alternatives], we [key differentiator].]

---

## SECTION 4: CORE PRODUCT PRINCIPLES

1. [Principle 1]
2. [Principle 2]
3. [Principle 3]
[Design/product philosophy that guides decisions]

---

## SECTION 5: MVP FEATURE SET

### 5.1 [Feature Area 1]
- Feature: [description]
- Why MVP: [reasoning]
- Acceptance criteria: [what "done" looks like]

### 5.2 [Feature Area 2]
[Continue for each feature area]

---

## SECTION 6: WHAT IS EXCLUDED (V1)

- [Feature explicitly not included]
- [Feature explicitly not included]  
- [Feature explicitly not included]
[And why each is excluded]

---

## SECTION 7: TECH STACK

- Frontend: [technologies]
- Backend: [technologies]
- Database: [choice]
- Hosting: [choice]
- Key APIs/services: [list]

[Reasoning for choices]

---

## SECTION 8: PRICING MODEL

- Model: [freemium|subscription|usage|one-time|etc.]
- Price points: [specific numbers]
- Free tier: [what's included, if any]
- Reasoning: [why this model]

---

## SECTION 9: LANDING PAGE STRUCTURE

[Outline of page sections, key messages, social proof strategy]

---

## SECTION 10: LEGAL & COMPLIANCE

- Data handling requirements: [GDPR, CCPA, etc.]
- Industry regulations: [any applicable]
- Terms/Privacy needs: [complexity level]
- Liability considerations: [any specific risks]

---

## SECTION 11: FIRST USERS & DISTRIBUTION

### First 10 Users
[Specific strategy - names if you have them]

### First 100 Users
[Channels and tactics]

### First 1000 Users  
[Scalable strategies]

---

## SECTION 12: EXECUTION PLAN

### Week 1-2
[Milestones]

### Week 3-4
[Milestones]

[Continue through launch]

---

## SECTION 13: FOUNDER RULES

[Personal principles/constraints for this project]
- I will [commitment]
- I will not [boundary]

---

## SECTION 14: SUCCESS METRICS

### Validation Metrics (Pre-revenue)
- [Metric]: [target]

### Growth Metrics
- [Metric]: [target]

### Business Metrics
- [Metric]: [target]
```

---

## Expected Output

The analyzer will produce:

1. **Executive Summary** with overall viability score and verdict
2. **Quick Reference Table** comparing all dimensions
3. **Critical Findings** - what to address before building
4. **Recommended Spec Modifications** - suggested changes
5. **30-Day Validation Plan** - what to test before committing
6. **Detailed Agent Reports** - full output from each analysis dimension

---

## Tips for Best Results

1. **Be specific in your spec** - Vague inputs = vague analysis
2. **Don't hide weaknesses** - The analysis is only as good as your honesty
3. **Include founder context** - Calibration matters enormously
4. **Run competitive search manually first** - If you know competitors, list them
5. **Re-run after major changes** - Update analysis when spec evolves

---

## Customizing the Analysis

You can modify the master prompt to:

- Add industry-specific benchmarks
- Weight scoring differently for your priorities  
- Add additional agents for specific concerns
- Remove agents that aren't relevant
- Adjust output format

---

## Cost Estimation

Running full analysis typically requires:
- Multiple web searches (competitive research, benchmarks)
- Long context processing
- Extended generation

Estimate: Significant token usage, equivalent to a lengthy research session.

For lighter analysis, you can ask for specific agents only:
```bash
claude "Using app-idea-analyzer-prompt.md, run only Agent 3 (Competitive Landscape) and Agent 4 (Financial Path) on product-spec.md"
```

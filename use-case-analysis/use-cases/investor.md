# Use Case Deep Dive: Investor Screening Deal Flow

## Persona Profile

### Meet Marcus
- **Age:** 42
- **Role:** Partner at a seed-stage VC fund ($50M AUM)
- **Background:** Former operator, 2 exits, investing for 5 years
- **Deal Flow:** 200-300 inbound pitches per month
- **Investments:** 4-6 new investments per year
- **Challenge:** 95% of inbound pitches need quick filtering

### Work Pattern
- Reviews 10-15 pitch decks per day
- Spends 5-10 minutes on initial screen
- Takes 20-30 first meetings per month
- Closes 4-6 deals per year
- Time is extremely constrained

### Psychographic Profile
- Pattern recognition is core skill
- Trusts frameworks over gut
- Looking for "passing grade" not perfection
- Values consistency in evaluation
- Open to tools that augment judgment

### Pain Points
1. **Volume Overwhelm:** "I can't deeply evaluate 300 pitches/month"
2. **Consistency Challenge:** "My Monday evaluations differ from Friday"
3. **Quick Kills:** "I know in 60 seconds some won't work, but I need to articulate why"
4. **Founder Feedback:** "I want to give useful rejections, not form letters"
5. **Associate Training:** "How do I help junior team members evaluate consistently?"

---

## The User Journey

### Stage 1: Discovery

**How Marcus Finds Idea Analyzer:**

Scenario A: **Founder Shares Analysis**
> A founder pitches Marcus and includes their Idea Analyzer report: "I ran my idea through this tool before pitching. Here's what it found, and here's how I've addressed the concerns."
> Marcus thinks: "This founder did homework. What is this tool?"

Scenario B: **Peer VC Mention**
> During a partner sync with another fund: "We've been using this tool to structure our initial passes. Saves associates 5 hours per week."

Scenario C: **Conference/Talk**
> Sees a talk on "AI-Augmented Deal Flow" that mentions structured idea evaluation tools.

### Stage 2: Evaluating for Fund Use

**Marcus's Requirements:**

**Must Work For:**
1. Incoming pitch deck evaluation
2. Thesis validation for sectors we're exploring
3. Associate training (consistent frameworks)
4. Portfolio company idea pivots
5. Quick feedback for rejected founders

**Evaluation Criteria:**
- [ ] Can it handle volume (10-20 analyses/day)?
- [ ] Is output quality consistent?
- [ ] Can multiple team members use it?
- [ ] Does it integrate with our workflow?
- [ ] Is pricing reasonable for fund operations?

### Stage 3: Integration into Deal Flow

**Scenario: Pitch Deck Arrives**

A founder sends a pitch deck for "InsightBot - AI-powered customer feedback analysis"

**Current Process (Without Idea Analyzer):**
1. Marcus or associate reads deck (10 min)
2. Quick gut check: interesting or not (2 min)
3. If interesting, do some research (30 min)
4. Decide on meeting or pass (5 min)
5. Write personalized rejection or meeting invite (10 min)
Total: 15-60 minutes per pitch

**New Process (With Idea Analyzer):**
1. Associate enters key info from deck (3 min)
2. Run analysis (1 min)
3. Review structured output (3 min)
4. Partner reviews flagged opportunities (5 min)
5. Use analysis points for response (2 min)
Total: 5-15 minutes per pitch

**Time Savings:** 60-75% reduction in screening time

### Stage 4: Structured Evaluation Output

**What Marcus Wants to See:**

**Quick Verdict Display:**
```
InsightBot - Initial Screen
===========================
Score: 6.2/10 | Verdict: MAYBE - Big Questions Remain

Quick Flags:
[+] Large market (customer feedback = $3B+)
[+] Technical founder with domain expertise
[-] Crowded space (Medallia, Qualtrics, 50+ startups)
[-] Unclear differentiation from existing AI tools
[-] B2B enterprise sales = long cycles, capital intensive

Investor-Specific Concerns:
1. Why now? What's changed to enable this vs. 2020?
2. What's the wedge? How do they get first 10 customers?
3. Why this team? What's their unfair advantage?

Suggested Questions for Partner Meeting:
- "Walk me through your first 3 customers - how did you get them?"
- "What makes your AI approach different from Qualtrics acquiring Clarabridge?"
- "What's your path to $1M ARR and how much capital does that require?"
```

### Stage 5: Associate Training Tool

**Training Use Case:**

Marcus wants associates to develop pattern recognition faster.

**Approach:**
1. Associates run 10 pitches through Idea Analyzer
2. Write their own evaluation first
3. Compare to AI analysis
4. Identify gaps in their thinking
5. Discuss divergences with partners

**Learning Outcomes:**
- "I didn't think about the marketplace chicken-egg problem"
- "I underestimated how crowded this space is"
- "I missed the founder-market fit angle"

---

## Feature Needs for This Persona

### Must-Have
1. **Batch Processing:** Handle 50-100 analyses/month
2. **Team Accounts:** Multiple users, shared views
3. **API Access:** Integrate with existing deal flow tools (Affinity, etc.)
4. **Investor-Specific Output:** Questions to ask, red flags, etc.
5. **Export/Share:** Send analysis to partners

### Nice-to-Have
1. **Deal Scoring Integration:** Custom weighting for fund thesis
2. **Sector Benchmarks:** "Compared to other fintech pitches we've seen"
3. **Trend Analysis:** "We're seeing a lot of X this month"
4. **Founder Response Templates:** Pre-written rejection with insights

### Would Delight
1. **Portfolio Analysis:** Run existing portfolio companies through for check-in
2. **Thesis Validation:** "Is this sector interesting?" meta-analysis
3. **LP Reporting:** "We evaluated 300 ideas, here's the distribution"
4. **Competitive Intel:** What are other funds seeing in this space?

---

## Pricing Sensitivity

### Investor Economics
- Fund budget for tools: $50-200K/year
- Cost of associate time: $50-80/hour
- Cost of partner time: $200-500/hour
- Value of better deal selection: Potentially fund-making

### Pricing Expectations
| Tier | Price | Features |
|------|-------|----------|
| Pro | $99/mo | Unlimited individual use |
| Team | $299/mo | 3 seats, shared workspace |
| Fund | $599/mo | 10 seats, API, analytics |
| Enterprise | Custom | Unlimited, integrations, custom |

### ROI Calculation
If saving 30 min/pitch on 200 pitches/month:
- 100 hours saved/month
- At $60/hour associate rate = $6,000/month value
- $599/month tier = 10x ROI

---

## Integration Requirements

**Deal Flow Stack:**
- Affinity (CRM for VCs)
- DocSend (pitch deck tracking)
- Notion (internal wikis)
- Slack (team communication)
- Airtable (deal pipeline)

**Ideal Integrations:**
- DocSend webhook: New deck arrives -> auto-analyze
- Affinity: Analysis attached to company record
- Slack: Notifications for high-score opportunities
- Airtable: Sync scores to deal pipeline

---

## Use Case: Rejection with Value

**The Problem:**
Marcus wants to send useful rejections, not form letters. But writing personalized feedback for 280 rejections/month is impossible.

**The Solution:**
Idea Analyzer generates specific, constructive feedback.

**Example Rejection Email:**

> Hi [Founder],
>
> Thanks for sharing [Company] with us. We've spent time with your materials and want to share some specific feedback.
>
> What we liked:
> - Clear problem identification in the SMB accounting space
> - Your background at Intuit gives you relevant domain expertise
>
> Our concerns:
> - The competitive landscape (QuickBooks, Xero, Wave + 100s of startups) makes differentiation challenging
> - The distribution strategy relies on SEO in a space dominated by well-funded incumbents
> - Unit economics at $19/month require significant volume to build a venture-scale outcome
>
> For what it's worth, we'd suggest:
> - Validating a more specific niche before going broad
> - Exploring B2B partnerships rather than direct acquisition
>
> This isn't the right fit for us, but we wish you well.
>
> Best,
> Marcus

**Value to Founder:**
Useful, specific feedback vs. "not a fit for our portfolio"

**Value to VC:**
Better reputation, warmer relationships, referrals

---

## Portfolio Company Use Case

**Scenario:**
A portfolio company is considering a major pivot.

**How Idea Analyzer Helps:**
1. CEO describes new direction
2. Marcus runs it through analyzer
3. Shared discussion about strengths/risks
4. Structured framework for board discussion
5. Documented reasoning if pivot fails

---

## Success Story Template

> "We evaluated 200+ pitches last quarter. Using Idea Analyzer for initial screening saved our associates an estimated 80 hours and helped us maintain consistent evaluation criteria. More importantly, we caught two opportunities we might have missed - companies that looked questionable on the surface but had strong fundamentals. One of those is now our best-performing investment of the year."
> — Marcus, Partner at [Fund]

---

## Key Metrics for This Persona

| Metric | Target | Rationale |
|--------|--------|-----------|
| Analyses per fund/month | 50-200 | High volume screening |
| Time saved per analysis | 30+ minutes | Core value prop |
| Team members using | 3-5 | Fund-wide adoption |
| API calls (if integrated) | 100+/month | Automation value |
| NPS from fund teams | 50+ | Referral driven |

---

## Product Gaps for This Persona

1. **No Team Accounts:** Can't share across fund team
2. **No API:** Manual entry for each pitch
3. **No Investor-Specific Output:** Same analysis as founders
4. **No Integration:** Standalone tool, not in workflow
5. **No Analytics:** Can't see patterns across analyses
6. **No White-Label:** Can't brand for portfolio services

---

## Enterprise/White-Label Opportunity

**Venture Studio / Accelerator Use Case:**

YC, Techstars, and 500+ accelerators evaluate thousands of applications.

**White-Label Opportunity:**
- Accelerator-branded idea evaluation
- Embedded in application process
- Standardized scoring across applications
- Founder self-assessment before applying

**Pricing:** $5,000-20,000/year per accelerator

---

## Competitive Considerations

**Why VCs Might Use:**
- Consistent evaluation framework
- Time savings on volume
- Training tool for junior team
- Better founder feedback

**Why VCs Might Not:**
- "I trust my pattern recognition"
- "AI can't evaluate founders"
- "Our thesis is too specific for generic tools"
- "Privacy concerns with deal flow"

**Addressing Objections:**
- Position as augmentation, not replacement
- Focus on time savings, not judgment replacement
- Offer custom thesis weighting
- Strong data privacy commitments

---

*This use case represents a significant enterprise opportunity. VCs have budget, volume, and pain. A well-designed investor tier could command premium pricing and create valuable word-of-mouth in a tight-knit community.*

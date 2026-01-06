# Use Case Deep Dive: Accelerator/Incubator Program

## Persona Profile

### Meet Priya
- **Age:** 35
- **Role:** Program Director at a regional startup accelerator
- **Program Size:** 2 cohorts/year, 15-20 startups per cohort
- **Team:** 3 program staff, 20+ mentors
- **Application Volume:** 400-600 applications per cohort
- **Selection Rate:** ~3-5% of applicants accepted

### Program Context
- Pre-seed focused accelerator
- $50K investment + 3-month program
- Industry agnostic, but tech-focused
- Strong regional network
- Demo Day with 100+ investors

### Pain Points
1. **Application Volume:** "We review 500 applications in 6 weeks"
2. **Consistency Challenge:** "Different reviewers score differently"
3. **Founder Preparation:** "Many applicants haven't validated their ideas"
4. **Curriculum Gaps:** "We teach validation but have no structured tool"
5. **Alumni Tracking:** "Hard to evaluate pivots post-program"

---

## The User Journey

### Stage 1: Discovery

**How Priya Finds Idea Analyzer:**

Scenario A: **Peer Accelerator**
> At a conference of accelerator program directors, Priya hears: "We embedded an idea analysis tool in our application process. Founders self-assess, we see their thinking."

Scenario B: **Founder Uses It**
> A founder in the current cohort shares: "I ran my idea through this tool before applying. It helped me strengthen my application."

Scenario C: **Curriculum Search**
> Priya is looking for validation curriculum resources and finds Idea Analyzer as a teaching tool.

### Stage 2: Multiple Use Cases Identified

**Priya's Potential Applications:**

1. **Application Pre-Screen:** Founders self-assess before applying
2. **Reviewer Calibration:** Staff uses consistent framework
3. **Curriculum Tool:** Teach validation methodology
4. **Pivot Analysis:** Structured approach to founder pivots
5. **Alumni Check-ins:** Track idea evolution post-program

---

## Use Case 1: Application Pre-Screen

### The Challenge
400-600 applications, 6-week review window, 3 reviewers.

Current process:
- Round 1: Application form review (60% elimination)
- Round 2: Video pitch review (60% elimination)
- Round 3: Interview (50% elimination)
- Final: Selection committee

### Idea Analyzer Integration

**Pre-Application Requirement:**
"Before applying, run your idea through Idea Analyzer and include your results."

**Value to Accelerator:**
1. Founders forced to articulate idea clearly
2. Self-selection: weak ideas may not apply
3. Structured data for faster review
4. Insight into founder's self-awareness
5. Consistent format across all applications

**Value to Founders:**
1. Pre-feedback before application
2. Identify weaknesses to address in application
3. Shows maturity and preparation
4. Free validation tool regardless of acceptance

**Integration Mockup:**

Application Form Addition:
```
Section 5: Idea Validation

Please complete an Idea Analyzer assessment and answer:

1. Paste your Idea Analyzer Report Summary (or upload PDF)

2. What was your overall score? [Dropdown: 1-10]

3. What was your verdict? [Dropdown: build/build-with-changes/maybe/pivot/pass]

4. What were the top 2 concerns identified?
   [Text area]

5. How have you addressed or plan to address these concerns?
   [Text area]

Note: There is no minimum score requirement. We value founders who understand
their challenges and have a plan to address them.
```

### Reviewer Benefits

**Faster Screening:**
- Skip weak ideas with low scores AND poor response to concerns
- Prioritize high scores OR thoughtful concern responses
- Consistent data format for comparison

**Signal Extraction:**
- Low score + dismissive response = Red flag
- Low score + thoughtful plan = Potential
- High score + no concerns addressed = Overconfidence?

---

## Use Case 2: Reviewer Calibration

### The Challenge
3 reviewers scoring 500 applications = inconsistency.

Reviewer A might emphasize:
- Team background
- Market size

Reviewer B might emphasize:
- Traction
- Technical feasibility

### Calibration Approach

**Training Session:**
1. All reviewers analyze same 5 ideas with Idea Analyzer
2. Compare their mental scores to AI scores
3. Discuss divergences
4. Align on weighting of different dimensions

**Ongoing Calibration:**
- When reviewers diverge significantly, reference Idea Analyzer
- "The tool flagged competition as high-risk. Did we consider that?"
- Not as authority, but as discussion framework

---

## Use Case 3: Curriculum Integration

### Week 1: Validation Module

**Session: "Know If Your Idea Will Work"**

Learning Objectives:
- Understand the 9 dimensions of idea evaluation
- Identify blind spots in your own thinking
- Create an action plan for validation

**Exercise Flow:**

1. **Pre-Session (30 min):**
   Founders run their current idea through Idea Analyzer

2. **Session Opening (15 min):**
   - 42% of startups fail due to no market need
   - Why validation matters before building

3. **Group Exercise (45 min):**
   - Founders share their top concern from analysis
   - Peer discussion: "How would you address this?"
   - Mentor facilitation

4. **Individual Work (30 min):**
   - Update 30-day action plan based on discussion
   - Identify specific validation experiments

5. **Commitment (15 min):**
   - Each founder commits to 1 validation action this week
   - Share with accountability partner

### Week 6: Pivot Analysis

**Session: "When to Pivot"**

**Exercise:**
Founders who are considering pivots re-run analysis with new direction.

Discussion:
- Did the score improve?
- What dimensions changed?
- What's the path forward?

---

## Use Case 4: Alumni Check-ins

### Post-Program Tracking

**6-Month Check-in Template:**
1. Current company description
2. Key pivots since program
3. Updated Idea Analyzer assessment
4. Comparison to original assessment

**Value:**
- Structured approach to understanding evolution
- Data for program improvement
- Early warning for struggling companies
- Success stories for marketing

---

## Feature Needs for This Persona

### Must-Have
1. **Bulk Analysis:** Handle 500+ analyses per cohort
2. **White-Label Option:** Accelerator-branded tool
3. **Embeddable Reports:** Include in applications
4. **Comparison Dashboard:** Compare across cohort
5. **Export/Analytics:** Program-wide insights

### Nice-to-Have
1. **Custom Dimensions:** Add accelerator-specific criteria
2. **Mentor Access:** Mentors can view assigned founder analyses
3. **Progress Tracking:** See idea evolution over program
4. **Curriculum Materials:** Ready-to-use workshop slides

### Would Delight
1. **Cohort Benchmarking:** "This cohort vs. last cohort"
2. **Success Correlation:** "Companies with X score had Y outcome"
3. **Automated Check-ins:** Scheduled re-assessments
4. **Network Effects:** Connect founders with similar challenges

---

## Pricing for Accelerators

### Pricing Model Options

**Option A: Per-Cohort License**
- $2,500/cohort (up to 25 founders)
- Unlimited analyses during program
- White-label option +$1,000

**Option B: Annual License**
- $5,000/year
- 2 cohorts included
- Volume discount for larger programs

**Option C: Per-Application**
- $1/application for pre-screen use
- $500/cohort for curriculum use
- Pay-as-you-go flexibility

### ROI Calculation

**Current State:**
- 500 applications x 30 min/review = 250 hours
- At $40/hour = $10,000 in review costs

**With Idea Analyzer Pre-Screen:**
- 30% of applications filtered by self-assessment
- 350 applications reviewed = 175 hours
- Save 75 hours = $3,000

**Additional Value:**
- Better prepared founders
- More consistent evaluation
- Curriculum enhancement
- Alumni engagement tool

---

## Integration Requirements

### Application Platform Integration
- Typeform/Google Forms embed
- Application management systems (OpenWater, SurveyMonkey Apply)
- Custom API for ATS integration

### Curriculum Platform
- Notion (curriculum documentation)
- Slack (cohort communication)
- Loom (async video content)

### Reporting
- Export to Airtable/Sheets for analysis
- Dashboard for program directors
- Board reporting templates

---

## White-Label Opportunity

**Accelerator-Branded Tool:**
"[Accelerator Name] Idea Evaluator"

Features:
- Custom branding
- Custom intro text
- Accelerator-specific criteria
- Direct link to application
- Embedded in program portal

**Premium Add-ons:**
- Custom dimensions (+$500)
- Mentor dashboard (+$1,000)
- API access (+$2,000)
- Dedicated support (+$1,500)

---

## Success Story Template

> "We integrated Idea Analyzer into our application process last cohort. Requiring founders to self-assess before applying served multiple purposes: weak ideas self-selected out, founders arrived more prepared, and our reviewers had consistent data to work with. Application quality improved by 40%, and we saved an estimated 80 hours of review time. Beyond selection, we now use it as a cornerstone of our validation curriculum."
> — Priya, Program Director at [Accelerator]

---

## Key Metrics for This Persona

| Metric | Target | Rationale |
|--------|--------|-----------|
| Applications using tool | 90%+ | Adoption indicator |
| Time saved per review | 10-15 min | Core value prop |
| Founder satisfaction | 8/10 | Part of experience |
| Curriculum NPS | 50+ | Workshop quality |
| Renewal rate | 80%+ | Program stickiness |

---

## Competitive Considerations

### Current Alternatives
- Manual review (status quo)
- Custom Google Forms (DIY approach)
- Strategyzer (Business Model Canvas focus)
- No structured validation (common)

### Why Idea Analyzer Wins
- Purpose-built for idea validation
- 9-dimension framework is comprehensive
- Founder context consideration
- AI-powered analysis saves time
- Actionable outputs

### Objections and Responses

**"Our mentors already evaluate ideas"**
- This augments mentors, doesn't replace
- Consistent framework for all founders
- Mentors can focus on high-value coaching

**"We don't want AI making decisions"**
- AI provides data, humans decide
- Founder self-awareness is the signal
- Calibration tool, not decision maker

**"It's another thing founders have to do"**
- 5-10 minutes, valuable feedback
- Better than rejection without feedback
- Free tool provides value regardless

---

## Expansion Opportunities

### Network Effects
- Partner with accelerator networks (GAN, etc.)
- Create accelerator benchmarks across programs
- Share anonymized success patterns
- Cross-program mentor access

### Venture Studio Application
- Beyond accelerators to venture studios
- Corporate innovation programs
- University entrepreneurship programs
- Government innovation grants

---

*This use case represents a significant B2B opportunity with recurring revenue potential. Accelerators have budget, clear pain points, and word-of-mouth networks that could drive rapid adoption.*

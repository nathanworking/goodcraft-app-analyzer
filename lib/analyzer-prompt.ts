import { ProductSpec, FounderContext } from './types';

export function buildAnalyzerPrompt(productSpec: Partial<ProductSpec>, founderContext: Partial<FounderContext>): string {
  return `# App Idea Analysis Request

You are an expert product analyst. Analyze this product idea using the 9-agent framework and provide a comprehensive assessment.

## PRODUCT SPECIFICATION

**Name:** ${productSpec.name || 'Unnamed Product'}
**Category:** ${productSpec.category || 'Unknown'}

### The Thesis (Problem & Solution)
${productSpec.thesis || 'Not provided'}

### Target User
${productSpec.targetUser || 'Not specified'}

### MVP Features
${productSpec.mvpFeatures || 'Not specified'}

### Pricing
${productSpec.pricing || 'Not specified'}

### Distribution Strategy
${productSpec.distribution || 'Not specified'}

---

## FOUNDER CONTEXT

- **Technical Skill Level:** ${founderContext.technicalSkill || 'Unknown'}
- **Domain Experience:** ${founderContext.domainExperience || 'Not specified'}
- **Existing Audience:** ${founderContext.existingAudience || 'None specified'}
- **Time Commitment:** ${founderContext.hoursPerWeek || 'Unknown'} hours/week
- **Runway:** ${founderContext.runwayMonths || 'Unknown'} months
- **Risk Tolerance:** ${founderContext.riskTolerance || 'Moderate'}

---

## YOUR TASK

Run the following 9 analysis agents and synthesize findings:

1. **Team & Resource Requirements** - Can this founder execute?
2. **Build Complexity & Timeline** - How long to MVP?
3. **Competitive Landscape** - Who else is doing this?
4. **Financial Path Analysis** - Path to sustainability?
5. **User Acquisition Feasibility** - How to get users?
6. **Technical Risk Assessment** - What could break?
7. **Defensibility & Moat Analysis** - Can it be copied easily?
8. **Capital Efficiency** - Bootstrap or raise?
9. **Pivot Potential** - Fallback options?

---

## OUTPUT FORMAT

Provide your analysis in the following JSON structure:

\`\`\`json
{
  "overallScore": <number 1-10>,
  "verdict": "<build|build-with-changes|maybe|pivot|pass>",
  "verdictSummary": "<2-3 sentence summary explaining the verdict>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "mustAddress": [
    "<issue 1>",
    "<issue 2>",
    "<issue 3>"
  ],
  "risks": [
    "<risk 1>",
    "<risk 2>",
    "<risk 3>"
  ],
  "addressableConcerns": [
    {
      "concern": "<exact text from mustAddress or risks>",
      "howToFix": "<specific 2-3 sentence actionable fix tailored to THIS idea>",
      "effort": "<low|medium|high>",
      "impact": "<low|medium|high - how much would fixing this improve the score>",
      "type": "<mustAddress|risk>"
    }
  ],
  "validationRequirements": {
    "capitalNeeded": {
      "amount": "<$0|$1K-5K|$5K-20K|$20K-50K|$50K+>",
      "reason": "<1-2 sentences explaining why THIS idea needs this amount>"
    },
    "interestedPeople": {
      "count": <10|50|100|500|1000>,
      "type": "<specific type: paying customers, waitlist signups, active users, etc.>",
      "why": "<1-2 sentences explaining why this number proves viability for THIS idea>"
    },
    "timeCommitment": {
      "hoursPerWeek": <minimum hours needed>,
      "duration": "<3 months|6 months|12 months>",
      "phase": "<what you'll accomplish: MVP, first revenue, product-market fit, etc.>"
    },
    "keyMilestones": [
      "<specific milestone 1 to hit before going all-in>",
      "<specific milestone 2>",
      "<specific milestone 3>"
    ]
  },
  "metrics": {
    "timeToMvp": "<X-Y weeks>",
    "timeToFirstRevenue": "<X-Y months>",
    "usersNeeded": "<description>",
    "competition": "<blue ocean|low|moderate|crowded|saturated>"
  },
  "actions": [
    "<action 1 for first 30 days>",
    "<action 2>",
    "<action 3>",
    "<action 4>",
    "<action 5>"
  ],
  "dimensionScores": {
    "team": <1-10>,
    "buildComplexity": <1-10>,
    "competition": <1-10>,
    "financialPath": <1-10>,
    "userAcquisition": <1-10>,
    "technicalRisk": <1-10>,
    "defensibility": <1-10>,
    "capitalEfficiency": <1-10>,
    "pivotPotential": <1-10>
  },
  "detailedAnalysis": "<markdown string with full agent-by-agent analysis>"
}
\`\`\`

## IMPORTANT GUIDELINES FOR NEW FIELDS

**addressableConcerns**: Generate one entry for EVERY item in mustAddress and risks arrays. Each fix must be:
- Specific to THIS idea, not generic startup advice
- Actionable within the founder's constraints
- Realistic given their resources

**validationRequirements**: This answers "What do I need before going all-in?" Tailor to THIS specific idea:
- A marketplace needs different validation than a developer tool
- A B2B SaaS needs different proof than a B2C app
- Consider the founder's existing resources and audience

Be rigorous, honest, and specific. Do not sugarcoat issues. The founder needs truth, not encouragement.`;
}

export function parseAnalyzerResponse(response: string): {
  success: boolean;
  data?: {
    overallScore: number;
    verdict: string;
    verdictSummary: string;
    strengths: string[];
    mustAddress: string[];
    risks: string[];
    metrics: {
      timeToMvp: string;
      timeToFirstRevenue: string;
      usersNeeded: string;
      competition: string;
    };
    actions: string[];
    dimensionScores?: Record<string, number>;
    detailedAnalysis?: string;
    addressableConcerns?: Array<{
      concern: string;
      howToFix: string;
      effort: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      type: 'mustAddress' | 'risk';
    }>;
    validationRequirements?: {
      capitalNeeded: { amount: string; reason: string };
      interestedPeople: { count: number; type: string; why: string };
      timeCommitment: { hoursPerWeek: number; duration: string; phase: string };
      keyMilestones: string[];
    };
  };
  error?: string;
} {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return { success: true, data: parsed };
    }

    // Try direct JSON parse
    const parsed = JSON.parse(response);
    return { success: true, data: parsed };
  } catch {
    // Try to extract key fields manually if JSON parsing fails
    try {
      const scoreMatch = response.match(/overall.*?score.*?(\d+(?:\.\d+)?)/i);
      const verdictMatch = response.match(/verdict.*?(build|pass|maybe|pivot)/i);

      if (scoreMatch && verdictMatch) {
        return {
          success: true,
          data: {
            overallScore: parseFloat(scoreMatch[1]),
            verdict: verdictMatch[1].toLowerCase() as string,
            verdictSummary: 'Analysis completed. See detailed report below.',
            strengths: ['See detailed analysis'],
            mustAddress: ['See detailed analysis'],
            risks: ['See detailed analysis'],
            metrics: {
              timeToMvp: 'See analysis',
              timeToFirstRevenue: 'See analysis',
              usersNeeded: 'See analysis',
              competition: 'See analysis',
            },
            actions: ['Review the detailed analysis below'],
            detailedAnalysis: response,
          },
        };
      }
    } catch {
      // Ignore secondary parse attempt errors
    }

    return {
      success: false,
      error: 'Failed to parse analysis response',
    };
  }
}

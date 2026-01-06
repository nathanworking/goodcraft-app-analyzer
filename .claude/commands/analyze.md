# /analyze - Run Product Viability Analysis

Run the 9-agent analysis framework on your product idea.

## Prerequisites

You need:
- `founder-context.md` - Your founder context (run `/setup` if you don't have this)
- `product-spec.md` - Your product specification (run `/setup` if you don't have this)

## What This Does

Executes the analysis framework in `app-idea-analyzer-prompt.md` which runs 9 specialized agents:

1. **Team & Resource Requirements** - Minimal viable team composition
2. **Build Complexity & Timeline** - Realistic build timeline estimates
3. **Competitive Landscape** - Competitive environment mapping
4. **Financial Path Analysis** - Paths to MRR milestones
5. **User Acquisition Feasibility** - User acquisition strategy viability
6. **Technical Risk Assessment** - Technical risks that could derail the build
7. **Defensibility & Moat Analysis** - Long-term competitive moats
8. **Capital Efficiency & Funding** - Path to sustainability
9. **Pivot Potential & Optionality** - Fallback options if primary fails

## Output

You'll receive:
- Executive Summary with viability score (1-10)
- Quick Reference Table comparing all dimensions
- Critical Findings and recommendations
- Suggested Spec Modifications
- 30-Day Validation Plan
- Detailed reports from each agent

## Instructions

1. Check for `founder-context.md` and `product-spec.md`
2. If missing, offer to run `/setup` first
3. Read the master prompt from `app-idea-analyzer-prompt.md`
4. Read `founder-context.md` and `product-spec.md`
5. Execute the full analysis framework
6. Produce the executive report

## Options

User can specify:
- `--agents 3,4,5` - Run only specific agents (by number)
- `--quick` - Abbreviated analysis, skip deep research
- `--focus competitive` - Deep dive on one dimension

## Arguments: $ARGUMENTS

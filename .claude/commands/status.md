# /status - Check Analysis Status

Quick check of what's ready for analysis.

## Instructions

Check for the following files and report their status:

1. **founder-context.md** - Does it exist? How complete is it?
2. **product-spec.md** - Does it exist? How complete is it?
3. **app-idea-analyzer-prompt.md** - Master prompt (should always exist)

## Output Format

```
App Idea Analyzer Status
========================

Founder Context:  [Ready / Missing / Incomplete]
Product Spec:     [Ready / Missing / Incomplete]
Analysis Prompt:  [Ready / Missing]

Next Step: [recommendation]
```

If files are incomplete, list which sections are missing.

Recommend:
- `/setup` if documents are missing
- `/analyze` if everything is ready
- Specific section to complete if partially done

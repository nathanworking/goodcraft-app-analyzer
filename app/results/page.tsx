'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, VerdictBox, MetricRow, Details, ExpandableConcern, SectionHeader, ScoreCard, Grid, StatCard, CompactMetric, Divider } from '../components/ui';
import { AnalysisResult, VERDICT_CONFIG, ProductSpec, FounderContext, Verdict, AddressableConcern, ValidationRequirements } from '@/lib/types';
import { getStoredData, setStoredData, generateMarkdownExport } from '@/lib/store';
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertTriangle, XCircle, DollarSign, Users, Clock, Target, TrendingUp, Zap, Shield, Layers } from 'lucide-react';

interface ExtendedAnalysisResult extends AnalysisResult {
  dimensionScores?: {
    team: number;
    buildComplexity: number;
    competition: number;
    financialPath: number;
    userAcquisition: number;
    technicalRisk: number;
    defensibility: number;
    capitalEfficiency: number;
    pivotPotential: number;
  };
  detailedAnalysis?: string;
  addressableConcerns?: AddressableConcern[];
  validationRequirements?: ValidationRequirements;
}

async function analyzeIdea(
  productSpec: Partial<ProductSpec>,
  founderContext: Partial<FounderContext>
): Promise<ExtendedAnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productSpec, founderContext }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    // Normalize verdict to our expected types
    const verdictMap: Record<string, Verdict> = {
      'build': 'build',
      'build-with-changes': 'build-with-changes',
      'buildwithchanges': 'build-with-changes',
      'maybe': 'maybe',
      'pivot': 'pivot',
      'pass': 'pass',
    };

    const normalizedVerdict = verdictMap[data.result.verdict?.toLowerCase()] || 'maybe';

    return {
      productName: data.result.productName || productSpec.name || 'Your Idea',
      overallScore: data.result.overallScore || 5,
      verdict: normalizedVerdict,
      verdictSummary: data.result.verdictSummary || 'Analysis complete.',
      strengths: data.result.strengths || [],
      mustAddress: data.result.mustAddress || [],
      risks: data.result.risks || [],
      metrics: data.result.metrics || {
        timeToMvp: 'Unknown',
        timeToFirstRevenue: 'Unknown',
        usersNeeded: 'Unknown',
        competition: 'Unknown',
      },
      actions: data.result.actions || [],
      dimensionScores: data.result.dimensionScores,
      detailedAnalysis: data.result.detailedAnalysis,
      addressableConcerns: data.result.addressableConcerns,
      validationRequirements: data.result.validationRequirements,
    };
  } catch (error) {
    console.error('API analysis failed, using fallback:', error);
    // Fallback to simple heuristic analysis
    return fallbackAnalysis(productSpec, founderContext);
  }
}

function fallbackAnalysis(
  productSpec: Partial<ProductSpec>,
  founderContext: Partial<FounderContext>
): ExtendedAnalysisResult {
  let score = 5;
  const strengths: string[] = [];
  const mustAddress: string[] = [];
  const risks: string[] = [];

  if (founderContext.technicalSkill === 'expert' || founderContext.technicalSkill === 'senior') {
    score += 1.5;
    strengths.push('Strong technical skills reduce execution risk');
  } else if (founderContext.technicalSkill === 'non-technical') {
    score -= 1.5;
    mustAddress.push('Consider finding a technical co-founder or learning to code');
  }

  if (founderContext.existingAudience && founderContext.existingAudience.length > 50) {
    score += 1;
    strengths.push('Existing audience provides distribution advantage');
  } else {
    mustAddress.push('Build distribution strategy - no existing audience detected');
  }

  if (founderContext.domainExperience && founderContext.domainExperience.length > 30) {
    score += 0.5;
    strengths.push('Domain experience gives you insight into real user needs');
  }

  if ((founderContext.hoursPerWeek || 0) >= 30) {
    score += 0.5;
  } else if ((founderContext.hoursPerWeek || 0) < 15) {
    score -= 0.5;
    risks.push('Limited time commitment may slow progress significantly');
  }

  if ((founderContext.runwayMonths || 0) >= 18) {
    score += 0.5;
    strengths.push('Solid runway gives time to iterate and find product-market fit');
  } else if ((founderContext.runwayMonths || 0) < 6) {
    score -= 1;
    risks.push('Short runway creates pressure - may need to compromise on quality');
  }

  const featureCount = (productSpec.mvpFeatures || '').split('\n').filter(f => f.trim().length > 0).length;
  if (featureCount <= 4) {
    score += 0.5;
    strengths.push('Focused MVP scope - can ship quickly');
  } else if (featureCount > 8) {
    score -= 1;
    mustAddress.push(`MVP has ${featureCount} features - consider cutting to 3-4 core features`);
  }

  if (productSpec.distribution && productSpec.distribution.length > 30) {
    score += 0.5;
  } else {
    mustAddress.push('Distribution strategy is vague - get specific about first 100 users');
  }

  if (productSpec.category === 'marketplace') {
    risks.push('Marketplaces have chicken-and-egg problem - need both supply and demand');
    score -= 0.5;
  } else if (productSpec.category === 'fintech') {
    risks.push('Fintech has regulatory complexity - ensure compliance from day 1');
  }

  risks.push('Competitors could copy core features if successful');

  score = Math.max(1, Math.min(10, score));

  let verdict: Verdict;
  if (score >= 7.5) verdict = 'build';
  else if (score >= 6.5) verdict = 'build-with-changes';
  else if (score >= 5) verdict = 'maybe';
  else if (score >= 3.5) verdict = 'pivot';
  else verdict = 'pass';

  const summaryParts: string[] = [];
  if (score >= 7) {
    summaryParts.push(`You have the skills and resources to build ${productSpec.name || 'this'}.`);
    if (founderContext.existingAudience) {
      summaryParts.push('Your existing audience gives you a head start on distribution.');
    }
  } else if (score >= 5) {
    summaryParts.push('This idea has potential, but there are significant gaps to address.');
    if (mustAddress.length > 0) {
      summaryParts.push(`Focus on: ${mustAddress[0].toLowerCase()}`);
    }
  } else {
    summaryParts.push("This idea faces major headwinds given your current situation.");
    summaryParts.push('Consider a different approach or building up resources first.');
  }

  // Generate addressable concerns from mustAddress and risks
  const addressableConcerns: AddressableConcern[] = [
    ...mustAddress.map((concern): AddressableConcern => ({
      concern,
      howToFix: generateFallbackFix(concern),
      effort: 'medium' as const,
      impact: 'high' as const,
      type: 'mustAddress' as const,
    })),
    ...risks.map((concern): AddressableConcern => ({
      concern,
      howToFix: generateFallbackFix(concern),
      effort: 'high' as const,
      impact: 'medium' as const,
      type: 'risk' as const,
    })),
  ];

  // Generate validation requirements based on context
  const isMarketplace = productSpec.category === 'marketplace';
  const isB2B = productSpec.category === 'b2b-saas';
  const hoursPerWeek = founderContext.hoursPerWeek || 20;

  const validationRequirements: ValidationRequirements = {
    capitalNeeded: {
      amount: featureCount <= 4 ? '$0-1K' : featureCount <= 6 ? '$1K-5K' : '$5K-20K',
      reason: featureCount <= 4
        ? 'Minimal MVP can be bootstrapped with existing tools'
        : 'Budget needed for hosting, tools, and initial marketing',
    },
    interestedPeople: {
      count: isMarketplace ? 100 : isB2B ? 10 : 50,
      type: isMarketplace
        ? 'users on each side of the marketplace'
        : isB2B
        ? 'companies willing to pilot'
        : 'waitlist signups',
      why: isMarketplace
        ? 'Marketplaces need critical mass on both sides to demonstrate value'
        : isB2B
        ? 'B2B products need fewer but more committed early adopters'
        : 'This number proves enough demand exists to justify building',
    },
    timeCommitment: {
      hoursPerWeek: Math.max(15, hoursPerWeek),
      duration: featureCount <= 4 ? '3 months' : '6 months',
      phase: 'To reach MVP and validate with real users',
    },
    keyMilestones: [
      '5 customer interviews confirming the problem exists',
      founderContext.existingAudience
        ? 'Soft launch to your existing audience'
        : 'Landing page with waitlist capturing interest',
      '3 people who explicitly say they would pay',
      'Working prototype solving the core problem',
    ],
  };

  return {
    productName: productSpec.name || 'Your Idea',
    overallScore: Math.round(score * 10) / 10,
    verdict,
    verdictSummary: summaryParts.join(' '),
    strengths: strengths.length > 0 ? strengths : ['Problem is clearly defined'],
    mustAddress: mustAddress.length > 0 ? mustAddress : ['Validate demand before building'],
    risks,
    metrics: {
      timeToMvp: featureCount <= 4 ? '4-6 weeks' : featureCount <= 6 ? '6-10 weeks' : '10-16 weeks',
      timeToFirstRevenue: founderContext.existingAudience ? '1-2 months' : '2-4 months',
      usersNeeded: productSpec.pricing?.includes('$') ? '~200-500 for $5K MRR' : 'Depends on pricing',
      competition: 'Research needed',
    },
    actions: [
      'Validate: Talk to 5 potential customers this week',
      'Landing page: Ship waitlist to gauge interest',
      `Prototype: Build ${featureCount <= 4 ? 'one' : 'the most critical'} feature first`,
      'Distribution: Test one acquisition channel before building more',
      'Pricing: Validate willingness to pay before launch',
    ],
    addressableConcerns,
    validationRequirements,
  };
}

// Helper function to generate fallback fix suggestions
function generateFallbackFix(concern: string): string {
  const lowercaseConcern = concern.toLowerCase();

  if (lowercaseConcern.includes('technical') || lowercaseConcern.includes('co-founder')) {
    return 'Consider using no-code tools like Bubble or Webflow for MVP, or find a technical co-founder through communities like YC Co-founder Matching or Indie Hackers.';
  }
  if (lowercaseConcern.includes('distribution') || lowercaseConcern.includes('audience')) {
    return 'Start building in public on Twitter/LinkedIn, join relevant communities where your users hang out, or consider content marketing to build organic reach.';
  }
  if (lowercaseConcern.includes('features') || lowercaseConcern.includes('mvp')) {
    return 'Ruthlessly cut features to the core value proposition. Ask: what single thing must work for users to get value? Build only that first.';
  }
  if (lowercaseConcern.includes('runway') || lowercaseConcern.includes('time')) {
    return 'Consider keeping your day job while validating, or reduce scope to something achievable in your timeframe. Pre-sell to generate early revenue.';
  }
  if (lowercaseConcern.includes('competitor') || lowercaseConcern.includes('copy')) {
    return 'Focus on speed to market and customer relationships. Build features that require deep domain knowledge or network effects that are hard to replicate.';
  }
  if (lowercaseConcern.includes('marketplace') || lowercaseConcern.includes('chicken')) {
    return 'Start with one side only - constrain supply or fake demand initially. Focus on one geography or niche before expanding.';
  }
  if (lowercaseConcern.includes('regulatory') || lowercaseConcern.includes('compliance')) {
    return 'Consult with a lawyer specializing in this space. Consider starting in a more permissive jurisdiction or partnering with a licensed entity.';
  }

  return 'Break this down into smaller, actionable steps. Talk to potential users who face this issue and understand what specific solution they would pay for.';
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ExtendedAnalysisResult | null>(null);
  const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>({});
  const [founderContext, setFounderContext] = useState<Partial<FounderContext>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisStage, setAnalysisStage] = useState('Starting analysis...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredData();

    if (!stored.productSpec?.name) {
      router.push('/');
      return;
    }

    setProductSpec(stored.productSpec);
    setFounderContext(stored.founderContext);

    // Progress messages
    const stages = [
      'Analyzing team requirements...',
      'Evaluating build complexity...',
      'Researching competition...',
      'Modeling financial path...',
      'Assessing user acquisition...',
      'Checking technical risks...',
      'Analyzing defensibility...',
      'Evaluating capital efficiency...',
      'Exploring pivot potential...',
      'Synthesizing findings...',
    ];

    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setAnalysisStage(stages[stageIndex]);
        stageIndex++;
      }
    }, 2000);

    // Run the actual analysis
    analyzeIdea(stored.productSpec, stored.founderContext)
      .then((analysisResult) => {
        clearInterval(stageInterval);
        setResult(analysisResult);
        setStoredData({ result: analysisResult });
        setIsAnalyzing(false);
      })
      .catch((err) => {
        clearInterval(stageInterval);
        setError(err.message);
        setIsAnalyzing(false);
      });

    return () => clearInterval(stageInterval);
  }, [router]);

  const handleExport = () => {
    if (!result) return;

    const markdown = generateMarkdownExport(result, productSpec, founderContext);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.productName.toLowerCase().replace(/\s+/g, '-')}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <main className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted" />
          <h2 className="text-xl font-semibold mb-2">Analyzing your idea...</h2>
          <p className="text-muted">{analysisStage}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-8 h-8 mx-auto mb-4 text-danger" />
          <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
          <p className="text-muted mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Try Again</Button>
        </div>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  const verdictConfig = VERDICT_CONFIG[result.verdict];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export .md
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">{result.productName} Analysis</h1>

        {/* Verdict Box */}
        <div className="mb-8">
          <VerdictBox
            emoji={verdictConfig.emoji}
            label={verdictConfig.label}
            score={result.overallScore}
            summary={result.verdictSummary}
            bgColor={verdictConfig.bgColor}
          />
        </div>

        {/* Key Scores - 4-column grid for top metrics */}
        {result.dimensionScores && (
          <div className="mb-8">
            <Grid cols={4} gap={3}>
              <ScoreCard
                score={result.dimensionScores.team}
                label="Team Fit"
                size="md"
              />
              <ScoreCard
                score={result.dimensionScores.buildComplexity}
                label="Build"
                size="md"
              />
              <ScoreCard
                score={result.dimensionScores.financialPath}
                label="Revenue"
                size="md"
              />
              <ScoreCard
                score={result.dimensionScores.defensibility}
                label="Moat"
                size="md"
              />
            </Grid>
          </div>
        )}

        {/* All Dimension Scores - Collapsible */}
        {result.dimensionScores && (
          <Card variant="bordered" className="mb-6">
            <Details summary="View all 9 dimension scores">
              <Grid cols={3} gap={3} className="mt-2">
                {[
                  { key: 'team', label: 'Team Fit' },
                  { key: 'buildComplexity', label: 'Build Complexity' },
                  { key: 'competition', label: 'Competition' },
                  { key: 'financialPath', label: 'Financial Path' },
                  { key: 'userAcquisition', label: 'User Acquisition' },
                  { key: 'technicalRisk', label: 'Technical Risk' },
                  { key: 'defensibility', label: 'Defensibility' },
                  { key: 'capitalEfficiency', label: 'Capital Efficiency' },
                  { key: 'pivotPotential', label: 'Pivot Potential' },
                ].map(({ key, label }) => {
                  const score = result.dimensionScores?.[key as keyof typeof result.dimensionScores] ?? 0;
                  return (
                    <ScoreCard key={key} score={score} label={label} size="sm" />
                  );
                })}
              </Grid>
            </Details>
          </Card>
        )}

        {/* Why It Works / Doesn't */}
        <Card variant="bordered" className="mb-6">
          <SectionHeader
            emoji={result.verdict === 'build' || result.verdict === 'build-with-changes' ? '💡' : '⚠️'}
            title={`Why It ${result.verdict === 'build' || result.verdict === 'build-with-changes' ? 'Works' : "Doesn't Work"}`}
          />

          <div className="space-y-4">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-medium text-sm">What&apos;s in your favor</span>
              </div>
              <ul className="space-y-1 pl-6">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted">• {s}</li>
                ))}
              </ul>
            </div>

            {/* Must Address - Now with expandable concerns */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-sm">What you need to address</span>
                <span className="text-xs text-muted">(click to see how to fix)</span>
              </div>
              <div className="space-y-2">
                {result.addressableConcerns?.filter(c => c.type === 'mustAddress').map((c, i) => (
                  <ExpandableConcern
                    key={i}
                    concern={c.concern}
                    howToFix={c.howToFix}
                    effort={c.effort}
                    impact={c.impact}
                    variant="warning"
                    icon={<AlertTriangle className="w-4 h-4 text-warning" />}
                  />
                )) || result.mustAddress.map((m, i) => (
                  <div key={i} className="text-sm text-muted pl-6">• {m}</div>
                ))}
              </div>
            </div>

            {/* Risks - Now with expandable concerns */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-danger" />
                <span className="font-medium text-sm">What could kill it</span>
                <span className="text-xs text-muted">(click to see how to fix)</span>
              </div>
              <div className="space-y-2">
                {result.addressableConcerns?.filter(c => c.type === 'risk').map((c, i) => (
                  <ExpandableConcern
                    key={i}
                    concern={c.concern}
                    howToFix={c.howToFix}
                    effort={c.effort}
                    impact={c.impact}
                    variant="danger"
                    icon={<XCircle className="w-4 h-4 text-danger" />}
                  />
                )) || result.risks.map((r, i) => (
                  <div key={i} className="text-sm text-muted pl-6">• {r}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Before You Go All-In - Validation Requirements */}
        {result.validationRequirements && (
          <Card variant="bordered" className="mb-6">
            <SectionHeader
              emoji="🎯"
              title="Before You Go All-In"
              subtitle="What you need to validate this idea"
            />

            {/* 2-column grid for key metrics */}
            <Grid cols={2} gap={3} className="mb-4">
              <StatCard
                icon={<DollarSign className="w-5 h-5 text-success" />}
                iconBg="bg-success-bg"
                label="Capital Needed"
                value={result.validationRequirements.capitalNeeded.amount}
                sublabel={result.validationRequirements.capitalNeeded.reason}
              />
              <StatCard
                icon={<Users className="w-5 h-5 text-info" />}
                iconBg="bg-info-bg"
                label="Interested People"
                value={`${result.validationRequirements.interestedPeople.count}+`}
                sublabel={result.validationRequirements.interestedPeople.type}
              />
              <StatCard
                icon={<Clock className="w-5 h-5 text-warning" />}
                iconBg="bg-warning-bg"
                label="Time Investment"
                value={`${result.validationRequirements.timeCommitment.hoursPerWeek}+ hrs/wk`}
                sublabel={`for ${result.validationRequirements.timeCommitment.duration}`}
              />
              <StatCard
                icon={<Target className="w-5 h-5 text-primary" />}
                iconBg="bg-muted"
                label="Phase"
                value={result.validationRequirements.timeCommitment.phase.split(' ').slice(0, 3).join(' ')}
              />
            </Grid>

            {/* Key Milestones */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-medium text-sm">Key Milestones Before Committing</span>
              </div>
              <div className="space-y-2">
                {result.validationRequirements.keyMilestones.map((milestone, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* The Numbers */}
        <Card variant="bordered" className="mb-6">
          <SectionHeader emoji="📊" title="The Numbers" />
          <Grid cols={2} gap={3}>
            <CompactMetric
              icon={<Zap className="w-4 h-4" />}
              label="Time to MVP"
              value={result.metrics.timeToMvp}
            />
            <CompactMetric
              icon={<TrendingUp className="w-4 h-4" />}
              label="First Revenue"
              value={result.metrics.timeToFirstRevenue}
            />
            <CompactMetric
              icon={<Users className="w-4 h-4" />}
              label="Users Needed"
              value={result.metrics.usersNeeded}
            />
            <CompactMetric
              icon={<Shield className="w-4 h-4" />}
              label="Competition"
              value={result.metrics.competition}
            />
          </Grid>
        </Card>

        {/* Action Plan */}
        <Card variant="bordered" className="mb-6">
          <SectionHeader emoji="📝" title="Do This First" subtitle="Your 30-day action plan" />
          <ol className="space-y-3">
            {result.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm pt-1">{action}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Detailed Analysis - if available */}
        {result.detailedAnalysis && (
          <Card variant="bordered" className="mb-6">
            <Details summary="📚 View detailed 9-agent analysis">
              <div className="prose prose-sm max-w-none text-muted">
                <pre className="whitespace-pre-wrap text-xs overflow-x-auto bg-muted/50 p-4 rounded-lg">
                  {result.detailedAnalysis}
                </pre>
              </div>
            </Details>
          </Card>
        )}

        {/* Collapsible Details */}
        <Card variant="bordered">
          <Details summary="📋 View input summary">
            <Grid cols={2} gap={4} className="mt-2">
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Product</h4>
                <p className="text-sm text-muted">{productSpec.thesis}</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Target User</h4>
                <p className="text-sm text-muted">{productSpec.targetUser || 'Not specified'}</p>
              </div>
              <div className="col-span-2 p-3 bg-card border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Founder Context</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted rounded text-xs">{founderContext.technicalSkill} developer</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">{founderContext.hoursPerWeek} hrs/week</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">{founderContext.runwayMonths} months runway</span>
                </div>
              </div>
            </Grid>
          </Details>
        </Card>
      </div>
    </main>
  );
}

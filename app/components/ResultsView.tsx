'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, VerdictBox, Details, ExpandableConcern, SectionHeader, ScoreCard, Grid, StatCard, CompactMetric } from './ui';
import { AnalysisResult, VERDICT_CONFIG, ProductSpec, FounderContext, AddressableConcern, ValidationRequirements } from '@/lib/types';
import { generateMarkdownExport } from '@/lib/store';
import { ArrowLeft, Download, CheckCircle, AlertTriangle, XCircle, DollarSign, Users, Clock, Target, TrendingUp, Zap, Shield } from 'lucide-react';

export interface ExtendedAnalysisResult extends AnalysisResult {
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

interface ResultsViewProps {
  result: ExtendedAnalysisResult;
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
  backUrl?: string;
  backLabel?: string;
  isSample?: boolean;
}

export function ResultsView({
  result,
  productSpec,
  founderContext,
  backUrl = '/',
  backLabel = 'Back to Dashboard',
  isSample = false,
}: ResultsViewProps) {
  const router = useRouter();
  const verdictConfig = VERDICT_CONFIG[result.verdict];

  const handleExport = () => {
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

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push(backUrl)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export .md
          </Button>
        </div>

        {isSample && (
          <div className="mb-6 p-4 bg-info-bg border border-info/30 rounded-lg">
            <p className="text-sm text-info">
              <strong>Sample Report</strong> — This is an example analysis for "InvoiceBot" to show you what a report looks like.
            </p>
          </div>
        )}

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
                  <li key={i} className="text-sm text-foreground/70">• {s}</li>
                ))}
              </ul>
            </div>

            {/* Must Address - Now with expandable concerns */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-sm">What you need to address</span>
                <span className="text-xs text-foreground/50">(click to see how to fix)</span>
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
                  <div key={i} className="text-sm text-foreground/70 pl-6">• {m}</div>
                ))}
              </div>
            </div>

            {/* Risks - Now with expandable concerns */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-danger" />
                <span className="font-medium text-sm">What could kill it</span>
                <span className="text-xs text-foreground/50">(click to see how to fix)</span>
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
                  <div key={i} className="text-sm text-foreground/70 pl-6">• {r}</div>
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
                    <span className="text-sm text-foreground/70">{milestone}</span>
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
              <div className="prose prose-sm max-w-none text-foreground/70">
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
                <p className="text-sm text-foreground/70">{productSpec.thesis}</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Target User</h4>
                <p className="text-sm text-foreground/70">{productSpec.targetUser || 'Not specified'}</p>
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

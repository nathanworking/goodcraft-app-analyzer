'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronRight, Zap, Target } from 'lucide-react';

// Re-export Coss UI components
export { Button } from '@/components/ui/button';
export { Input } from '@/components/ui/input';
export { Textarea } from '@/components/ui/textarea';
export { NativeSelect as Select } from '@/components/ui/select';
export { Card } from '@/components/ui/card';

// Section Header with optional emoji
interface SectionHeaderProps {
  title: string;
  emoji?: string;
  subtitle?: string;
}

export function SectionHeader({ title, emoji, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </h2>
      {subtitle && <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>}
    </div>
  );
}

// Score Card - for displaying individual metric scores
interface ScoreCardProps {
  score: number;
  label: string;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCard({ score, label, maxScore = 10, size = 'md' }: ScoreCardProps) {
  const getScoreColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.7) return 'text-success';
    if (ratio >= 0.5) return 'text-warning';
    return 'text-danger';
  };

  const sizeClasses = {
    sm: { container: 'p-2', score: 'text-lg', label: 'text-xs' },
    md: { container: 'p-3', score: 'text-2xl', label: 'text-xs' },
    lg: { container: 'p-4', score: 'text-3xl', label: 'text-sm' },
  };

  return (
    <div className={clsx('text-center bg-card border border-border rounded-lg', sizeClasses[size].container)}>
      <div className={clsx('font-bold', sizeClasses[size].score, getScoreColor(score, maxScore))}>
        {score}<span className="text-foreground/50 font-normal text-base">/{maxScore}</span>
      </div>
      <div className={clsx('text-foreground/60 mt-1', sizeClasses[size].label)}>{label}</div>
    </div>
  );
}

// Grid layouts
interface GridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6;
  className?: string;
}

export function Grid({ children, cols = 2, gap = 4, className }: GridProps) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };

  return (
    <div className={clsx('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Stat Card - for key metrics with icon
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  iconBg?: string;
}

export function StatCard({ icon, label, value, sublabel, iconBg = 'bg-muted' }: StatCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-foreground/50 uppercase tracking-wide">{label}</div>
        <div className="text-lg font-bold truncate">{value}</div>
        {sublabel && <div className="text-sm text-foreground/60">{sublabel}</div>}
      </div>
    </div>
  );
}

// Compact Metric - inline metric display
interface CompactMetricProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export function CompactMetric({ label, value, icon }: CompactMetricProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        {icon && <span className="text-foreground/50">{icon}</span>}
        <span className="text-sm text-foreground/60">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

// List Card - for displaying a list with a header
interface ListCardProps {
  title: string;
  items: string[];
  icon?: React.ReactNode;
  ordered?: boolean;
}

export function ListCard({ title, items, icon, ordered = false }: ListCardProps) {
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-foreground/50">{icon}</span>}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ListTag className={clsx('space-y-1.5', ordered ? 'list-decimal list-inside' : '')}>
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
            {!ordered && <span className="text-primary shrink-0">•</span>}
            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    </div>
  );
}

// Divider with optional label
interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (label) {
    return (
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-foreground/50 uppercase tracking-wide">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return <div className="h-px bg-border my-6" />;
}

// Custom components that don't have Coss UI equivalents

// Progress Steps
interface StepsProps {
  steps: string[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={clsx(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
              {
                'bg-white text-gray-900': index <= currentStep,
                'bg-white/30 text-white/70': index > currentStep,
              }
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={clsx('w-12 h-0.5 mx-2 transition-colors', {
                'bg-white': index < currentStep,
                'bg-white/30': index >= currentStep,
              })}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Verdict Box
interface VerdictBoxProps {
  emoji: string;
  label: string;
  score: number;
  summary: string;
  bgColor: string;
}

export function VerdictBox({ emoji, label, score, summary, bgColor }: VerdictBoxProps) {
  return (
    <div className={clsx('rounded-xl p-6 border-2 border-border', bgColor)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <span className="text-2xl font-bold">{label}</span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{score.toFixed(1)}</div>
          <div className="text-sm text-foreground/50">/10</div>
        </div>
      </div>
      <p className="text-foreground">{summary}</p>
    </div>
  );
}

// Metric Row
interface MetricRowProps {
  label: string;
  value: string;
  status?: 'good' | 'warning' | 'bad';
}

export function MetricRow({ label, value, status }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-foreground/60">{label}</span>
      <span
        className={clsx('font-medium', {
          'text-success': status === 'good',
          'text-warning': status === 'warning',
          'text-danger': status === 'bad',
          'text-foreground': !status,
        })}
      >
        {value}
      </span>
    </div>
  );
}

// Collapsible Details
interface DetailsProps {
  summary: string;
  children: React.ReactNode;
}

export function Details({ summary, children }: DetailsProps) {
  return (
    <details className="group">
      <summary className="flex items-center gap-2 cursor-pointer text-foreground/60 hover:text-foreground transition-colors py-2">
        <svg
          className="w-4 h-4 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {summary}
      </summary>
      <div className="pt-2 pl-6">{children}</div>
    </details>
  );
}

// Expandable Concern with Fix Suggestion
interface ExpandableConcernProps {
  concern: string;
  howToFix: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  variant: 'warning' | 'danger';
  icon: React.ReactNode;
}

const EFFORT_CONFIG = {
  low: { label: 'Low effort', color: 'bg-success-bg text-success' },
  medium: { label: 'Medium effort', color: 'bg-warning-bg text-warning' },
  high: { label: 'High effort', color: 'bg-danger-bg text-danger' },
};

const IMPACT_CONFIG = {
  low: { label: 'Low impact', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  medium: { label: 'Medium impact', color: 'bg-info-bg text-info' },
  high: { label: 'High impact', color: 'bg-success-bg text-success' },
};

export function ExpandableConcern({
  concern,
  howToFix,
  effort,
  impact,
  variant,
  icon,
}: ExpandableConcernProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={clsx(
        'rounded-lg border transition-all',
        variant === 'warning' ? 'border-warning/30' : 'border-danger/30',
        isExpanded && (variant === 'warning' ? 'bg-warning-bg/50' : 'bg-danger-bg/50')
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-2 p-3 text-left hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
      >
        <ChevronRight
          className={clsx(
            'w-4 h-4 mt-0.5 transition-transform shrink-0',
            isExpanded && 'rotate-90'
          )}
        />
        <span className="shrink-0 mt-0.5">{icon}</span>
        <span className="text-sm">{concern}</span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pl-9 space-y-3">
          <div className="text-sm text-foreground/70 bg-background rounded-md p-3 border border-border">
            <div className="font-medium text-foreground mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              How to fix
            </div>
            {howToFix}
          </div>
          <div className="flex gap-2">
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                EFFORT_CONFIG[effort].color
              )}
            >
              <Zap className="w-3 h-3" />
              {EFFORT_CONFIG[effort].label}
            </span>
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                IMPACT_CONFIG[impact].color
              )}
            >
              <Target className="w-3 h-3" />
              {IMPACT_CONFIG[impact].label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

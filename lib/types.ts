export interface ProductSpec {
  name: string;
  thesis: string;
  targetUser: string;
  category: ProductCategory;
  mvpFeatures: string;
  pricing: string;
  distribution: string;
}

export interface FounderContext {
  technicalSkill: TechnicalSkill;
  domainExperience: string;
  existingAudience: string;
  hoursPerWeek: number;
  runwayMonths: number;
  riskTolerance: RiskTolerance;
}

export type ProductCategory =
  | 'b2b-saas'
  | 'b2c-saas'
  | 'developer-tools'
  | 'fintech'
  | 'marketplace'
  | 'creator-tools'
  | 'other';

export type TechnicalSkill =
  | 'non-technical'
  | 'beginner'
  | 'intermediate'
  | 'senior'
  | 'expert';

export type RiskTolerance =
  | 'conservative'
  | 'moderate'
  | 'aggressive';

export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface AddressableConcern {
  concern: string;
  howToFix: string;
  effort: EffortLevel;
  impact: ImpactLevel;
  type: 'mustAddress' | 'risk';
}

export interface ValidationRequirements {
  capitalNeeded: {
    amount: string;
    reason: string;
  };
  interestedPeople: {
    count: number;
    type: string;
    why: string;
  };
  timeCommitment: {
    hoursPerWeek: number;
    duration: string;
    phase: string;
  };
  keyMilestones: string[];
}

export type Verdict =
  | 'build'
  | 'build-with-changes'
  | 'maybe'
  | 'pivot'
  | 'pass';

export interface AnalysisResult {
  productName: string;
  overallScore: number;
  verdict: Verdict;
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
  fullAnalysis?: string;
  addressableConcerns?: AddressableConcern[];
  validationRequirements?: ValidationRequirements;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'b2b-saas': 'B2B SaaS',
  'b2c-saas': 'B2C SaaS',
  'developer-tools': 'Developer Tools',
  'fintech': 'Fintech',
  'marketplace': 'Marketplace',
  'creator-tools': 'Creator Tools',
  'other': 'Other',
};

export const SKILL_LABELS: Record<TechnicalSkill, string> = {
  'non-technical': 'Non-technical',
  'beginner': 'Beginner (< 1 year)',
  'intermediate': 'Intermediate (1-3 years)',
  'senior': 'Senior (3-7 years)',
  'expert': 'Expert (7+ years)',
};

export const RISK_LABELS: Record<RiskTolerance, string> = {
  'conservative': 'Conservative - Prefer safe bets',
  'moderate': 'Moderate - Balanced approach',
  'aggressive': 'Aggressive - High risk, high reward',
};

export const VERDICT_CONFIG: Record<Verdict, { label: string; emoji: string; color: string; bgColor: string }> = {
  'build': {
    label: 'BUILD IT',
    emoji: '🟢',
    color: 'text-success',
    bgColor: 'bg-success-bg'
  },
  'build-with-changes': {
    label: 'BUILD IT (with changes)',
    emoji: '🟡',
    color: 'text-warning',
    bgColor: 'bg-warning-bg'
  },
  'maybe': {
    label: 'MAYBE (big questions remain)',
    emoji: '🟠',
    color: 'text-warning',
    bgColor: 'bg-warning-bg'
  },
  'pivot': {
    label: "DON'T BUILD THIS",
    emoji: '🔴',
    color: 'text-danger',
    bgColor: 'bg-danger-bg'
  },
  'pass': {
    label: 'PASS',
    emoji: '⛔',
    color: 'text-danger',
    bgColor: 'bg-danger-bg'
  },
};

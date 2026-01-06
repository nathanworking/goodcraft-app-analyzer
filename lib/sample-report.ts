import { AnalysisResult, ProductSpec, FounderContext, AddressableConcern, ValidationRequirements } from './types';

export const sampleProductSpec: Partial<ProductSpec> = {
  name: 'InvoiceBot',
  thesis: 'Freelancers spend 2+ hours/week creating invoices manually. InvoiceBot auto-generates branded invoices from time tracking data, saving time and reducing errors.',
  targetUser: 'Solo freelancers and small agencies who bill hourly',
  category: 'b2b-saas',
  mvpFeatures: `- Connect to Toggl/Clockify
- Generate PDF invoices
- Email invoices to clients
- Simple dashboard
- Payment tracking`,
  pricing: '$9/month with 14-day free trial',
  distribution: 'ProductHunt launch, freelancer communities (r/freelance, Indie Hackers), content marketing on Twitter',
};

export const sampleFounderContext: Partial<FounderContext> = {
  technicalSkill: 'senior',
  domainExperience: '5 years as a freelancer, built 2 SaaS products before, know the invoicing pain firsthand',
  existingAudience: '2K Twitter followers in freelance space, 500 email subscribers',
  hoursPerWeek: 25,
  runwayMonths: 18,
  riskTolerance: 'moderate',
};

const sampleAddressableConcerns: AddressableConcern[] = [
  {
    concern: 'Crowded market with established players like FreshBooks and Wave',
    howToFix: 'Focus on a specific niche (e.g., developers, designers) and build features they care about most. Compete on simplicity and modern UX rather than feature count.',
    effort: 'medium',
    impact: 'high',
    type: 'mustAddress',
  },
  {
    concern: 'Time tracking integrations require ongoing maintenance',
    howToFix: 'Start with just 2-3 popular integrations (Toggl, Clockify) and use their official APIs. Consider using Zapier as a fallback for other tools.',
    effort: 'low',
    impact: 'medium',
    type: 'mustAddress',
  },
  {
    concern: 'Payment processing adds regulatory complexity',
    howToFix: 'Use Stripe for payment links in invoices. Let them handle compliance. Avoid holding funds yourself.',
    effort: 'low',
    impact: 'high',
    type: 'risk',
  },
  {
    concern: 'Low switching costs mean users can easily churn',
    howToFix: 'Build sticky features: recurring invoice templates, client history, tax reports. Make the data export clean but switching painful.',
    effort: 'high',
    impact: 'high',
    type: 'risk',
  },
];

const sampleValidationRequirements: ValidationRequirements = {
  capitalNeeded: {
    amount: '$0-1K',
    reason: 'MVP can be bootstrapped with existing tools and free tiers',
  },
  interestedPeople: {
    count: 50,
    type: 'freelancers who track time',
    why: 'Need to validate they actually want auto-invoicing vs just better templates',
  },
  timeCommitment: {
    hoursPerWeek: 25,
    duration: '3 months',
    phase: 'To reach MVP and first paying customers',
  },
  keyMilestones: [
    '10 customer interviews confirming the pain point',
    'Landing page with 100+ waitlist signups',
    '5 users willing to pay before seeing the product',
    'Working prototype with Toggl integration',
    'First paying customer within 6 weeks of launch',
  ],
};

export const sampleAnalysisResult = {
  productName: 'InvoiceBot',
  overallScore: 7.2,
  verdict: 'build-with-changes' as const,
  verdictSummary: 'You have strong technical skills and domain experience to build this. Your existing audience gives you a distribution advantage. The market is crowded but there\'s room for a focused, modern solution. Key challenge: differentiate from free alternatives.',
  strengths: [
    'Strong technical skills reduce execution risk',
    'Domain experience gives you insight into real user needs',
    'Existing audience provides distribution advantage',
    'Focused MVP scope - can ship quickly',
    'Solid runway gives time to iterate',
  ],
  mustAddress: [
    'Crowded market with established players like FreshBooks and Wave',
    'Time tracking integrations require ongoing maintenance',
    'Need clear differentiation from free alternatives',
  ],
  risks: [
    'Payment processing adds regulatory complexity',
    'Low switching costs mean users can easily churn',
    'Competitors could copy features if successful',
  ],
  metrics: {
    timeToMvp: '4-6 weeks',
    timeToFirstRevenue: '1-2 months',
    usersNeeded: '~500 for $5K MRR',
    competition: 'High (10+ established players)',
  },
  actions: [
    'Interview 10 freelancers about invoicing pain this week',
    'Build landing page with waitlist (aim for 100 signups)',
    'Ship Toggl integration + basic invoice generation first',
    'Pre-sell to 5 users before full launch',
    'Launch on ProductHunt within 6 weeks',
  ],
  dimensionScores: {
    team: 8,
    buildComplexity: 7,
    competition: 5,
    financialPath: 7,
    userAcquisition: 8,
    technicalRisk: 8,
    defensibility: 5,
    capitalEfficiency: 9,
    pivotPotential: 7,
  },
  addressableConcerns: sampleAddressableConcerns,
  validationRequirements: sampleValidationRequirements,
};

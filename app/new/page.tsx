'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, Card, Steps } from '../components/ui';
import {
  ProductSpec,
  FounderContext,
  ProductCategory,
  TechnicalSkill,
  RiskTolerance,
  CATEGORY_LABELS,
  SKILL_LABELS,
  RISK_LABELS,
} from '@/lib/types';
import { getStoredData, setStoredData } from '@/lib/store';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import LiquidEther from '@/components/LiquidEther';

const STEPS = ['Product', 'Founder', 'Review'];

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const skillOptions = Object.entries(SKILL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const riskOptions = Object.entries(RISK_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [productSpec, setProductSpec] = useState<Partial<ProductSpec>>({
    category: 'b2b-saas',
  });
  const [founderContext, setFounderContext] = useState<Partial<FounderContext>>({
    technicalSkill: 'intermediate',
    riskTolerance: 'moderate',
    hoursPerWeek: 20,
    runwayMonths: 12,
  });

  useEffect(() => {
    const stored = getStoredData();
    if (stored.productSpec && Object.keys(stored.productSpec).length > 0) {
      setProductSpec((prev) => ({ ...prev, ...stored.productSpec }));
    }
    if (stored.founderContext && Object.keys(stored.founderContext).length > 0) {
      setFounderContext((prev) => ({ ...prev, ...stored.founderContext }));
    }
  }, []);

  const updateProduct = (updates: Partial<ProductSpec>) => {
    const updated = { ...productSpec, ...updates };
    setProductSpec(updated);
    setStoredData({ productSpec: updated });
  };

  const updateFounder = (updates: Partial<FounderContext>) => {
    const updated = { ...founderContext, ...updates };
    setFounderContext(updated);
    setStoredData({ founderContext: updated });
  };

  const canProceed = () => {
    if (step === 0) {
      return productSpec.name && productSpec.thesis && productSpec.mvpFeatures;
    }
    if (step === 1) {
      return founderContext.technicalSkill && founderContext.hoursPerWeek;
    }
    return true;
  };

  const handleAnalyze = () => {
    setStoredData({ productSpec, founderContext });
    router.push('/results');
  };

  return (
    <main className="min-h-screen py-12 px-4 relative">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 -z-10 bg-neutral-950">
        <LiquidEther
          mouseForce={8}
          cursorSize={210}
          isViscous
          viscous={20}
          colors={["#d1d1d1", "#292929", "#949494"]}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={1.5}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Idea Analyzer</h1>
          <p className="text-gray-200">Should you build it? Let&apos;s find out.</p>
        </div>

        <div className="mb-8">
          <Steps steps={STEPS} currentStep={step} />
        </div>

        <Card variant="bordered" className="mb-6">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Tell us about your product</h2>

              <Input
                label="Product Name *"
                placeholder="e.g., InvoiceBot"
                value={productSpec.name || ''}
                onChange={(e) => updateProduct({ name: e.target.value })}
              />

              <Select
                label="Category"
                options={categoryOptions}
                value={productSpec.category || 'b2b-saas'}
                onChange={(e) => updateProduct({ category: e.target.value as ProductCategory })}
              />

              <Textarea
                label="What problem does it solve? *"
                hint="Describe the pain point and your solution in 2-3 sentences"
                placeholder="e.g., Freelancers spend 2+ hours/week creating invoices manually. InvoiceBot auto-generates branded invoices from time tracking data."
                value={productSpec.thesis || ''}
                onChange={(e) => updateProduct({ thesis: e.target.value })}
              />

              <Textarea
                label="Who is this for?"
                placeholder="e.g., Solo freelancers and small agencies who bill hourly"
                value={productSpec.targetUser || ''}
                onChange={(e) => updateProduct({ targetUser: e.target.value })}
              />

              <Textarea
                label="MVP Features *"
                hint="List the core features for v1 (one per line)"
                placeholder="e.g.,&#10;- Connect to Toggl/Clockify&#10;- Generate PDF invoices&#10;- Email invoices to clients&#10;- Simple dashboard"
                value={productSpec.mvpFeatures || ''}
                onChange={(e) => updateProduct({ mvpFeatures: e.target.value })}
                className="min-h-[150px]"
              />

              <Input
                label="Pricing"
                placeholder="e.g., $9/month or Free with $19/month pro"
                value={productSpec.pricing || ''}
                onChange={(e) => updateProduct({ pricing: e.target.value })}
              />

              <Textarea
                label="How will you get users?"
                placeholder="e.g., Post in freelancer communities, content marketing on Twitter, ProductHunt launch"
                value={productSpec.distribution || ''}
                onChange={(e) => updateProduct({ distribution: e.target.value })}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Tell us about you</h2>

              <Select
                label="Technical Skill Level"
                options={skillOptions}
                value={founderContext.technicalSkill || 'intermediate'}
                onChange={(e) =>
                  updateFounder({ technicalSkill: e.target.value as TechnicalSkill })
                }
              />

              <Textarea
                label="Relevant Experience"
                placeholder="e.g., 5 years as a freelancer, built 2 SaaS products before, know the invoicing pain firsthand"
                value={founderContext.domainExperience || ''}
                onChange={(e) => updateFounder({ domainExperience: e.target.value })}
              />

              <Textarea
                label="Existing Audience"
                placeholder="e.g., 2K Twitter followers in freelance space, 500 email subscribers, active in 3 Slack communities"
                value={founderContext.existingAudience || ''}
                onChange={(e) => updateFounder({ existingAudience: e.target.value })}
              />

              <Input
                label="Hours per week available"
                type="number"
                min={1}
                max={80}
                value={founderContext.hoursPerWeek || 20}
                onChange={(e) => updateFounder({ hoursPerWeek: parseInt(e.target.value) || 20 })}
              />

              <Input
                label="Runway (months)"
                type="number"
                min={1}
                max={60}
                value={founderContext.runwayMonths || 12}
                onChange={(e) => updateFounder({ runwayMonths: parseInt(e.target.value) || 12 })}
              />

              <Select
                label="Risk Tolerance"
                options={riskOptions}
                value={founderContext.riskTolerance || 'moderate'}
                onChange={(e) =>
                  updateFounder({ riskTolerance: e.target.value as RiskTolerance })
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review & Analyze</h2>

              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg">
                  <h3 className="font-medium mb-2">Product</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Name:</dt>
                      <dd>{productSpec.name || '-'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Category:</dt>
                      <dd>{CATEGORY_LABELS[productSpec.category as ProductCategory] || '-'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Problem:</dt>
                      <dd className="flex-1">{productSpec.thesis || '-'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Pricing:</dt>
                      <dd>{productSpec.pricing || '-'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <h3 className="font-medium mb-2">Founder</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Skill:</dt>
                      <dd>{SKILL_LABELS[founderContext.technicalSkill as TechnicalSkill] || '-'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Hours/week:</dt>
                      <dd>{founderContext.hoursPerWeek}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Runway:</dt>
                      <dd>{founderContext.runwayMonths} months</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-foreground/60 w-24">Risk:</dt>
                      <dd>{RISK_LABELS[founderContext.riskTolerance as RiskTolerance]?.split(' - ')[0] || '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="p-4 border border-info bg-info-bg rounded-lg">
                <p className="text-sm">
                  <strong>Ready to analyze!</strong> We&apos;ll evaluate your idea across 9 dimensions:
                  team fit, build complexity, competition, financials, user acquisition, technical risk,
                  defensibility, capital efficiency, and pivot potential.
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="text-white hover:bg-white/20 hover:text-white disabled:text-white/40"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleAnalyze}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Idea
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

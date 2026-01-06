'use client';

import { ResultsView, ExtendedAnalysisResult } from '../components/ResultsView';
import { sampleAnalysisResult, sampleProductSpec, sampleFounderContext } from '@/lib/sample-report';

export default function SamplePage() {
  return (
    <ResultsView
      result={sampleAnalysisResult as ExtendedAnalysisResult}
      productSpec={sampleProductSpec}
      founderContext={sampleFounderContext}
      backUrl="/"
      backLabel="Back to Dashboard"
      isSample={true}
    />
  );
}

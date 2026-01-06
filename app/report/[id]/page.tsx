'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ResultsView, ExtendedAnalysisResult } from '../../components/ResultsView';
import { ProductSpec, FounderContext } from '@/lib/types';
import { RefreshCw, XCircle } from 'lucide-react';
import { Button } from '../../components/ui';

interface ReportData {
  result: ExtendedAnalysisResult;
  product_spec: Partial<ProductSpec>;
  founder_context: Partial<FounderContext>;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${resolvedParams.id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Report not found');
        }

        setReport({
          result: data.report.result,
          product_spec: data.report.product_spec,
          founder_context: data.report.founder_context,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">Loading report...</h2>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-8 h-8 mx-auto mb-4 text-danger" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-foreground/60 mb-4">{error || 'This report does not exist or has been deleted.'}</p>
          <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
        </div>
      </main>
    );
  }

  return (
    <ResultsView
      result={report.result}
      productSpec={report.product_spec}
      founderContext={report.founder_context}
      backUrl="/"
      backLabel="Back to Dashboard"
    />
  );
}

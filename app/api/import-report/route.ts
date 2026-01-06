import { NextRequest, NextResponse } from 'next/server';
import { saveReport } from '@/lib/db';
import { AnalysisResult, ProductSpec, FounderContext, Verdict } from '@/lib/types';

interface ImportData {
  productSpec: Partial<ProductSpec>;
  founderContext: Partial<FounderContext>;
  result: AnalysisResult;
}

export async function POST(request: NextRequest) {
  try {
    const data: ImportData = await request.json();

    const reportId = await saveReport(
      data.productSpec,
      data.founderContext,
      data.result
    );

    return NextResponse.json({ success: true, reportId });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    );
  }
}

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildAnalyzerPrompt, parseAnalyzerResponse } from '@/lib/analyzer-prompt';
import { ProductSpec, FounderContext } from '@/lib/types';
import { saveReport } from '@/lib/db';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSpec, founderContext } = body as {
      productSpec: Partial<ProductSpec>;
      founderContext: Partial<FounderContext>;
    };

    if (!productSpec?.name) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = buildAnalyzerPrompt(productSpec, founderContext);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => {
        if (block.type === 'text') {
          return block.text;
        }
        return '';
      })
      .join('\n');

    const parsed = parseAnalyzerResponse(responseText);

    if (!parsed.success || !parsed.data) {
      return NextResponse.json(
        {
          error: parsed.error || 'Failed to parse response',
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }

    const result = {
      productName: productSpec.name || 'Unnamed Product',
      ...parsed.data,
    };

    // Try to save to database (don't fail if DB isn't set up)
    let reportId: string | null = null;
    try {
      // Cast to AnalysisResult for database storage
      reportId = await saveReport(productSpec, founderContext, result as import('@/lib/types').AnalysisResult);
    } catch (dbError) {
      console.warn('Failed to save report to database:', dbError);
      // Continue without failing - DB might not be set up yet
    }

    return NextResponse.json({
      success: true,
      result,
      reportId,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

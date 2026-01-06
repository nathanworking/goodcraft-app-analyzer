import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildAnalyzerPrompt, parseAnalyzerResponse } from '@/lib/analyzer-prompt';
import { ProductSpec, FounderContext } from '@/lib/types';

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

    return NextResponse.json({
      success: true,
      result: {
        productName: productSpec.name,
        ...parsed.data,
      },
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

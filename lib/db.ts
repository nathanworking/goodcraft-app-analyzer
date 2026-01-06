import { sql } from '@vercel/postgres';
import { AnalysisResult, ProductSpec, FounderContext } from './types';

export interface Report {
  id: string;
  product_name: string;
  product_spec: Partial<ProductSpec>;
  founder_context: Partial<FounderContext>;
  result: AnalysisResult;
  created_at: Date;
}

export interface ReportSummary {
  id: string;
  product_name: string;
  verdict: string;
  overall_score: number;
  created_at: Date;
}

// Initialize the database schema
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_name TEXT NOT NULL,
      product_spec JSONB NOT NULL,
      founder_context JSONB NOT NULL,
      result JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Create index for faster queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC)
  `;
}

// Save a new report
export async function saveReport(
  productSpec: Partial<ProductSpec>,
  founderContext: Partial<FounderContext>,
  result: AnalysisResult
): Promise<string> {
  const { rows } = await sql`
    INSERT INTO reports (product_name, product_spec, founder_context, result)
    VALUES (
      ${result.productName},
      ${JSON.stringify(productSpec)},
      ${JSON.stringify(founderContext)},
      ${JSON.stringify(result)}
    )
    RETURNING id
  `;
  return rows[0].id;
}

// Get a single report by ID
export async function getReport(id: string): Promise<Report | null> {
  const { rows } = await sql`
    SELECT id, product_name, product_spec, founder_context, result, created_at
    FROM reports
    WHERE id = ${id}
  `;

  if (rows.length === 0) return null;

  return {
    id: rows[0].id,
    product_name: rows[0].product_name,
    product_spec: rows[0].product_spec,
    founder_context: rows[0].founder_context,
    result: rows[0].result,
    created_at: new Date(rows[0].created_at),
  };
}

// Get list of recent reports (summaries only)
export async function getReportsList(limit: number = 20): Promise<ReportSummary[]> {
  const { rows } = await sql`
    SELECT
      id,
      product_name,
      result->>'verdict' as verdict,
      (result->>'overallScore')::numeric as overall_score,
      created_at
    FROM reports
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return rows.map(row => ({
    id: row.id,
    product_name: row.product_name,
    verdict: row.verdict,
    overall_score: parseFloat(row.overall_score),
    created_at: new Date(row.created_at),
  }));
}

// Delete a report
export async function deleteReport(id: string): Promise<boolean> {
  const { rowCount } = await sql`
    DELETE FROM reports WHERE id = ${id}
  `;
  return (rowCount ?? 0) > 0;
}

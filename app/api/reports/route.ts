import { NextResponse } from 'next/server';
import { getReportsList } from '@/lib/db';

export async function GET() {
  try {
    const reports = await getReportsList(50);
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    // Return empty array if database isn't set up yet
    return NextResponse.json({ success: true, reports: [] });
  }
}

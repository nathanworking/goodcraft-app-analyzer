import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function POST() {
  try {
    await initDb();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { generateCodingProfile } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeName, apiKey } = body;

    if (!storeName) {
      return NextResponse.json(
        { error: 'Store name is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required' },
        { status: 400 }
      );
    }

    const profile = await generateCodingProfile(storeName, apiKey);

    return NextResponse.json({
      profile,
      count: profile.length,
    });
  } catch (error: any) {
    console.error('Error generating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
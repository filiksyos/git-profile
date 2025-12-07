import { NextRequest, NextResponse } from 'next/server';
import { indexRepositories } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, repositories, apiKey } = body;

    if (!username || !repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { error: 'Username and repositories array are required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required' },
        { status: 400 }
      );
    }

    if (repositories.length === 0) {
      return NextResponse.json(
        { error: 'At least one repository is required' },
        { status: 400 }
      );
    }

    const result = await indexRepositories(username, repositories, apiKey);

    return NextResponse.json({
      storeName: result.storeName,
      filesIndexed: result.filesIndexed,
      message: `Successfully indexed ${repositories.length} repositories`,
    });
  } catch (error: any) {
    console.error('Error indexing repositories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to index repositories' },
      { status: 500 }
    );
  }
}
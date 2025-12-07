import { NextRequest, NextResponse } from 'next/server';
import { fetchUserRepositories } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const repositories = await fetchUserRepositories(username);

    return NextResponse.json({
      repositories,
      count: repositories.length,
    });
  } catch (error: any) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
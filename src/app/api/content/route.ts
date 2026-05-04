import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/mistral';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, keyword } = body;

    if (!title || !keyword) {
      return NextResponse.json(
        { error: 'Title and keyword are required' },
        { status: 400 }
      );
    }

    const content = await generateContent(title, keyword);

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    console.error('Content API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content',
      },
      { status: 500 }
    );
  }
}

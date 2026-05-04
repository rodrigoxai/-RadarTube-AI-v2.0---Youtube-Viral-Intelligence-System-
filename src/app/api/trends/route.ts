import { NextRequest, NextResponse } from 'next/server';
import { searchVideosByKeyword, getTrendingVideos } from '@/lib/youtube';
import { calculateViralScore } from '@/lib/viralScore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, mode = 'search' } = body;

    let videos;

    if (mode === 'trending') {
      videos = await getTrendingVideos('BR', 20);
    } else if (keyword) {
      videos = await searchVideosByKeyword(keyword, 20);
    } else {
      return NextResponse.json(
        { error: 'Keyword is required for search mode' },
        { status: 400 }
      );
    }

    const results = videos.map((video) => {
      const viralScore = calculateViralScore(
        video.views,
        video.likes,
        video.comments,
        video.publishedAt
      );

      return {
        ...video,
        viralScore,
        watchUrl: `https://www.youtube.com/watch?v=${video.id}`,
      };
    });

    // Sort by viral score descending
    results.sort((a, b) => b.viralScore.percentage - a.viralScore.percentage);

    return NextResponse.json({
      success: true,
      keyword,
      mode,
      count: results.length,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Trends API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch trends',
        data: [],
      },
      { status: 500 }
    );
  }
}

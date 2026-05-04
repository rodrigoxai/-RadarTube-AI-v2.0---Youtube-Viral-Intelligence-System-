const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAPECXRcLUV731LJVxaE-OifPCj9rGDWE';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface VideoData {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  description: string;
}

export async function searchVideosByKeyword(
  keyword: string,
  maxResults: number = 20
): Promise<VideoData[]> {
  try {
    const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&order=relevance&videoEmbeddable=true`;

    const searchRes = await fetch(searchUrl, { next: { revalidate: 0 } });

    if (!searchRes.ok) {
      const errorData = await searchRes.json().catch(() => null);
      throw new Error(`YouTube Search API error: ${searchRes.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .filter(Boolean)
      .join(',');

    if (!videoIds) {
      return [];
    }

    const statsUrl = `${BASE_URL}/videos?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl, { next: { revalidate: 0 } });

    if (!statsRes.ok) {
      const errorData = await statsRes.json().catch(() => null);
      throw new Error(`YouTube Stats API error: ${statsRes.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const statsData = await statsRes.json();

    const videos: VideoData[] = statsData.items
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        views: parseInt(item.statistics.viewCount || '0'),
        likes: parseInt(item.statistics.likeCount || '0'),
        comments: parseInt(item.statistics.commentCount || '0'),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        description: item.snippet.description,
      }))
      .filter((v: VideoData) => v.views > 0);

    return videos;
  } catch (error: any) {
    console.error('YouTube API Error:', error.message);
    throw new Error(`Failed to fetch YouTube data: ${error.message}`);
  }
}

export async function getTrendingVideos(
  regionCode: string = 'BR',
  maxResults: number = 20
): Promise<VideoData[]> {
  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(`YouTube Trending API error: ${res.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await res.json();

    const videos: VideoData[] = data.items
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        views: parseInt(item.statistics.viewCount || '0'),
        likes: parseInt(item.statistics.likeCount || '0'),
        comments: parseInt(item.statistics.commentCount || '0'),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        description: item.snippet.description,
      }))
      .filter((v: VideoData) => v.views > 0);

    return videos;
  } catch (error: any) {
    console.error('YouTube Trending API Error:', error.message);
    throw new Error(`Failed to fetch trending data: ${error.message}`);
  }
}

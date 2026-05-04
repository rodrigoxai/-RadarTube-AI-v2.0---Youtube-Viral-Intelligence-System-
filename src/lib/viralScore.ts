export interface ViralScoreResult {
  score: number;
  percentage: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: {
    velocityScore: number;
    engagementScore: number;
    freshnessScore: number;
    ratioScore: number;
  };
}

export function calculateViralScore(
  views: number,
  likes: number,
  comments: number,
  publishedAt: string
): ViralScoreResult {
  try {
    const now = new Date();
    const published = new Date(publishedAt);
    const hoursSincePost = Math.max(
      (now.getTime() - published.getTime()) / (1000 * 60 * 60),
      0.1
    );

    // Velocity: views per hour (normalized)
    const viewsPerHour = views / hoursSincePost;
    const velocityScore = Math.min(viewsPerHour / 5000, 1) * 100;

    // Engagement rate: (likes + comments*2) / views
    const engagementRate =
      views > 0 ? ((likes + comments * 2) / views) * 100 : 0;
    const engagementScore = Math.min(engagementRate / 15, 1) * 100;

    // Freshness: newer videos get boost
    const freshnessScore = Math.max(0, 100 - hoursSincePost * 0.5);

    // Like/View ratio + Comment/View ratio
    const likeRatio = views > 0 ? likes / views : 0;
    const commentRatio = views > 0 ? comments / views : 0;
    const ratioScore = Math.min((likeRatio * 5000 + commentRatio * 10000) / 2, 1) * 100;

    // Weighted final score (YouTube 2026 algorithm weights)
    const rawScore =
      velocityScore * 0.35 +
      engagementScore * 0.30 +
      freshnessScore * 0.15 +
      ratioScore * 0.20;

    const percentage = Math.min(Math.max(rawScore, 0), 100);

    let level: 'HIGH' | 'MEDIUM' | 'LOW';
    if (percentage >= 75) level = 'HIGH';
    else if (percentage >= 40) level = 'MEDIUM';
    else level = 'LOW';

    return {
      score: Math.round(rawScore * 10) / 10,
      percentage: Math.round(percentage),
      level,
      breakdown: {
        velocityScore: Math.round(velocityScore),
        engagementScore: Math.round(engagementScore),
        freshnessScore: Math.round(freshnessScore),
        ratioScore: Math.round(ratioScore),
      },
    };
  } catch (error) {
    console.error('Viral Score Calculation Error:', error);
    return {
      score: 0,
      percentage: 0,
      level: 'LOW',
      breakdown: {
        velocityScore: 0,
        engagementScore: 0,
        freshnessScore: 0,
        ratioScore: 0,
      },
    };
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function hoursAgo(dateString: string): string {
  const hours =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60);
  if (hours < 1) return 'Less than 1h ago';
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

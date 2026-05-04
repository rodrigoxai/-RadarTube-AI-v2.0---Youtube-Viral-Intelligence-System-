'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface VideoData {
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
  viralScore: {
    score: number;
    percentage: number;
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    breakdown: {
      velocityScore: number;
      engagementScore: number;
      freshnessScore: number;
      ratioScore: number;
    };
  };
  watchUrl: string;
}

interface ContentSuggestion {
  viralHook: string;
  shortScript: string;
  caption: string;
  hashtags: string[];
  titleSuggestion: string;
  thumbnailIdea: string;
  bestPostingTime: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const hoursAgo = (dateString: string): string => {
  const hours =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60);
  if (hours < 1) return 'Less than 1h ago';
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanningText, setScanningText] = useState('');
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [generatedContent, setGeneratedContent] =
    useState<ContentSuggestion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const scanMessages = [
    'Initializing YouTube API...',
    'Scanning trending videos...',
    'Analyzing engagement metrics...',
    'Calculating viral velocity...',
    'Processing algorithm signals...',
    'Cross-referencing niches...',
    'Computing viral scores...',
    'Radar complete!',
  ];

  const handleScan = useCallback(async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');
    setVideos([]);
    setScanningText(scanMessages[0]);

    // Simulate scanning effect
    for (let i = 0; i < scanMessages.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setScanningText(scanMessages[i]);
    }

    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, mode: 'search' }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch trends');
      }

      setVideos(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setScanningText('');
    }
  }, [keyword]);

  const handleGenerateContent = useCallback(async (video: VideoData) => {
    setSelectedVideo(video);
    setGenerating(true);
    setGeneratedContent(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: video.title,
          keyword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.data);
    } catch (err: any) {
      console.error('Content generation error:', err);
    } finally {
      setGenerating(false);
    }
  }, [keyword]);

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'from-red-500 via-yellow-500 to-green-500';
    if (percentage >= 40) return 'from-yellow-500 to-yellow-400';
    return 'from-gray-600 to-gray-500';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400">
            🔥 HIGH VIRAL POTENTIAL
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400">
            ⚠️ MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/10 border border-gray-500/30 rounded-full text-xs font-bold text-gray-400">
            ❌ LOW
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg" />
      <div className="scan-line" />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📡</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                RadarTube AI
              </h1>
              <p className="text-xs text-gray-500">
                YouTube Viral Intelligence System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-xs text-red-400 font-mono">LIVE</span>
            <span className="text-xs text-gray-600 font-mono">
              24/7 SCANNING
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Detect Viral Trends
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Enter any niche or keyword to scan YouTube&apos;s viral radar
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Enter niche (e.g., AI tools, fitness, gaming...)"
                className="flex-1 bg-gray-900/80 border border-purple-500/30 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-mono"
                disabled={loading}
              />
              <button
                onClick={handleScan}
                disabled={loading || !keyword.trim()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 whitespace-nowrap"
              >
                {loading ? '🔍 SCANNING...' : '🚀 SCAN TRENDS'}
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Scanning Effect */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10 p-8 bg-gray-900/50 border border-purple-500/20 rounded-2xl text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                <div
                  className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
              <p className="text-purple-400 font-mono text-lg">
                {scanningText}
              </p>
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Results */}
        {videos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-purple-400">
                📊 {videos.length} Trends Detected
              </h3>
              <div className="flex gap-4 text-xs font-mono text-gray-500">
                <span>SORTED BY VIRAL SCORE ↓</span>
              </div>
            </div>

            <div className="grid gap-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900/60 border border-purple-500/10 rounded-xl p-5 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex gap-5">
                    {/* Rank */}
                    <div className="text-3xl font-bold text-gray-700 font-mono w-8 flex-shrink-0">
                      #{index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect fill="%231a1a2e" width="160" height="90"/><text x="80" y="45" text-anchor="middle" fill="%23666" font-size="12">No Image</text></svg>';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 truncate">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {video.channelTitle} • {hoursAgo(video.publishedAt)}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-4 text-xs font-mono text-gray-500 mb-3">
                        <span>👁 {formatNumber(video.views)}</span>
                        <span>❤️ {formatNumber(video.likes)}</span>
                        <span>💬 {formatNumber(video.comments)}</span>
                      </div>

                      {/* Viral Score Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(video.viralScore.percentage)}`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${video.viralScore.percentage}%`,
                              }}
                              transition={{
                                duration: 1.5,
                                ease: 'easeOut',
                                delay: 0.5,
                              }}
                              style={{
                                boxShadow:
                                  '0 0 10px currentColor, 0 0 20px currentColor',
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-white font-mono">
                            {video.viralScore.percentage}%
                          </div>
                          {getLevelBadge(video.viralScore.level)}
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="mt-3 grid grid-cols-4 gap-2 text-xs font-mono text-gray-500">
                        <div>
                          VELOCITY:{' '}
                          <span className="text-purple-400">
                            {video.viralScore.breakdown.velocityScore}%
                          </span>
                        </div>
                        <div>
                          ENGAGEMENT:{' '}
                          <span className="text-cyan-400">
                            {video.viralScore.breakdown.engagementScore}%
                          </span>
                        </div>
                        <div>
                          FRESHNESS:{' '}
                          <span className="text-pink-400">
                            {video.viralScore.breakdown.freshnessScore}%
                          </span>
                        </div>
                        <div>
                          RATIO:{' '}
                          <span className="text-yellow-400">
                            {video.viralScore.breakdown.ratioScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a
                        href={video.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors text-center"
                      >
                        ▶ Watch
                      </a>
                      <button
                        onClick={() => handleGenerateContent(video)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg text-sm text-white font-bold transition-all whitespace-nowrap"
                      >
                        🤖 Generate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Content Generation Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedVideo(null);
                setGeneratedContent(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    🤖 AI Content Generator
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedVideo(null);
                      setGeneratedContent(null);
                    }}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {generating && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🧠</div>
                    <p className="text-purple-400 font-mono animate-pulse">
                      AI is analyzing viral patterns...
                    </p>
                    <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  </div>
                )}

                {generatedContent && (
                  <div className="space-y-5">
                    {/* Viral Hook */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-red-400">
                          🎣 VIRAL HOOK (3 seconds)
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              generatedContent.viralHook,
                              'viralHook'
                            )
                          }
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-700 rounded"
                        >
                          {copiedField === 'viralHook' ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <p className="text-white font-semibold">
                        {generatedContent.viralHook}
                      </p>
                    </div>

                    {/* Short Script */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-cyan-400">
                          📝 SHORT SCRIPT (15-30s)
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              generatedContent.shortScript,
                              'shortScript'
                            )
                          }
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-700 rounded"
                        >
                          {copiedField === 'shortScript'
                            ? '✓ Copied'
                            : '📋 Copy'}
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {generatedContent.shortScript}
                      </p>
                    </div>

                    {/* Caption */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-purple-400">
                          💬 CAPTION
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(generatedContent.caption, 'caption')
                          }
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-700 rounded"
                        >
                          {copiedField === 'caption' ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {generatedContent.caption}
                      </p>
                    </div>

                    {/* Hashtags */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-yellow-400">
                          # HASHTAGS
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              generatedContent.hashtags.join(' '),
                              'hashtags'
                            )
                          }
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-700 rounded"
                        >
                          {copiedField === 'hashtags' ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title & Thumbnail */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <span className="text-sm font-bold text-pink-400">
                          🎯 TITLE SUGGESTION
                        </span>
                        <p className="text-white text-sm mt-2">
                          {generatedContent.titleSuggestion}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <span className="text-sm font-bold text-green-400">
                          🖼️ THUMBNAIL IDEA
                        </span>
                        <p className="text-gray-300 text-sm mt-2">
                          {generatedContent.thumbnailIdea}
                        </p>
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                      <span className="text-sm font-bold text-white">
                        ⏰ BEST POSTING TIME
                      </span>
                      <p className="text-lg font-mono text-cyan-400 mt-1">
                        {generatedContent.bestPostingTime}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 floating">📡</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-500">
              Enter a keyword above and hit Scan Trends to detect viral content
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/10 py-6 text-center text-xs text-gray-600 font-mono">
        <p>
          RADARTUBE AI v2.0 • YOUTUBE ALGORITHM ANALYSIS SYSTEM • 2026
        </p>
      </footer>
    </div>
  );
}

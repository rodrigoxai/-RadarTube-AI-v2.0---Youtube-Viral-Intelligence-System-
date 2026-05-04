const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'zh7nwBfq6NpIg3EkN1kZw2SORI9SZmir';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

export interface ContentSuggestion {
  viralHook: string;
  shortScript: string;
  caption: string;
  hashtags: string[];
  titleSuggestion: string;
  thumbnailIdea: string;
  bestPostingTime: string;
}

export async function generateContent(
  videoTitle: string,
  keyword: string
): Promise<ContentSuggestion> {
  try {
    const prompt = `You are a YouTube viral content expert. For a video about "${videoTitle}" in the niche "${keyword}", generate:

1. A VIRAL HOOK (first 3 seconds that grab attention)
2. A SHORT SCRIPT (15-30 seconds, engaging)
3. A CAPTION (optimized for engagement)
4. 10 HASHTAGS (mix of popular and niche-specific)
5. A TITLE SUGGESTION (click-worthy, SEO optimized)
6. A THUMBNAIL IDEA (specific, actionable description)
7. BEST POSTING TIME (day and time for maximum reach)

Return ONLY a JSON object with these keys:
- viralHook
- shortScript
- caption
- hashtags (array)
- titleSuggestion
- thumbnailIdea
- bestPostingTime

No markdown, no extra text. Valid JSON only.`;

    const res = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content:
              'You are a YouTube algorithm expert. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        `Mistral API error: ${res.status} - ${errorData?.message || 'Unknown error'}`
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Mistral returned empty response');
    }

    // Parse JSON, handling potential markdown wrapping
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const parsed = JSON.parse(jsonStr);

    return {
      viralHook: parsed.viralHook || 'Start with a shocking fact or question...',
      shortScript: parsed.shortScript || 'Create engaging content here...',
      caption: parsed.caption || 'Check this out! #viral',
      hashtags: Array.isArray(parsed.hashtags)
        ? parsed.hashtags
        : ['#viral', '#trending', '#youtube'],
      titleSuggestion:
        parsed.titleSuggestion || 'You Won\'t Believe What Happened...',
      thumbnailIdea:
        parsed.thumbnailIdea || 'Bold text with shocked expression',
      bestPostingTime: parsed.bestPostingTime || 'Weekday 6-9 PM',
    };
  } catch (error: any) {
    console.error('Mistral AI Error:', error.message);
    // Return fallback content instead of throwing
    return {
      viralHook: `Wait... you won't believe what just happened with ${keyword}!`,
      shortScript: `Start with a shocking statement about ${keyword}. Build tension with 3 quick points. End with a call-to-action that drives comments.`,
      caption: `This changes everything about ${keyword} 🔥 What do you think? Drop your take below! 👇`,
      hashtags: [
        `#${keyword.replace(/\s+/g, '')}`,
        '#viral',
        '#trending',
        '#fyp',
        '#youtubeshorts',
        '#mustwatch',
        '#mindblown',
        '#2026trends',
        '#contentcreator',
        '#algorithm',
      ],
      titleSuggestion: `${keyword}: The Secret Nobody Talks About`,
      thumbnailIdea: `Split screen: shocked face + bold red text "${keyword.toUpperCase()}" with arrow pointing to key element`,
      bestPostingTime: 'Tuesday-Thursday, 6:00 PM - 9:00 PM',
    };
  }
}

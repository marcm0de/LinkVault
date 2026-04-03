import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkVault/1.0)',
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i);

    // Extract description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
    const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i);

    // Extract og:image for preview thumbnail
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i);
    const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"[^>]*>/i);

    const title = ogTitleMatch?.[1] || titleMatch?.[1] || '';
    const description = ogDescMatch?.[1] || descMatch?.[1] || '';
    const image = ogImageMatch?.[1] || twitterImageMatch?.[1] || '';

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}

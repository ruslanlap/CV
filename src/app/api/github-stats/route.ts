import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

// In-memory cache with TTL to avoid hitting GitHub API rate limits
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

function getCached(key: string): unknown | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key: string, data: unknown) {
    cache.set(key, { data, timestamp: Date.now() });
}

// Return stale cache if fresh fetch fails (stale-while-error)
function getStaleCached(key: string): unknown | null {
    const entry = cache.get(key);
    return entry ? entry.data : null;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const type = searchParams.get('type'); // 'stats' or 'langs'

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cacheKey = `${username}:${type}`;

    // Return cached data if available
    const cached = getCached(cacheKey);
    if (cached) {
        return NextResponse.json(cached);
    }

    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    try {
        if (type === 'stats') {
            // Fetch user data and repos
            const [userRes, reposRes] = await Promise.all([
                fetch(`${GITHUB_API}/users/${username}`, { headers, next: { revalidate: 3600 } }),
                fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } }),
            ]);

            if (!userRes.ok || !reposRes.ok) {
                // Check for rate limiting specifically
                const rateLimited = userRes.status === 403 || reposRes.status === 403;
                if (rateLimited) {
                    const stale = getStaleCached(cacheKey);
                    if (stale) return NextResponse.json(stale);
                }
                throw new Error(`Failed to fetch GitHub data (${userRes.status}/${reposRes.status})`);
            }

            const user = await userRes.json();
            const repos = await reposRes.json();

            // Calculate stats
            const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
            const totalForks = repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);

            const result = {
                publicRepos: user.public_repos,
                followers: user.followers,
                totalStars,
                totalForks,
            };
            setCache(cacheKey, result);
            return NextResponse.json(result);
        } else if (type === 'langs') {
            // Fetch repos and their languages
            const reposRes = await fetch(
                `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
                { headers, next: { revalidate: 3600 } }
            );

            if (!reposRes.ok) {
                if (reposRes.status === 403) {
                    const stale = getStaleCached(cacheKey);
                    if (stale) return NextResponse.json(stale);
                }
                throw new Error(`Failed to fetch repos (${reposRes.status})`);
            }

            const repos = await reposRes.json();
            const langPromises = repos
                .filter((repo: any) => !repo.fork)
                .map((repo: any) =>
                    fetch(repo.languages_url, { headers, next: { revalidate: 3600 } })
                        .then(res => res.json())
                        .catch(() => ({}))
                );

            const languages = await Promise.all(langPromises);

            // Aggregate language stats
            const langStats: Record<string, number> = {};
            languages.forEach((lang: any) => {
                Object.entries(lang).forEach(([name, bytes]) => {
                    langStats[name] = (langStats[name] || 0) + (bytes as number);
                });
            });

            // Sort and get top languages
            const topLangs = Object.entries(langStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([name, bytes]) => ({ name, bytes }));

            const result = { languages: topLangs };
            setCache(cacheKey, result);
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    } catch (error) {
        console.error('GitHub API error:', error);

        // Serve stale cache on error as fallback
        const stale = getStaleCached(cacheKey);
        if (stale) {
            return NextResponse.json(stale);
        }

        return NextResponse.json(
            { error: 'Failed to fetch GitHub data' },
            { status: 500 }
        );
    }
}

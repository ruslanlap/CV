import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const type = searchParams.get('type'); // 'stats' or 'langs'

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
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
                throw new Error('Failed to fetch GitHub data');
            }

            const user = await userRes.json();
            const repos = await reposRes.json();

            // Calculate stats
            const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
            const totalForks = repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);
            const totalCommits = repos.reduce((acc: number, repo: any) => acc + (repo.size || 0), 0);

            return NextResponse.json({
                publicRepos: user.public_repos,
                followers: user.followers,
                totalStars,
                totalForks,
                totalCommits,
            });
        } else if (type === 'langs') {
            // Fetch repos and their languages
            const reposRes = await fetch(
                `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
                { headers, next: { revalidate: 3600 } }
            );

            if (!reposRes.ok) {
                throw new Error('Failed to fetch repos');
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

            return NextResponse.json({ languages: topLangs });
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub data' },
            { status: 500 }
        );
    }
}

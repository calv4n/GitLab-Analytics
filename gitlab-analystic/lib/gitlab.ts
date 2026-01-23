const GITLAB_API_URL = process.env.GITLAB_API_URL || "https://gitlab.com/api/v4";
const GITLAB_TOKEN = process.env.GITLAB_ACCESS_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;

if (!GITLAB_TOKEN) {
    console.error("GITLAB_ACCESS_TOKEN is not set in environment variables.");
}

export interface GitLabCommit {
    id: string;
    short_id: string;
    title: string;
    author_name: string;
    author_email: string;
    created_at: string;
    message: string;
    web_url: string;
    stats?: {
        additions: number;
        deletions: number;
        total: number;
    };
}

export interface GitLabUser {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    web_url: string;
}

const globalCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

async function fetchGitLab(path: string, params: Record<string, string> = {}) {
    if (!GITLAB_TOKEN) {
        throw new Error("GitLab Token not configured");
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${GITLAB_API_URL}/projects/${GITLAB_PROJECT_ID}/${path}${queryString ? `?${queryString}` : ""}`;

    const cacheKey = url;
    if (globalCache[cacheKey] && Date.now() - globalCache[cacheKey].timestamp < CACHE_DURATION) {
        return globalCache[cacheKey].data;
    }

    const response = await fetch(url, {
        headers: {
            "PRIVATE-TOKEN": GITLAB_TOKEN,
        },
        // Alle 60 Sekunden neu validieren
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`GitLab API Error: ${response.status} ${response.statusText} for URL: ${url}`);
    }

    const data = await response.json();

    globalCache[cacheKey] = { data, timestamp: Date.now() };

    return data;
}

export async function getCommits(since?: string, until?: string): Promise<GitLabCommit[]> {
    const params: Record<string, string> = {
        per_page: "100",
        with_stats: "true",
    };

    if (until) params.until = until;
    if (since) params.since = since;

    console.log(`Fetching commits from: repository/commits with params:`, params);

    let allCommits: any[] = [];
    let page = 1;
    const MAX_PAGES = 10;

    while (page <= MAX_PAGES) {
        params.page = page.toString();
        const commits = await fetchGitLab("repository/commits", params);

        if (!commits || commits.length === 0) break;

        allCommits = [...allCommits, ...commits];

        if (commits.length < 100) break;
        page++;
    }

    // The list endpoint DOES NOT return stats (additions/deletions) by default.
    // We need to fetch details for each commit to get stats. 
    // This is expensive (N+1 reqs). 
    // Optimization: Parallel fetch with limit.
    // source: chatGPT

    if (allCommits.length === 0) return [];

    // Limit to recent 200 for details fetching to avoid hitting rate limits too hard on "All Time"
    // or just fetch details for all if feasible. User wants "ALL data".
    // Let's try fetching for all but be mindful. 
    // For now, let's limit detail fetching if the list is huge, or chunk it.
    // Given the user expectation, let's process all but maybe warn if too many?
    // Let's process top 500 max for now to be safe.
    // source: chatGPT
    const commitsToProcess = allCommits.slice(0, 500);

    const commitsWithStats = await Promise.all(
        commitsToProcess.map(async (commit: any) => {
            if (commit.stats) return commit;

            const details = await fetchGitLab(`repository/commits/${commit.id}`);
            return details;
        })
    );

    return commitsWithStats;
}

export async function getProjectUsers(): Promise<GitLabUser[]> {
    return fetchGitLab("members/all", { per_page: "100" });
}

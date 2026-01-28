
// We don't import at top level because we need to set env vars first
// import { getCommits } from "@/lib/gitlab";

describe("GitLab API Logic", () => {
    let getCommits: any;

    beforeEach(async () => {
        jest.resetModules(); // Clears cache
        process.env.GITLAB_API_URL = "https://gitlab.example.com/api/v4";
        process.env.GITLAB_ACCESS_TOKEN = "test-token";
        process.env.GITLAB_PROJECT_ID = "123";

        // Mock fetch globally before import just in case
        global.fetch = jest.fn() as jest.Mock;

        // Dynamic import to pick up env vars
        const gitlab = await import("@/lib/gitlab");
        getCommits = gitlab.getCommits;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // --- GitLab API Pagination ---
    test("GitLab API Pagination", async () => {
        // Helper to generate commits
        const generateCommits = (count: number, idPrefix: string) => {
            return new Array(count).fill(null).map((_, i) => ({
                id: `${idPrefix}-${i}`,
                // Provide stats so detailed fetch is skipped
                stats: { additions: 1, deletions: 1, total: 2 }
            }));
        };

        (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
            const hasPage1 = /[?&]page=1(&|$)/.test(url);
            const hasPage2 = /[?&]page=2(&|$)/.test(url);

            if (url.includes("repository/commits") && hasPage1) {
                return {
                    ok: true,
                    json: async () => generateCommits(100, "page1"),
                };
            }
            if (url.includes("repository/commits") && hasPage2) {
                return {
                    ok: true,
                    json: async () => generateCommits(50, "page2"),
                };
            }
            // For any other page or request
            return {
                ok: true,
                json: async () => [],
            };
        });

        const commits = await getCommits();
        expect(commits.length).toBe(150);
    });

    // --- GitLab API Error Handling ---
    test("GitLab API Error Handling", async () => {
        // Reset mock to ensure no interfering implementation
        (global.fetch as jest.Mock).mockReset();

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        });

        await expect(getCommits()).rejects.toThrow("GitLab API Error");
    });
});

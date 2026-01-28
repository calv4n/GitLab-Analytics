
import { processChartData, processUserStats, UserStat } from "@/lib/data-processing";
import { GitLabCommit, GitLabUser } from "@/lib/gitlab";

describe("Data Processing Logic", () => {
    // --- Chart Data Aggregation (Commits) ---
    test("Chart Data Aggregation (Commits)", () => {
        const commits: GitLabCommit[] = [
            { id: "1", short_id: "1", title: "c1", author_name: "a", author_email: "e", created_at: "2024-01-01T10:00:00Z", message: "m", web_url: "u" },
            { id: "2", short_id: "2", title: "c2", author_name: "a", author_email: "e", created_at: "2024-01-01T12:00:00Z", message: "m", web_url: "u" },
            { id: "3", short_id: "3", title: "c3", author_name: "a", author_email: "e", created_at: "2024-01-02T10:00:00Z", message: "m", web_url: "u" },
        ];

        const result = processChartData(commits, "commits");

        expect(result.labels).toEqual(["2024-01-01", "2024-01-02"]);
        expect(result.datasets[0].data).toEqual([2, 1]);
    });

    // --- Chart Data Aggregation (Additions) ---
    test("Chart Data Aggregation (Additions)", () => {
        const commits: GitLabCommit[] = [
            {
                id: "1", short_id: "1", title: "c1", author_name: "a", author_email: "e", created_at: "2024-01-01T10:00:00Z", message: "m", web_url: "u",
                stats: { additions: 10, deletions: 0, total: 10 }
            },
            {
                id: "2", short_id: "2", title: "c2", author_name: "a", author_email: "e", created_at: "2024-01-01T12:00:00Z", message: "m", web_url: "u",
                stats: { additions: 5, deletions: 0, total: 5 }
            },
        ];

        const result = processChartData(commits, "additions");

        // Assuming labels generation logic handles single day too, or simply checks the map
        expect(result.datasets[0].data).toEqual([15]);
    });

    // --- Chart Data Gap Filling ---
    test("Chart Data Gap Filling", () => {
        const commits: GitLabCommit[] = [
            { id: "1", short_id: "1", title: "c1", author_name: "a", author_email: "e", created_at: "2024-01-01T10:00:00Z", message: "m", web_url: "u" },
            { id: "3", short_id: "3", title: "c3", author_name: "a", author_email: "e", created_at: "2024-01-03T10:00:00Z", message: "m", web_url: "u" },
        ];

        const startDate = "2024-01-01";
        const endDate = "2024-01-03";

        const result = processChartData(commits, "commits", startDate, endDate);

        expect(result.labels).toEqual(["2024-01-01", "2024-01-02", "2024-01-03"]);
        expect(result.datasets[0].data).toEqual([1, 0, 1]);
    });

    // --- User Statistics Aggregation ---
    test("User Statistics Aggregation", () => {
        const userA: GitLabUser = { id: 1, name: "User A", username: "usera", avatar_url: "url", web_url: "url" };
        const userB: GitLabUser = { id: 2, name: "User B", username: "userb", avatar_url: "url", web_url: "url" };
        const users = [userA, userB];

        const commits: GitLabCommit[] = [
            { id: "1", short_id: "1", title: "c1", author_name: "User A", author_email: "e", created_at: "2024-01-01T10:00:00Z", message: "m", web_url: "u" },
            { id: "2", short_id: "2", title: "c2", author_name: "User A", author_email: "e", created_at: "2024-01-01T12:00:00Z", message: "m", web_url: "u" },
            { id: "3", short_id: "3", title: "c3", author_name: "User B", author_email: "e", created_at: "2024-01-02T10:00:00Z", message: "m", web_url: "u" },
        ];

        const stats = processUserStats(commits, users);

        const statA = stats.find(s => s.user.name === "User A");
        const statB = stats.find(s => s.user.name === "User B");

        expect(statA).toBeDefined();
        expect(statA?.commits).toBe(2);

        expect(statB).toBeDefined();
        expect(statB?.commits).toBe(1);
    });

    // --- User Statistics Unknown User ---
    test("User Statistics Unknown User", () => {
        const users: GitLabUser[] = [];
        const commits: GitLabCommit[] = [
            { id: "1", short_id: "1", title: "c1", author_name: "Unknown", author_email: "e", created_at: "2024-01-01T10:00:00Z", message: "m", web_url: "u" },
        ];

        const stats = processUserStats(commits, users);
        const statUnknown = stats.find(s => s.user.name === "Unknown");

        expect(statUnknown).toBeDefined();
        expect(statUnknown?.commits).toBe(1);
    });
});

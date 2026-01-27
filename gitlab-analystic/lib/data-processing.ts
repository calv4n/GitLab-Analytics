import { GitLabCommit, GitLabUser } from "@/lib/gitlab";
import { format, parseISO, eachDayOfInterval, isBefore, isAfter } from "date-fns";

export interface UserStat {
    user: GitLabUser;
    commits: number;
    additions: number;
    deletions: number;
    dailyStats: Record<string, { commits: number; additions: number; deletions: number }>;
}

export function processUserStats(commits: GitLabCommit[], users: GitLabUser[], startDate?: string, endDate?: string): UserStat[] {
    const userMap = new Map<string, UserStat>();

    users.forEach(u => {
        userMap.set(u.name, {
            user: u,
            commits: 0,
            additions: 0,
            deletions: 0,
            dailyStats: {}
        });
    });

    commits.forEach(commit => {
        let stat = userMap.get(commit.author_name);
        if (!stat) {
            stat = {
                user: { id: 0, name: commit.author_name, username: commit.author_email, avatar_url: "", web_url: "" },
                commits: 0,
                additions: 0,
                deletions: 0,
                dailyStats: {}
            };
            userMap.set(commit.author_name, stat);
        }

        stat.commits += 1;
        const additions = commit.stats?.additions || 0;
        const deletions = commit.stats?.deletions || 0;

        stat.additions += additions;
        stat.deletions += deletions;

        const date = format(parseISO(commit.created_at), "yyyy-MM-dd");
        if (!stat.dailyStats[date]) {
            stat.dailyStats[date] = { commits: 0, additions: 0, deletions: 0 };
        }
        stat.dailyStats[date].commits += 1;
        stat.dailyStats[date].additions += additions;
        stat.dailyStats[date].deletions += deletions;
    });

    if (startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const dates = eachDayOfInterval({ start, end }).map(d => format(d, "yyyy-MM-dd"));

        for (const stat of userMap.values()) {
            dates.forEach(date => {
                if (!stat.dailyStats[date]) {
                    stat.dailyStats[date] = { commits: 0, additions: 0, deletions: 0 };
                }
            });
        }
    }

    return Array.from(userMap.values()).sort((a, b) => b.commits - a.commits);
}

export function processChartData(commits: GitLabCommit[], view: string = "commits", startDate?: string, endDate?: string) {
    const dailyStats: Record<string, number> = {};

    commits.forEach(commit => {
        const date = format(parseISO(commit.created_at), "yyyy-MM-dd");
        if (!dailyStats[date]) dailyStats[date] = 0;

        if (view === "additions") {
            dailyStats[date] += commit.stats?.additions || 0;
        } else if (view === "deletions") {
            dailyStats[date] += commit.stats?.deletions || 0;
        } else {
            dailyStats[date] += 1;
        }
    });

    let sortedDates = Object.keys(dailyStats).sort();
    if (startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const allDates = eachDayOfInterval({ start, end }).map(d => format(d, "yyyy-MM-dd"));

        allDates.forEach(date => {
            if (dailyStats[date] === undefined) dailyStats[date] = 0;
        });
        sortedDates = allDates;
    }

    return {
        labels: sortedDates,
        datasets: [
            {
                label: view.charAt(0).toUpperCase() + view.slice(1),
                data: sortedDates.map(d => dailyStats[d]),
                borderColor: view === "deletions" ? "rgb(220, 38, 38)" : view === "additions" ? "rgb(22, 163, 74)" : "rgb(249, 115, 22)",
                backgroundColor: view === "deletions" ? "rgba(220, 38, 38, 0.5)" : view === "additions" ? "rgba(22, 163, 74, 0.5)" : "rgba(249, 115, 22, 0.5)",
            }
        ]
    };
}

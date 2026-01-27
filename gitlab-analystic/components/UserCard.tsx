"use client";

import { GitLabUser } from "@/lib/gitlab";
import { UserStat } from "@/lib/data-processing";
import Image from "next/image";
import { Charts } from "./Charts";

interface UserCardProps {
    stat: UserStat;
    view: string; // "commits" | "additions" | "deletions"
}

export function UserCard({ stat, view }: UserCardProps) {
    const sortedDates = Object.keys(stat.dailyStats).sort();
    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: (view || 'commits').charAt(0).toUpperCase() + (view || 'commits').slice(1),
                data: sortedDates.map((d) => {
                    const day = stat.dailyStats[d];
                    if (view === 'additions') return day.additions;
                    if (view === 'deletions') return day.deletions;
                    return day.commits;
                }),
                borderColor: view === "deletions" ? "rgb(220, 38, 38)" : view === "additions" ? "rgb(22, 163, 74)" : "rgb(249, 115, 22)", // unified orange for commits
                backgroundColor: view === "deletions" ? "rgba(220, 38, 38, 0.5)" : view === "additions" ? "rgba(22, 163, 74, 0.5)" : "rgba(249, 115, 22, 0.5)",
                tension: 0.1,
                borderWidth: 1,
                pointRadius: 0
            }
        ]
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                {stat.user.avatar_url ? (
                    <Image
                        src={stat.user.avatar_url}
                        alt={stat.user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full bg-muted"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-bold">{stat.user.name.charAt(0)}</span>
                    </div>
                )}
                <div>
                    <div className="font-semibold text-sm">{stat.user.name}</div>
                    <div className="text-xs text-muted-foreground break-all">{stat.user.username}</div>
                </div>
            </div>

            <div className="flex items-baseline gap-2 text-sm">
                <span className="font-bold">{stat.commits} commits</span>
                <span className="text-green-600 font-semibold">{stat.additions.toLocaleString()} ++</span>
                <span className="text-red-600 font-semibold">{stat.deletions.toLocaleString()} --</span>
            </div>

            <div className="h-24 w-full">
                <Charts data={chartData} type="bar" optionsOverride={{
                    plugins: { legend: { display: false }, title: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false, beginAtZero: true }
                    },
                    maintainAspectRatio: false
                }} />
            </div>
        </div>
    );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPeriod = searchParams.get("period") || "all_time";
    const currentView = searchParams.get("view") || "commits";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Contributions</h3>

                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <select
                            aria-label="Filter Period"
                            value={currentPeriod}
                            onChange={(e) => updateParam("period", e.target.value)}
                            className="w-full p-3 rounded-xl border bg-card hover:bg-accent transition-colors appearance-none font-medium cursor-pointer"
                        >
                            <option value="last_month">Last Month</option>
                            <option value="last_3_months">Last 3 Months</option>
                            <option value="last_6_months">Last 6 Months</option>
                            <option value="last_year">Last Year</option>
                            <option value="all_time">All Time</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            ▼
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            aria-label="Filter View"
                            value={currentView}
                            onChange={(e) => updateParam("view", e.target.value)}
                            className="w-full p-3 rounded-xl border bg-card hover:bg-accent transition-colors appearance-none font-medium cursor-pointer"
                        >
                            <option value="commits">Contributions: Commits</option>
                            <option value="additions">Contributions: Additions</option>
                            <option value="deletions">Contributions: Deletions</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

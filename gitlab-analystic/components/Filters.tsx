"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";

const SixFilterWrapper = dynamic(() => import("./SixFilterWrapper"), {
    ssr: false,
    loading: () => <div className="h-32 w-full animate-pulse bg-muted rounded-xl" />,
});

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
        <div className="flex flex-col gap-6 md:w-full w-1/2">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Contributions</h3>
                <SixFilterWrapper
                    currentPeriod={currentPeriod}
                    currentView={currentView}
                    onPeriodChange={(val) => updateParam("period", val)}
                    onViewChange={(val) => updateParam("view", val)}
                />
            </div>
        </div>
    );
}

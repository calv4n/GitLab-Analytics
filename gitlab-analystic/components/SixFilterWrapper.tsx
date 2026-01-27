"use client";

import React from "react";
import { SixSelect, SixMenuItem } from "@six-group/ui-library-react";

interface SixFilterWrapperProps {
    currentPeriod: string;
    currentView: string;
    onPeriodChange: (value: string) => void;
    onViewChange: (value: string) => void;
}

export default function SixFilterWrapper({
    currentPeriod,
    currentView,
    onPeriodChange,
    onViewChange,
}: SixFilterWrapperProps) {
    return (
        <div className="flex flex-col gap-4">
            <SixSelect
                label="Filter Period"
                value={currentPeriod}
                onSixSelectChange={(e: CustomEvent) => onPeriodChange(e.detail.value)}
                className="w-full"
            >
                <SixMenuItem value="last_month">Last Month</SixMenuItem>
                <SixMenuItem value="last_3_months">Last 3 Months</SixMenuItem>
                <SixMenuItem value="last_6_months">Last 6 Months</SixMenuItem>
                <SixMenuItem value="last_year">Last Year</SixMenuItem>
                <SixMenuItem value="all_time">All Time</SixMenuItem>
            </SixSelect>

            <SixSelect
                label="Filter View"
                value={currentView}
                onSixSelectChange={(e: CustomEvent) => onViewChange(e.detail.value)}
                className="w-full"
            >
                <SixMenuItem value="commits">Contributions: Commits</SixMenuItem>
                <SixMenuItem value="additions">Contributions: Additions</SixMenuItem>
                <SixMenuItem value="deletions">Contributions: Deletions</SixMenuItem>
            </SixSelect>
        </div>
    );
}

"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ChartsProps {
    data: {
        labels: string[];
        datasets: any[];
    };
    type?: "line" | "bar";
    title?: string;
    optionsOverride?: any;
}

export function Charts({ data, type = "line", title, optionsOverride }: ChartsProps) {
    const defaultOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: !!title,
                text: title,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };

    const options = optionsOverride || defaultOptions;

    if (type === "bar") {
        return <Bar options={options} data={data} />;
    }
    return <Line options={options} data={data} />;
}

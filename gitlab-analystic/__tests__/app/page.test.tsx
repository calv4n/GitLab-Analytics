
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import * as gitlab from "@/lib/gitlab";
import { formatISO, subMonths } from "date-fns";

// Mock the components used in Home to check props passed to them
jest.mock("@/components/Filters", () => ({
    Filters: () => <div data-testid="filters" />,
}));
jest.mock("@/components/Charts", () => ({
    Charts: ({ data }: any) => <div data-testid="charts">{JSON.stringify(data)}</div>,
}));
jest.mock("@/components/UserList", () => ({
    UserList: ({ stats }: any) => <div data-testid="user-list">{stats.length}</div>,
}));

// Mock the data fetching functions
jest.mock("@/lib/gitlab");

describe("Home Page Logic", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2024-02-01T12:00:00Z")); // Fixed time
        (gitlab.getProjectUsers as jest.Mock).mockResolvedValue([]);
        (gitlab.getCommits as jest.Mock).mockResolvedValue([]);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // --- Date Calculation: Default ---
    test("Calculates default period (last_month) when no params provided", async () => {
        // Default period is "all_time", so 'since' is undefined
        const jsx = await Home({ searchParams: Promise.resolve({}) });
        render(jsx);

        expect(gitlab.getCommits).toHaveBeenCalled();
        const calledArg = (gitlab.getCommits as jest.Mock).mock.calls[0][0];
        expect(calledArg).toBeUndefined();
    });

    // --- Date Calculation: Last Month ---
    test("Calculates correct period for 'last_month'", async () => {
        const jsx = await Home({ searchParams: Promise.resolve({ period: "last_month" }) });
        render(jsx);

        const now = new Date("2024-02-01T12:00:00Z");
        const expectedSince = formatISO(subMonths(now, 1));

        expect(gitlab.getCommits).toHaveBeenCalled();
        const calledArg = (gitlab.getCommits as jest.Mock).mock.calls[0][0];
        expect(calledArg).toContain("2024-01-01");
    });
});

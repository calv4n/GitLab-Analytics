import { Filters } from "@/components/Filters";
import { Charts } from "@/components/Charts";
import { UserList } from "@/components/UserList";
import { getCommits, getProjectUsers } from "@/lib/gitlab";
import { processChartData, processUserStats } from "@/lib/data-processing";
import { subMonths, subYears, formatISO, format, parseISO } from "date-fns";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    period?: string;
    view?: string;
  }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const period = searchParams.period || "all_time";
  const view = searchParams.view || "commits";

  let since: string | undefined;
  const now = new Date();

  switch (period) {
    case "last_month":
      since = formatISO(subMonths(now, 1));
      break;
    case "last_3_months":
      since = formatISO(subMonths(now, 3));
      break;
    case "last_6_months":
      since = formatISO(subMonths(now, 6));
      break;
    case "last_year":
      since = formatISO(subYears(now, 1));
      break;
    case "all_time":
      since = undefined;
      break;
    default:
      since = formatISO(subMonths(now, 1));
  }

  // Fetch data
  const [commits, users] = await Promise.all([
    getCommits(since),
    getProjectUsers()
  ]);

  // Formatierung der Datumsangaben für Anzeige und Filterung
  const startDate = since ? format(parseISO(since), "MMM d, yyyy") : "Beginning of time";
  const endDate = format(now, "MMM d, yyyy");
  const endDateISO = format(now, "yyyy-MM-dd");
  const startDateISO = since ? format(parseISO(since), "yyyy-MM-dd") : undefined;

  const chartData = processChartData(commits, view, startDateISO, endDateISO);
  const userStats = processUserStats(commits, users, startDateISO, endDateISO);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track repository activity and contributions.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/4 w-full">
          <Filters />
        </div>

        <div className="md:w-3/4 w-full space-y-8">
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
            <Charts data={chartData} type="bar" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contributors</h2>
            <UserList stats={userStats} view={view} />
          </div>
        </div>
      </div>
    </main>
  );
}


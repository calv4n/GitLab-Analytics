import { Filters } from "@/components/Filters";
import { Charts } from "@/components/Charts";
import { UserList } from "@/components/UserList";
import { getCommits, getProjectUsers, getProjectDetails } from "@/lib/gitlab";
import { processChartData, processUserStats } from "@/lib/data-processing";
import { subMonths, subYears, formatISO, format, parseISO } from "date-fns";
import Link from "next/link";
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
  const [commits, users, project] = await Promise.all([
    getCommits(since),
    getProjectUsers(),
    getProjectDetails()
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
      <div className="flex lg:flex-row flex-col">
        <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track repository activity and contributions.
          </p>
          <hr className="mt-8 opacity-40" />
        </div>
        <div className="lg:w-full md:w-1/2 w-full">
          <Filters />
        </div>
      </div>
      <div className="flex flex-col gap-8 md:items-center items-start w-full">
        <h2 className="text-2xl font-bold mb-2">
          <Link
            href={project?.web_url || "#"}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {project?.name_with_namespace || project?.name || "Repository"}
          </Link>
        </h2>
        <div className="md:w-3/4 w-full space-y-8">
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-1">Activity Overview</h2>
            <p className="text-sm text-muted-foreground mb-4">
              From {startDate} to {endDate}
            </p>
            <Charts data={chartData} type="bar" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contributors</h2>
            <UserList stats={userStats} view={view} />
          </div>
        </div>
      </div>
      </div>
      

      
    </main>
  );
}


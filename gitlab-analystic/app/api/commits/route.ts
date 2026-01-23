import { NextResponse } from "next/server";
import { getCommits } from "@/lib/gitlab";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since") || undefined;
    const until = searchParams.get("until") || undefined;

    try {
        const commits = await getCommits(since, until);
        return NextResponse.json(commits);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

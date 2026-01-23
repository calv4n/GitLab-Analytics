import { NextResponse } from "next/server";
import { getProjectUsers } from "@/lib/gitlab";

export async function GET() {
    try {
        const users = await getProjectUsers();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

"use client"

import { Gitlab } from "lucide-react"
import Link from "next/link"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-6">
                    <Gitlab className="h-6 w-6 text-orange-600" />
                    <span>GitLab Changes</span>
                </Link>
                <div className="flex flex-1 items-center justify-end">
                </div>
            </div>
        </header>
    )
}

"use client"

import { Gitlab, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-6">
                        <Gitlab className="h-6 w-6 text-orange-600" />
                        <span>GitLab Changes</span>
                    </Link>
                    <div className="flex flex-1 items-center justify-end">
                        <div className="h-9 w-9"></div>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-6">
                    <Gitlab className="h-6 w-6 text-orange-600" />
                    <span>GitLab Changes</span>
                </Link>
                <div className="flex flex-1 items-center justify-end">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground relative h-9 w-9 flex items-center justify-center"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 absolute" />
                        <Moon className="h-5 w-5 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 absolute" />
                    </button>
                </div>
            </div>
        </header>
    )
}

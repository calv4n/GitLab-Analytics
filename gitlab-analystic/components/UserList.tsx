import { UserStat } from "@/lib/data-processing";
import { UserCard } from "./UserCard";

interface UserListProps {
    stats: UserStat[];
    view: string;
}

export function UserList({ stats, view }: UserListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((stat) => (
                <UserCard key={stat.user.id || stat.user.name} stat={stat} view={view} />
            ))}
            {stats.length === 0 && (
                <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                    No contributors found for this period.
                </div>
            )}
        </div>
    );
}

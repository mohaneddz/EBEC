"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// The data structure for a single leaderboard user
export interface LeaderboardUser {
    picture: string;
    name: string;
    department: string;
    score: number;
}

export const columns: ColumnDef<LeaderboardUser>[] = [
    {
        accessorKey: "picture",
        header: () => <div className="p-2 md:p-4">Picture</div>, // smaller padding under md
        cell: ({ row }) => {
            const pictureUrl = row.original.picture;
            const name = row.original.name;
            return (
                <div className="flex-shrink-0 py-2 md:py-4 px-2 md:px-4"> {/* smaller padding under md */}
                    <Image
                        src={pictureUrl || "/imgs/DEFAULT.webp"}
                        alt={`Picture of ${name}`}
                        width={64} // kept as natural size; CSS class controls visual size
                        height={64}
                        className="w-10 md:w-16 h-10 md:h-16 rounded-full object-cover" 
                    />
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.name;
            return (
                <div className="w-full py-2 md:py-4"> {/* smaller vertical padding under md */}
                    <div className="text-sm md:text-lg font-semibold text-gray-900">{name}</div> {/* smaller text under md */}
                </div>
            )
        },
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => {
            const department = row.original.department;
            return (
                <div className="w-full py-2 md:py-4"> {/* smaller vertical padding under md */}
                    <div className="text-sm md:text-lg text-gray-500">{department}</div> {/* smaller text under md */}
                </div>
            )
        },
    },
    {
        accessorKey: "score",
        header: () => <div className="text-right p-2 md:p-4">Score</div>, // smaller padding under md
        cell: ({ row }) => {
            const score = row.original.score;
            return (
                <div className="flex justify-end py-2 md:py-4 px-2 md:px-4"> {/* smaller padding under md */}
                    <div
                        className={`px-3 md:px-4 py-1 md:py-2 text-sm md:text-lg font-bold rounded-full bg-secondary-light/20 text-secondary-dark`} 
                    >
                        {score}
                    </div>
                </div>
            );
        },
    },
]
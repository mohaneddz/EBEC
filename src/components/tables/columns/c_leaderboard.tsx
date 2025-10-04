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
        header: () => <div className="p-4">Picture</div>,
        cell: ({ row }) => {
            const pictureUrl = row.original.picture;
            const name = row.original.name;
            return (
                <div className="flex-shrink-0 py-4 px-4">
                    <Image
                        src={pictureUrl || "/imgs/DEFAULT.webp"}
                        alt={`Picture of ${name}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
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
                <div className="w-full py-4">
                    <div className="text-lg font-semibold text-gray-900">{name}</div>
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
                <div className="w-full py-4">
                    <div className="text-lg text-gray-500">{department}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "score",
        header: () => <div className="text-right p-4">Score</div>,
        cell: ({ row }) => {
            const score = row.original.score;
            return (
                <div className="flex justify-end py-4 px-4">
                    <div
                        className={`px-4 py-2 text-lg font-bold rounded-full bg-secondary-light/20 text-secondary-dark`}
                    >
                        {score}
                    </div>
                </div>
            );
        },
    },
]
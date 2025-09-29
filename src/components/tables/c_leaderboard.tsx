"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// The data structure for a single leaderboard user
export interface LeaderboardUser {
    userId: string;
    picture: string;
    name: string;
    department: 'IT' | 'HR' | 'Multimedia' | 'Design' | 'Relex' | 'Events';
    score: number;
}

export const columns: ColumnDef<LeaderboardUser>[] = [
    {
        accessorKey: "picture",
        header: "Member",
        cell: ({ row }) => {
            const pictureUrl = row.original.picture;
            const name = row.original.name;
            return (
                <div className="flex-shrink-0">
                    <Image
                        src={pictureUrl}
                        alt={`Picture of ${name}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
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
            const department = row.original.department;
            return (
                <div className="w-full">
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500">{department}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "score",
        header: () => <div className="text-right">Score</div>,
        cell: ({ row }) => {
            const score = row.original.score;
            return (
                <div className="flex justify-end">
                    <div
                        className={`px-3 py-1 text-xs font-bold rounded-full bg-secondary-light/20 text-secondary-dark`}
                    >
                        {score}
                    </div>
                </div>
            );
        },
    },
]
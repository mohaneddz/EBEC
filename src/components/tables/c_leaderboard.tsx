"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// The data structure for a single manager
export interface Manager {
    userId: string;
    picture: string;
    name: string;
    department: 'IT' | 'HR' | 'Multimedia' | 'Design' | 'Relex' | 'Events';
    score: number;
}

// Helper function to determine the color of the score badge
const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
}

export const columns: ColumnDef<Manager>[] = [
    {
        accessorKey: "picture",
        header: "Picture",
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
        // We combine Name and Department into a single column for a cleaner look
        accessorKey: "name",
        header: "Manager",
        cell: ({ row }) => {
            const name = row.original.name;
            const department = row.original.department;
            return (
                <div>
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
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getScoreColor(score)}`}
                    >
                        {score}
                    </div>
                </div>
            );
        },
    },
]
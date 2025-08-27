"use client";

import React, { ComponentType } from "react";
import Link from "next/link";

import { motion } from "motion/react";
import { IconBook, IconUsers, IconCalendarEvent, IconTrophy } from "@tabler/icons-react";

interface ServicesCardsProps {
	title: string;
	index?: number;
	link: string;
	Icon?: string;
}

export default function ServicesCards({
	title,
	index = 0,
	link,
	Icon,
}: ServicesCardsProps): JSX.Element {
	// map the string name to the actual icon component
	const IconComponent: React.ElementType | null = (() => {
		switch (Icon) {
			case "IconBook":
				return IconBook;
			case "IconUsers":
				return IconUsers;
			case "IconCalendarEvent":
				return IconCalendarEvent;
			case "IconTrophy":
				return IconTrophy;
			default:
				return null;
		}
	})();

	return (
		<motion.div
			key={index}
			whileHover={{
				scale: 1.05,
				boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
				backgroundColor: "#ffc00e",
			}}
			whileTap={{
				scale: 1.05,
				boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
				backgroundColor: "#ffc00e",
			}}
			className="p-8 bg-slate-50 rounded-lg cursor-pointer flex flex-col items-center justify-center border-2 border-transparent group"
		>
			<Link href={link} className="flex flex-col items-center justify-center">
				<div className="relative flex flex-col items-center justify-center">
					{IconComponent && (
						<IconComponent
							className="w-16 h-16 text-secondary-500 mb-4 group-hover:text-black transition-colors duration-75"
							strokeWidth={1.5}
						/>
					)}
					<h3 className="text-xl font-semibold text-gray-900 text-center group-hover:text-white transition-colors duration-75">
						{title}
					</h3>
				</div>
			</Link>
		</motion.div>
	);
}

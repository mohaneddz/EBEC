'use client';

import { Leaderboard } from "@/components/tables/leaderboard";
import { columns } from "@/components/tables/columns/c_leaderboard"

import { TextGenerateEffect } from "@/components/global/TextGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react";
import { getLeaderboardData } from '@/app/actions';

// Define the type for leaderboard data
type LeaderboardItem = {
  picture: string;
  name: string;
  score: number;
  department: string;
};

export default function MembersLeaderboard() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getLeaderboardData();
      if (result.error) {
        console.error(result.error);
      } else {
        setData(result.data);
      }
    };
    fetchData();
  }, []);

  // Helper function to pad data to always have 5 rows with placeholders
  const padData = (data: LeaderboardItem[], department: string) => {
    const filtered = department === "All" ? data : data.filter((item) => item.department === department);
    while (filtered.length < 5) {
      filtered.push({
        picture: "/imgs/DEFAULT.webp",
        name: "—",
        score: 0,
        department: department
      });
    }
    return filtered;
  };

  return (
    <section className="mx-auto full center col">

      <TextGenerateEffect
        words="Our Best Peforming Members!"
        className="mt-40 mb-16 lt:my-40 text-3xl sm:text-4xl md:text-5xl lg:text-9xl text-center font-bold"
        color={"primary-light"}
      />

      <Tabs defaultValue="IT" className="center w-[80vw] max-w-[60rem]">

        <TabsList className="w-full mb-8 ">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="IT">IT</TabsTrigger>
          <TabsTrigger value="Finance">Finance</TabsTrigger>
          <TabsTrigger value="Media">Media</TabsTrigger>
          <TabsTrigger value="Design">Design</TabsTrigger>
          <TabsTrigger value="Relex">Relex</TabsTrigger>
          <TabsTrigger value="Events">Events</TabsTrigger>
          <TabsTrigger value="Logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="All" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "All")} department="All" />
        </TabsContent>
        <TabsContent value="IT" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "IT")} department="IT" />
        </TabsContent>
        <TabsContent value="Finance" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Finance")} department="Finance" />
        </TabsContent>
        <TabsContent value="Media" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Media")} department="Media" />
        </TabsContent>
        <TabsContent value="Design" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Design")} department="Design" />
        </TabsContent>
        <TabsContent value="Relex" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Relex")} department="Relex" />
        </TabsContent>
        <TabsContent value="Events" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Events")} department="Events" />
        </TabsContent>
        <TabsContent value="Logistics" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Logistics")} department="Logistics" />
        </TabsContent>
      </Tabs>

    </section>
  );
}
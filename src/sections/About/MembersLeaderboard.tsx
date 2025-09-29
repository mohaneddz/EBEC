import { Leaderboard } from "@/components/tables/leaderboard";
import { columns } from "@/components/tables/c_leaderboard"
import { dummyData } from "@/data/leaderboard"

import { TextGenerateEffect } from "@/components/global/TextGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MembersLeaderboard() {

  const data = dummyData;

  // Helper function to pad data to always have 5 rows with placeholders
  const padData = (data: any[], department: string) => {
    let filtered = department === "All" ? data : data.filter(item => item.department === department);
    while (filtered.length < 5) {
      filtered.push({
        picture: "/imgs/DEFAULT.webp",
        name: "—",
        score: 0,
        department: department,
      });
    }
    return filtered;
  };

  return (
    <section className="mx-auto full center col">

      <TextGenerateEffect
        words="Our best peforming members!"
        className="mt-40 mb-16 lt:my-40 text-3xl sm:text-4xl md:text-5xl lg:text-9xl text-center font-bold"
        color={"primary-light"}
      />

      <Tabs defaultValue="IT" className="center w-[80vw]">
        
        <TabsList className="grid w-full max-w-[60rem] mb-8 grid-cols-7">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="IT">IT</TabsTrigger>
          <TabsTrigger value="HR">HR</TabsTrigger>
          <TabsTrigger value="Multimedia">Multimedia</TabsTrigger>
          <TabsTrigger value="Design">Design</TabsTrigger>
          <TabsTrigger value="Relex">Relex</TabsTrigger>
          <TabsTrigger value="Events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="All" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "All")} department="All" />
        </TabsContent>
        <TabsContent value="IT" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "IT")} department="IT" />
        </TabsContent>
        <TabsContent value="HR" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "HR")} department="HR" />
        </TabsContent>
        <TabsContent value="Multimedia" className="w-full">
          <Leaderboard columns={columns} data={padData(data, "Multimedia")} department="Multimedia" />
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
      </Tabs>

    </section>
  );
}
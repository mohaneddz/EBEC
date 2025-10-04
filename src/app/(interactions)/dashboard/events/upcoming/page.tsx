import { columns } from "@/components/tables/columns/c_upcoming" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/upcoming" 

export default async function page() {
  
  const data = dummyData;

  return (
    <section className="mx-auto full">

      <DataTable columns={columns} data={data} />
    </section>
  );
}
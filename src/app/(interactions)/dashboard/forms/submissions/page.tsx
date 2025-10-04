import { columns } from "@/components/tables/columns/c_signups" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/signups" 

export default async function page() {
  
  const data = dummyData;

  return (
    <section className="mx-auto full">

      <DataTable columns={columns} data={data} />
    </section>
  );
}
import { columns } from "@/components/tables/c_departments" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/departments" 

export default async function page() {
  
  const data = dummyData;

  return (
    <section className="mx-auto full">

      <DataTable columns={columns} data={data} />
    </section>
  );
}
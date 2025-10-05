import { columns } from "@/components/tables/columns/c_gallery" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/gallery" 

export default async function page() {
  
  const data = dummyData;

  return (
    <section className="full">

      <DataTable columns={columns} data={data} />
    </section>
  );
}
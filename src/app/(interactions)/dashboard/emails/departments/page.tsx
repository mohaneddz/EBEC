import DepartmentsTable from "@/components/tables/content/d_departments"

export default async function page() {
  return (
    <section className="full">
    <DepartmentsTable />
    </section>
  );
}
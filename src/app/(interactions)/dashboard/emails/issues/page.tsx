import IssuesTable from "@/components/tables/content/d_issues"

export default async function page() {
  return (
    <section className="full">
      <IssuesTable />
    </section>
  );
}
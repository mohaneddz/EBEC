import FormCard from "@/components/admin/formCard";

export default async function page() {

  return (
    <section className="mx-auto full">

      <div className="full grid grid-cols-4 gap-8">
        <FormCard title="Form Card 1" description="This is the first form card." />
        <FormCard title="Form Card 2" description="This is the second form card." />
        <FormCard title="Form Card 3" description="This is the third form card." />
        <FormCard title="Form Card 4" description="This is the fourth form card." />
      </div>

    </section>
  );
}
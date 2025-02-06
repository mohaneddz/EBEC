import NewMemberRequestCard from "@/components/emailCards/NewMemberRequest";

const NewMemList = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    motivation:
      "I am eager to contribute my skills to this innovative team and learn from experienced professionals.",
    selectedDepartment: "Product",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    motivation:
      "I have a strong interest in marketing and would love to apply my knowledge in a real-world setting.",
    selectedDepartment: "Marketing",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    motivation:
      "I have always been passionate about tech, especially software engineering. I am looking for a place where I can grow and apply my knowledge",
    selectedDepartment: "Engineering",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    motivation:
      "I'm a results-driven sales professional with a knack for building relationships. I'm confident in my ability to drive revenue growth.",
    selectedDepartment: "Sales",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    id: 5,
    name: "Elton John",
    email: "elton.john@example.com",
    motivation:
      "As a seasoned HR professional, I'm passionate about fostering a positive and productive work environment where employees can thrive.",
    selectedDepartment: "HR",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    id: 6,
    name: "Fiona Smith",
    email: "fiona.smith@example.com",
    motivation:
      "I am a dedicated finance professional with expertise in budgeting and financial analysis. I'm seeking a challenging role where I can contribute to sound financial management.",
    selectedDepartment: "Finance",
    availableDepartments: ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"],
  },
];

export default function page() {
  return (

    <div className="flex flex-col items-center">
      <a href='/admin'
        className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        New Members</a>

      <div className="m-8 bg-zinc-50 rounded-xl overflow-x-scroll">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,min-content)] justify-items-center gap-16">

          {NewMemList.map((member) => (
            <NewMemberRequestCard key={member.id} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
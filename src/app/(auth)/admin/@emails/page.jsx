import DepartmentSwitch from "@/components/cards/DepartmentSwitchRequest";
import NewMemberRequestCard from "@/components/cards/NewMemberRequest";
import FormRegistrationCard from "@/components/cards/EventRequest";

const image1 = "/Assets/FakePFP/1.jpg";
const image2 = "/Assets/FakePFP/6.jpg";
const image3 = "/Assets/FakePFP/3.jpg";
const image4 = "/Assets/FakePFP/4.jpg";

const DepChangesList = [
  { id: '1', name: 'John Doe', role: 'Manager', department: 'Sales', newDepartment: 'Marketing' },
  { id: '2', name: 'Jane Smith', role: 'Developer', department: 'Engineering', newDepartment: 'Product' },
  { id: '3', name: 'Alice Johnson', role: 'Designer', department: 'Design', newDepartment: 'Marketing' },
  { id: '4', name: 'Bob Brown', role: 'Analyst', department: 'Finance', newDepartment: 'Operations' },
  { id: '5', name: 'Charlie Davis', role: 'Support', department: 'Customer Service', newDepartment: 'Sales' },
  { id: '6', name: 'Diana Evans', role: 'HR', department: 'Human Resources', newDepartment: 'Operations' },
  { id: '7', name: 'Evan Foster', role: 'QA', department: 'Quality Assurance', newDepartment: 'Engineering' },
  { id: '8', name: 'Fiona Green', role: 'Marketing', department: 'Marketing', newDepartment: 'Sales' },
  { id: '9', name: 'George Harris', role: 'Product Manager', department: 'Product', newDepartment: 'Engineering' },
  { id: '10', name: 'Hannah White', role: 'Operations', department: 'Operations', newDepartment: 'Finance' },
];

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

const FormRegList = [
  {
    id: 1,
    name: "Alice Smith",
    role: "Product Manager",
    eventName: "Design Thinking Workshop",
    acceptedCount: 30,
    userPfp: image1,
  },
  {
    id: 2,
    name: "Bob Johnson",
    role: "Software Engineer",
    eventName: "Advanced Python Seminar",
    acceptedCount: 15,
    userPfp: image2,
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "Senior Developer",
    eventName: "Agile Development Course",
    acceptedCount: 25,
    userPfp: image3,
  },
  {
    id: 4,
    name: "Diana Prince",
    role: "Sales Manager",
    eventName: "Sales Leadership Training",
    acceptedCount: 40,
    userPfp: image4,
  },
];

export default function Page() {
  return (
    <div className="">

      {/* Event Forms */}
      <a
        href='/admin/event_Requests'
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        Event Forms &rarr;
      </a>
      <div className="m-8 bg-zinc-50 rounded-xl overflow-x-scroll">
        <div className="w-full grid grid-cols-[repeat(3,min-content)] gap-16">

          {FormRegList.slice(0, 3).map((registration) => (
            <FormRegistrationCard key={registration.id} {...registration} />
          ))}
        </div>
      </div>

      {/* New Members */}
      <a
        href='/admin/new_Members'
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        New Members &rarr;
      </a>
      <div className="m-8 bg-zinc-50 rounded-xl overflow-x-scroll">
        <div className="w-full grid grid-cols-[repeat(3,min-content)] gap-16">

          {NewMemList.slice(0, 3).map((member) => (
            <NewMemberRequestCard key={member.id} {...member} />
          ))}
        </div>
      </div>

      {/* Deparmtent Changes */}
      <a
        href='/admin/department_Changes'
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        Deparmtent Changes &rarr;
      </a>
      <div className="m-8 bg-zinc-50 rounded-xl overflow-x-scroll">
        <div className="w-full grid grid-cols-[repeat(3,min-content)] gap-16">

          {DepChangesList.slice(0, 3).map((item) => (
            <DepartmentSwitch
              key={item.id}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import FormRegistrationCard from "@/components/cards/EventRequest";

const image1 = "/Assets/FakePFP/1.jpg";
const image2 = "/Assets/FakePFP/6.jpg";
const image3 = "/Assets/FakePFP/3.jpg";
const image4 = "/Assets/FakePFP/4.jpg";

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

export default function page() {
  return (
    <div className="flex flex-col items-center">
      <a href='/admin'
        className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        Event Forms</a>
      <div className="m-8 bg-zinc-50 rounded-xl">
        <div className="w-full flex flex-wrap gap-8 justify-center">

          {FormRegList.map((registration) => (
            <FormRegistrationCard key={registration.id} {...registration} />
          ))}
        </div>
      </div>
    </div >
  )
}
import DepartmentSwitch from "@/components/cards/DepartmentSwitchRequest";

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

export default function page() {
  return (
    <div className="flex flex-col items-center">
      <a href='/admin'
        className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8">
        Department Changes</a>
      <div className="m-8 bg-zinc-50 rounded-xl p-4">
        <div className="w-full flex flex-wrap gap-8 justify-center">
          {DepChangesList.map((item) => (
            <DepartmentSwitch
              key={item.id}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
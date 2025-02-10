"use client";

import Slider from '@/components/Slider';
import RegularMember from '@/components/teamCards/RegularMember';
import { useState } from 'react';
import { IconCircleArrowRightFilled, IconCircleArrowLeftFilled } from "@tabler/icons-react";

export default function MembersPage() {
  const [department, setDepartment] = useState("main");

  const renderDepartments = () => {
    const renderItem = (member) => (
      <RegularMember
        key={member.id}
        {...member}
        availableDepartments={["Executive", "Events", "Design", "Multimedia", "HR", "IT", "Relex"]}
      />
    );

    switch (department) {
      case "main":
        return Object.entries(departments).map(([departmentName, members]) => (
          <div key={departmentName} className="dep mb-24">
            <h2 className='w-full mr-24 hover:cursor-pointer select-none text-5xl font-bold flex items-center gap-8 text-white bg-gradient-to-br from-primary-light to-primary-dark font-poppins p-8 rounded-lg'
              onClick={() => setDepartment(departmentName)}
            >{departmentName} Department <IconCircleArrowRightFilled size={40} /></h2>
            <div className="w-full mr-24 my-8 bg-zinc-50 rounded-xl overflow-y-visible">
              <div className="w-full overflow-y-visible">  {/* Removed grid layout */}
                <Slider items={members} renderItem={renderItem} slidesToShow={3} />
              </div>
            </div>
          </div>
        ));
      default:
        if (departments[department]) {
          return (
            <div key={department} className="dep">
              <h2 className='w-full mr-24 hover:cursor-pointer select-none text-5xl font-bold text-white bg-gradient-to-br from-primary-light to-primary-dark font-poppins p-8 rounded-lg'
                onClick={() => setDepartment("main")}
              >{department} Department <IconCircleArrowLeftFilled size={40} /></h2>
              <div className="m-8 bg-zinc-50 rounded-xl overflow-x-auto overflow-y-visible">
                <div className="w-full overflow-y-visible">
                  <Slider items={departments[department]} renderItem={renderItem} slidesToShow={15} />
                </div>
              </div>
            </div>
          );
        } else {
          return <div>Department not found.</div>;
        }
    }
  };

  return (
    <div>
      {renderDepartments()}
    </div>
  );
}

const eventsMembers = [
  { id: 4, name: "Maria Garcia", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 5, name: "David Lee", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 6, name: "Sarah Wilson", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 22, name: "Jessica Rodriguez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 23, name: "Kevin Martinez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 34, name: "Ashley Perez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 35, name: "Brandon Sanchez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 36, name: "Chelsea Ramirez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 37, name: "Daniel Flores", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 38, name: "Emily Diaz", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 39, name: "Jacob Torres", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 40, name: "Kayla Nguyen", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 41, name: "Luis Kim", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 42, name: "Megan Castro", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/15.jpg" },
  { id: 43, name: "Nathan Ali", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 22, name: "Jessica Rodriguez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 23, name: "Kevin Martinez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 34, name: "Ashley Perez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 35, name: "Brandon Sanchez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 36, name: "Chelsea Ramirez", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 37, name: "Daniel Flores", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 38, name: "Emily Diaz", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 39, name: "Jacob Torres", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 40, name: "Kayla Nguyen", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 41, name: "Luis Kim", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 42, name: "Megan Castro", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/15.jpg" },
  { id: 43, name: "Nathan Ali", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/2.jpg" },
];

const designMembers = [
  { id: 7, name: "Emily Davis", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 8, name: "Kevin Brown", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 9, name: "Linda Miller", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 24, name: "Christopher Garcia", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 25, name: "Ashley Johnson", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 52, name: "Brian Williams", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 53, name: "Catherine Jones", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 54, name: "Daniel Garcia", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 55, name: "Elizabeth Rodriguez", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 56, name: "Frank Martinez", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 57, name: "Grace Anderson", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 58, name: "Henry Thomas", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 59, name: "Isabella Jackson", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 60, name: "Jack White", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 61, name: "Kelly Harris", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/15.jpg" },
];

const multimediaMembers = [
  { id: 10, name: "Chris Wilson", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 11, name: "Amy Garcia", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 12, name: "Tom Smith", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 26, name: "Brandon Rodriguez", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 27, name: "Stephanie Williams", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 69, name: "Avery Brown", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 70, name: "Benjamin Davis", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 71, name: "Chloe Wilson", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 72, name: "David Garcia", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 73, name: "Ella Rodriguez", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 74, name: "Finn Williams", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 75, name: "Georgia Jones", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 76, name: "Henry Brown", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 77, name: "Ivy Davis", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 78, name: "James Wilson", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/15.jpg" },
];

const hrMembers = [
  { id: 13, name: "Megan White", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 14, name: "Ryan Green", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 15, name: "Nicole Black", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 28, name: "Jason Davis", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 29, name: "Michelle Miller", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 86, name: "Amelia Smith", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 87, name: "Caleb Johnson", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 88, name: "Dakota Williams", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 89, name: "Eleanor Jones", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 90, name: "Gabriel Brown", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 91, name: "Hazel Davis", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 92, name: "Isaac Wilson", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 93, name: "Joseph Garcia", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 94, name: "Katherine Rodriguez", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 95, name: "Levi Williams", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/15.jpg" },
];

const itMembers = [
  { id: 16, name: "Brandon Hall", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 17, name: "Ashley King", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 18, name: "Justin Wood", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 30, name: "Samantha Green", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 31, name: "Nicholas Hall", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/14.jpg" },
  { id: 103, name: "Alexander Adams", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 104, name: "Brooklyn Carter", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 105, name: "Cameron Cook", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 106, name: "Destiny Evans", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 107, name: "Ethan Flores", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 108, name: "Faith Gray", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 109, name: "Hunter Hill", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 110, name: "Isabelle Irwin", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 111, name: "Jackson James", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 112, name: "Kylie Knight", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/15.jpg" },
];

const relexMembers = [
  { id: 19, name: "Tiffany Clark", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 20, name: "Michael Scott", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 21, name: "Pam Beesly", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 32, name: "Dwight Schrute", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/15.jpg" },
  { id: 33, name: "Angela Martin", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 120, name: "Abigail Allen", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/5.jpg" },
  { id: 121, name: "Brandon Baker", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/6.jpg" },
  { id: 122, name: "Claire Cole", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/7.jpg" },
  { id: 123, name: "Dominic Diaz", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/8.jpg" },
  { id: 124, name: "Elena Ellis", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/9.jpg" },
  { id: 125, name: "Franklin Ford", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/10.jpg" },
  { id: 126, name: "Gina Grant", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/11.jpg" },
  { id: 127, name: "Harold Hayes", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/12.jpg" },
  { id: 128, name: " इंडिया Irwin", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/13.jpg" },
  { id: 129, name: "Jeremy Jenkins", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/14.jpg" },
];

const departments = {
  "Events": eventsMembers,
  "Design": designMembers,
  "Multimedia": multimediaMembers,
  "HR": hrMembers,
  "IT": itMembers,
  "Relex": relexMembers,
};
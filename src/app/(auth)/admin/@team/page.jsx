"use client";

import ClubTeamMemberCard from '@/components/teamCards/TeamMember';
const executiveTeam = [
  { id: 1, name: "John Smith", role: "President", department: "Executive", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 2, name: "Jane Doe", role: "Vice President", department: "Executive", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 3, name: "Peter Jones", role: "Secretary General", department: "Executive", userPfp: "/Assets/FakePFP/2.jpg" },
];

const eventsTeam = [
  { id: 4, name: "Maria Garcia", role: "Manager", department: "Events", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 5, name: "David Lee", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 6, name: "Sarah Wilson", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/1.jpg" },
];

const designTeam = [
  { id: 7, name: "Emily Davis", role: "Manager", department: "Design", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 8, name: "Kevin Brown", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 9, name: "Linda Miller", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/4.jpg" },
];

const multimediaTeam = [
  { id: 10, name: "Chris Wilson", role: "Manager", department: "Multimedia", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 11, name: "Amy Garcia", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 12, name: "Tom Smith", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/3.jpg" },
];

const hrTeam = [
  { id: 13, name: "Megan White", role: "Manager", department: "HR", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 14, name: "Ryan Green", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 15, name: "Nicole Black", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/2.jpg" },
];

const itTeam = [
  { id: 16, name: "Brandon Hall", role: "Manager", department: "IT", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 17, name: "Ashley King", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 18, name: "Justin Wood", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/1.jpg" },
];

const relexTeam = [
  { id: 19, name: "Tiffany Clark", role: "Manager", department: "Relex", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 20, name: "Michael Scott", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 21, name: "Pam Beesly", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/4.jpg" },
];

const departmentData = [
    { name: "Executive", team: executiveTeam },
    { name: "Events", team: eventsTeam },
    { name: "Design", team: designTeam },
    { name: "Multimedia", team: multimediaTeam },
    { name: "HR", team: hrTeam },
    { name: "IT", team: itTeam },
    { name: "Relex", team: relexTeam },
];

export default function TeamPage() {
    return (
        <div>
            {departmentData.map((department) => (
                <div key={department.name} className="dep">
                    <h2 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8'>{department.name} Department</h2>
                    <div className="m-8 bg-zinc-50 rounded-xl overflow-x-auto overflow-y-visible">
                        <div className="w-full grid grid-cols-[repeat(3,minmax(min-content,1fr))] overflow-y-visible justify-items-center justify-center">
                            {department.team.map((member) => (
                                <ClubTeamMemberCard
                                    key={member.id}
                                    {...member}
                                    availableDepartments={department.name === "Executive" ? ["President", "Vice President", "Secretary General"] : ["Executive", "Events", "Design", "Multimedia", "HR", "IT", "Relex"]}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
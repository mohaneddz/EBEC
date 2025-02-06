"use client";

import ClubTeamMemberCard from '@/components/teamCards/TeamMember';

const eventsTeam = [
  { id: 4, name: "Maria Garcia", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 5, name: "David Lee", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 6, name: "Sarah Wilson", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/1.jpg" },
];

const designTeam = [
  { id: 7, name: "Emily Davis", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 8, name: "Kevin Brown", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 9, name: "Linda Miller", role: "Member", department: "Design", userPfp: "/Assets/FakePFP/4.jpg" },
];

const multimediaTeam = [
  { id: 10, name: "Chris Wilson", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 11, name: "Amy Garcia", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 12, name: "Tom Smith", role: "Member", department: "Multimedia", userPfp: "/Assets/FakePFP/3.jpg" },
];

const hrTeam = [
  { id: 13, name: "Megan White", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 14, name: "Ryan Green", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/1.jpg" },
  { id: 15, name: "Nicole Black", role: "Member", department: "HR", userPfp: "/Assets/FakePFP/2.jpg" },
];

const itTeam = [
  { id: 16, name: "Brandon Hall", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 17, name: "Ashley King", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 18, name: "Justin Wood", role: "Member", department: "IT", userPfp: "/Assets/FakePFP/1.jpg" },
];

const relexTeam = [
  { id: 19, name: "Tiffany Clark", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/2.jpg" },
  { id: 20, name: "Michael Scott", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 21, name: "Pam Beesly", role: "Member", department: "Relex", userPfp: "/Assets/FakePFP/4.jpg" },
];

const departmentData = [
  { name: "Events", team: eventsTeam, slug: "events" },
  { name: "Design", team: designTeam, slug: "design" },
  { name: "Multimedia", team: multimediaTeam, slug: "multimedia" },
  { name: "HR", team: hrTeam, slug: "hr" },
  { name: "IT", team: itTeam, slug: "it" },
  { name: "Relex", team: relexTeam, slug: "relex" },
];

export default function MembersPage() {
    return (
        <div>
            {departmentData.map((department) => (
                <div key={department.name} className="dep">
                    <a href={`/admin/dep/${department.slug}`} className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8'>{department.name} Department</a>
                    <div className="m-8 bg-zinc-50 rounded-xl overflow-x-auto overflow-y-visible">
                        <div className="w-full grid grid-cols-[repeat(3,minmax(min-content,1fr))] overflow-y-visible">
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
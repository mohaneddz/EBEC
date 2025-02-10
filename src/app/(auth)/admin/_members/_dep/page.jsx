"use client";

import { use } from 'react';
import { useState } from 'react';
import ClubTeamMemberCard from '@/components/teamCards/TeamMember';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const eventsTeam = [
  { id: 4, name: "Maria Garcia", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/3.jpg" },
  { id: 5, name: "David Lee", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/4.jpg" },
  { id: 6, name: "Sarah Wilson", role: "Member", department: "Events", userPfp: "/Assets/FakePFP/1.jpg" },
];

const departmentData = [
  { name: "Events", team: eventsTeam, slug: "events" },
];

export default function MembersPage({ params }) {
  const resolvedParams = use(params);
  const { dep } = resolvedParams;
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentMember, setCurrentMember] = useState(null);

  function showReplacement(member, isManager) {
    setCurrentMember(member);
    setShowModal(true);
  }

  function handleRoleChange(newRole) {
    if (currentMember) {
      currentMember.role = newRole;
      setShowModal(false);
      setCurrentMember(null);
      setSelectedRole('');
    }
  }

  return (
    <div>
      {departmentData.map((department) => (
        <div key={department.name} className="dep">
          <a href={`/admin`} className='text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 font-poppins p-8'>
            {capitalize(dep)} Department
          </a>
          <div className="m-8 bg-zinc-50 rounded-xl overflow-x-auto overflow-y-visible">
            <div className="w-full flex flex-wrap items-center justify-center overflow-y-visible">
              {department.team.map((member) => (
                <ClubTeamMemberCard
                  key={member.id}
                  {...member}
                  availableDepartments={department.name === "Executive" ? ["President", "Vice President", "Secretary General"] : ["Executive", "Events", "Design", "Multimedia", "HR", "IT", "Relex"]}
                  onRoleChange={() => showReplacement(member, member.role === "Manager")}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <Modal isVisible={showModal} close={() => setShowModal(false)}>
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Replace Existing :</h2>
          <div className="flex gap-4">
            {currentMember?.role === "Manager" ? (
              <button
                onClick={() => setSelectedRole("Member")}
                className={`px-6 py-2 rounded-full ${
                  selectedRole === "Member"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Member
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSelectedRole("Manager")}
                  className={`px-6 py-2 rounded-full ${
                    selectedRole === "Manager"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Manager
                </button>
                <button
                  onClick={() => setSelectedRole("Member")}
                  className={`px-6 py-2 rounded-full ${
                    selectedRole === "Member"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Member
                </button>
              </>
            )}
          </div>
          <Button 
            onClick={() => handleRoleChange(selectedRole)}
            text="Confirm"
            color1={'#1e4b8a'} color2={'#1b3764'} 
            className="mt-4"
          />

        </div>
      </Modal>
    </div>
  );
}
"use client";

import DepartmentCard from "@/components/about/DepartmentCard";
import MeetMember from "@/components/main/MeetMember";

import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from "@/components/global/TextGenerator";
import { departments, Department } from "@/data/departmentInfo";

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const supabase = createClient();

interface Manager {
  full_name: string;
  role: string;
  picture: string;
}

const departmentOrder: Department[] = ["Executive", "Design", "Events", "HR", "Finance", "Logistics", "IT", "Media", "Relex"];

export default function DepartmentsManagers() {

  const [department, setDepartment] = useState<Department>("IT");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [flippedDepartment, setFlippedDepartment] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function scrollUp() {
    const element = document.getElementById("cards");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      window.scrollBy({ top: window.innerHeight * -1.2, behavior: 'smooth' });
    }
  }

  const goToNextDepartment = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      const currentIndex = departmentOrder.indexOf(department);
      const nextIndex = (currentIndex + 1) % departmentOrder.length;
      setDepartment(departmentOrder[nextIndex]);
      setIsTransitioning(false);
    }, 100);
  };

  const goToPrevDepartment = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      const currentIndex = departmentOrder.indexOf(department);
      const prevIndex = (currentIndex - 1 + departmentOrder.length) % departmentOrder.length;
      setDepartment(departmentOrder[prevIndex]);
      setIsTransitioning(false);
    }, 100);
  };

  useEffect(() => {
    const fetchManagers = async () => {
      const { data, error } = await supabase.from('managers').select('*').eq('department', department);
      if (error) {
        console.error(error);
        setManagers([]);
      } else {
        // Sort by role hierarchy: president > vice president > sg > manager > co manager (to lowercase)
        const roleOrder = ['president', 'vice president', 'sg', 'manager', 'co manager'];
        const sorted = data.sort((a, b) => {
          const aIndex = roleOrder.indexOf(a.role.toLowerCase());
          const bIndex = roleOrder.indexOf(b.role.toLowerCase());
          return aIndex - bIndex;
        });
        setManagers(sorted);
      }
    };
    fetchManagers();
  }, [department]);

  return (
    <div className="center full col">

      <TextGenerateEffect
        words="Explore Our Departments!"
        className="mt-20 mb-4 lt:my-40 text-3xl sm:text-4xl md:text-5xl lg:text-9xl text-center font-bold"
        color={"primary-light"}
      />

      <p className="text-lg mb-8 mt-4 center text-center">Click a department card to explore its details and team contributions.</p>

      <div className="grid lg:grid-cols-3 gap-8 justify-center m-8">

        <DepartmentCard picture="/svgs/departments/executive.svg" title="Executive Department" id={department === "Executive" ? "cards" : undefined} onClick={() => setDepartment("Executive")} onFlip={() => setFlippedDepartment(flippedDepartment === "Executive" ? null : "Executive")} isFlipped={flippedDepartment === "Executive"} />
        <DepartmentCard picture="/svgs/departments/design.svg" title="Design Department" id={department === "Design" ? "cards" : undefined} onClick={() => setDepartment("Design")} onFlip={() => setFlippedDepartment(flippedDepartment === "Design" ? null : "Design")} isFlipped={flippedDepartment === "Design"} />
        <DepartmentCard picture="/svgs/departments/events.svg" title="Events Department" id={department === "Events" ? "cards" : undefined} onClick={() => setDepartment("Events")} onFlip={() => setFlippedDepartment(flippedDepartment === "Events" ? null : "Events")} isFlipped={flippedDepartment === "Events"} />

        <DepartmentCard picture="/svgs/departments/hr.svg" title="HR Department" id={department === "HR" ? "cards" : undefined} onClick={() => setDepartment("HR")} onFlip={() => setFlippedDepartment(flippedDepartment === "HR" ? null : "HR")} isFlipped={flippedDepartment === "HR"} />
        <DepartmentCard picture="/svgs/departments/finance.svg" title="Finance Department" id={department === "Finance" ? "cards" : undefined} onClick={() => setDepartment("Finance")} onFlip={() => setFlippedDepartment(flippedDepartment === "Finance" ? null : "Finance")} isFlipped={flippedDepartment === "Finance"} />
        <DepartmentCard picture="/svgs/departments/logistics.svg" title="Logistics Department" id={department === "Logistics" ? "cards" : undefined} onClick={() => setDepartment("Logistics")} onFlip={() => setFlippedDepartment(flippedDepartment === "Logistics" ? null : "Logistics")} isFlipped={flippedDepartment === "Logistics"} />

        <DepartmentCard picture="/svgs/departments/it.svg" title="IT Department" id={department === "IT" ? "cards" : undefined} onClick={() => setDepartment("IT")} onFlip={() => setFlippedDepartment(flippedDepartment === "IT" ? null : "IT")} isFlipped={flippedDepartment === "IT"} />
        <DepartmentCard picture="/svgs/departments/media.svg" title="Media Department" id={department === "Media" ? "cards" : undefined} onClick={() => setDepartment("Media")} onFlip={() => setFlippedDepartment(flippedDepartment === "Media" ? null : "Media")} isFlipped={flippedDepartment === "Media"} />
        <DepartmentCard picture="/svgs/departments/relex.svg" title="Relex Department" id={department === "Relex" ? "cards" : undefined} onClick={() => setDepartment("Relex")} onFlip={() => setFlippedDepartment(flippedDepartment === "Relex" ? null : "Relex")} isFlipped={flippedDepartment === "Relex"} />

      </div>

      <div className="full center col" id="team">

        <div className="w-[80vw] h-1 bg-gradient-to-r from-transparent via-primary-light to-transparent my-4"></div>

        <AnimatePresence mode="wait">
          <motion.p
            key={department}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="my-16 mx-16 text-3xl vsm:text-4xl sm:text-5xl lg:text-7xl font-black text-center bg-gradient-to-r from-secondary-dark to-secondary-light bg-clip-text text-transparent w-fit text-wrap"
          >
            Meet The {department} Department!
          </motion.p>
        </AnimatePresence>

        <div className="center m-8 w-full">
          <button
            onClick={goToPrevDepartment}
            disabled={isTransitioning}
            className="p-3 click rounded-full bg-primary-light text-white hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-xl disabled:opacity-50 cursor-pointer absolute left-2"
            aria-label="Previous department"
          >
            <ChevronLeft size={32} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={department}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.1 }}
              className="flex gap-16 justify-center min-h-[30rem] items-center  flex-wrap"
            >
              {managers.map((manager, index) => (
                <MeetMember key={index} name={manager.full_name} role={manager.role} image={manager.picture} />
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={goToNextDepartment}
            disabled={isTransitioning}
            className="p-3 click rounded-full bg-primary-light text-white hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-xl disabled:opacity-50 cursor-pointer absolute right-2"
            aria-label="Next department"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={department}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            className="center full col min-h-[10rem]"
          >
            <p className="text-2xl max-w-[60%] my-16 lg:my-4 text-center h-32 flex items-center">
              {departments[department]}
            </p>


          </motion.div>
        </AnimatePresence>

        <Button variant="secondary" className='mt-20 lg:mt-4 text-white font-bold text-xl px-8 py-6 h-16' onClick={scrollUp}>
          Go Back!
        </Button>

        <div className="w-[80vw] h-1 bg-gradient-to-r from-transparent via-primary-light to-transparent mt-8"></div>

      </div>

    </div>
  );
};
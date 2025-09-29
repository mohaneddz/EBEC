import DepartmentCard from "@/components/about/DepartmentCard";
import MeetMember from "@/components/main/MeetMember";
import { TextGenerateEffect } from "@/components/global/TextGenerator";

export default function DepartmentsManagers() {
  return (
    <div className="center full col">

      <TextGenerateEffect
        words="Explore our Departments"
        className="mt-40 mb-16 lt:my-40 text-3xl sm:text-4xl md:text-5xl lg:text-9xl text-center font-bold"
        color={"primary-light"}
      />

      <div className="grid grid-cols-3 gap-8 justify-center m-8">

        <div className="w-full center col-span-3" >
          <DepartmentCard picture="/imgs/departments/executive.png" title="Executive Manager" />
        </div>

        <DepartmentCard picture="/imgs/departments/design.png" title="Design Manager" />
        <DepartmentCard picture="/imgs/departments/events.png" title="Events Manager" />
        <DepartmentCard picture="/imgs/departments/hr.png" title="HR Manager" />

        <DepartmentCard picture="/imgs/departments/it.png" title="IT Manager" />
        <DepartmentCard picture="/imgs/departments/media.png" title="Media Manager" />
        <DepartmentCard picture="/imgs/departments/relex.png" title="Relex Manager" />
      </div>

      <div className="full center col" id="team">

        <p className="my-16 mx-16 text-3xl vsm:text-4xl sm:text-6xl lg:text-8xl font-black text-center bg-gradient-to-r from-secondary-dark to-secondary-light bg-clip-text text-transparent w-fit">
          Meet our Team
        </p>

        <div className="flex gap-16 justify-center m-8">
          <MeetMember name="Alice Johnson" role="Executive Manager" image="/imgs/managers/1.avif" />
          <MeetMember name="Bob Smith" role="Design Manager" image="/imgs/managers/2.avif" />
          <MeetMember name="Catherine Lee" role="Events & Logistics Manager" image="/imgs/managers/3.avif" />
        </div>

        <div className="center full col">
          <h3 className="text-5xl font-bold mb-8">Welcome to the IT Department!</h3>
            <p className="text-2xl max-w-[80%] text-center">
            Our IT Department is dedicated to providing top-notch technical support and innovative solutions to enhance our organization's efficiency. 
            We work tirelessly to ensure that all systems are running smoothly, enabling our team to focus on achieving their goals without technical interruptions. 
            From maintaining robust infrastructure to developing cutting-edge tools, our IT professionals are committed to driving technological advancements and fostering a culture of innovation.
            </p>
        </div>

      </div>

    </div>
  );
};
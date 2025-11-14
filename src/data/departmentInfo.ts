export type Department = "IT" | "Design" | "Events" | "HR" | "Media" | "Relex" | "Executive" | "Logistics" | "Finance";

export type DepartmentInfo = Record<Department, string>;

export const departments: DepartmentInfo = {
  "IT": "Our IT Department is dedicated to providing top-notch technical support and innovative solutions to enhance our organization's efficiency. We ensure all systems run smoothly, maintain robust infrastructure, and develop cutting-edge tools to foster a culture of innovation.",
  
  "Design": "The Design Department brings creativity to life by crafting visual identities, branding, and digital assets. From graphics to user interfaces, our designers ensure consistency, professionalism, and appeal across all platforms.",
  
  "Events": "The Events Department is responsible for planning, organizing, and executing impactful events. We coordinate logistics, manage schedules, and create engaging experiences that strengthen connections within and outside the organization.",
  
  "Logistics": "The Logistics Department ensures the seamless flow of resources, information, and services. We manage supply chains, coordinate transportation, and optimize operations to support the organization's goals efficiently and effectively.",

  "Finance": "The Finance Department manages the organization's financial health through budgeting, accounting, and reporting. We ensure transparency, compliance, and strategic allocation of resources to support sustainable growth and success.",

  "HR": "The HR Department focuses on people—the heart of our organization. We handle recruitment, development, and well-being, ensuring every member feels valued and supported while cultivating a culture of collaboration and growth.",

  "Media": "The Media & Marketing Department manages communication, storytelling, and content creation. From photography and videography to social media, we capture and broadcast the spirit of our organization to inspire and engage our audience.",

  "Relex": "The Relex Department strengthens external relations and partnerships. We represent our organization, build networks, and maintain collaborations that open doors to new opportunities and long-term success.",
  
  "Executive": "The Executive Team oversees the organization’s vision, strategy, and leadership. We coordinate between departments, make key decisions, and ensure that our collective efforts align with the mission and long-term goals."
};

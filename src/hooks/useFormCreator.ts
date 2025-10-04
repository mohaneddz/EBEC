"use client";

import { useState } from "react";

export default function useFormCreator () {
    
const [formData, setFormData] = useState<any>({});

  return {
    formData,
    setFormData,
  };
}
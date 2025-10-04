"use client";

import { useState } from "react";

export default function useFormCreator () {
    
const [formData, setFormData] = useState<Record<string, unknown>>({});

  return {
    formData,
    setFormData,
  };
}
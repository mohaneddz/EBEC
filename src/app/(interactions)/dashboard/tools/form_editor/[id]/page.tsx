"use client";

import useFormCreator from "@/hooks/useFormCreator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import EditModal from "@/components/forms/EditModal";
import EditInput from "@/components/forms/EditInput";
import EditControls from "@/components/forms/EditControls";

export default function Page() {
  const { formData, setFormData } = useFormCreator();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const onSaveQuestion = (questionData: any) => {
    if (currentEditIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentEditIndex] = questionData;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, questionData]);
    }
    setCurrentEditIndex(null);
    setIsEditModalOpen(false);
  };

  return (
    <section className="flex flex-col">
      <div className="mx-auto flex-1 flex flex-col max-w-2xl gap-4 w-full">

        {/* Edit Modal */}
        <EditModal
          isEditModalOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onSaveQuestion}
          setQuestions={setQuestions}
        />

        {/* Form Header */}
        <div className="flex-col center text-center">
          <h1 className="font-black text-5xl">Form Editor</h1>
          <p className="text-sm font-light my-2 text-black">
            Edit the form details below:
          </p>
        </div>

        {/* Form Metadata */}
        <EditInput
          placeholder="Form Name"
          value={formData.name}
          customOnChange={(value) => setFormData({ ...formData, name: value })}
        />
        <EditInput
          placeholder="Form Description"
          value={formData.description}
          customOnChange={(value) =>
            setFormData({ ...formData, description: value })
          }
        />
        <EditInput
          placeholder="Form Brief"
          value={formData.brief}
          customOnChange={(value) =>
            setFormData({ ...formData, brief: value })
          }
        />

        {/* Form Questions */}
        <div className="relative text-center text-sm w-full my-4">
          <div className="absolute inset-0 top-1/2 border-t border-gray-500" />
          <span className="relative z-10 bg-background text-lg px-4 text-muted-foreground">
            Form Questions
          </span>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="w-full flex items-center gap-2">
            <EditInput
              placeholder={q.questionText || "Question Text"}
              value={q.questionText}
              customOnChange={(value) => {
                const updated = [...questions];
                updated[index].questionText = value;
                setQuestions(updated);
              }}
            />
            <EditControls
              onPenClick={() => {
                setCurrentEditIndex(index);
                setIsEditModalOpen(true);
              }}
              onMinusClick={() => {
                setQuestions(questions.filter((_, i) => i !== index));
              }}
            />
          </div>
        ))}

        <Button
          variant="default"
          className="w-full h-min text-white font-black"
          onClick={() => {
            setCurrentEditIndex(null);
            setIsEditModalOpen(true);
          }}
        >
          Add New Question
        </Button>

        {/* Save / Delete All */}
        <div className="grid grid-cols-2 gap-4 w-full mt-auto">
          <Button
            variant="destructive"
            className="w-full h-min text-white font-black"
            onClick={() => setQuestions([])}
          >
            Delete All
          </Button>
          <Button
            variant="secondary"
            className="w-full h-min text-white font-black"
            onClick={() =>
              console.log("Form Saved:", { ...formData, questions })
            }
          >
            Save Form
          </Button>
        </div>
      </div>
    </section>
  );
}

import Modal from "@/components/global/Modal";
import EditInput from "@/components/forms/EditInput";
import { EditSelect } from "@/components/forms/EditSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import useEditModal from "@/hooks/useEditModal";

export default function EditModal({
  isEditModalOpen,
  onClose,
  onSave,
  setQuestions,
  editData = null,
}: {
  isEditModalOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  setQuestions: (questions: any) => void;
  editData?: any;
}) {
  const {
    groups,
    selectedType,
    setSelectedType,
    constraints,
    setConstraints,
    compatible,
    questionText,
    setQuestionText,
    resetAll,
  } = useEditModal(editData);

  return (
    <Modal isOpen={isEditModalOpen} onClose={onClose} title="Edit Form">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">Answer Type</label>
        <EditSelect value={selectedType} onChange={setSelectedType} groups={groups} />

        <label className="text-sm font-medium">Question</label>
        <EditInput
          placeholder="Question Text"
          value={questionText}
          customOnChange={setQuestionText}
        />

        {/* Constraints */}
        {compatible.includes("required") && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={constraints.required}
              onCheckedChange={(checked) =>
                setConstraints({ ...constraints, required: checked })
              }
            />
            <label className="text-sm font-medium">Required</label>
          </div>
        )}

        {compatible.includes("pattern") && (
          <>
            <label className="text-sm font-medium">Regex Pattern</label>
            <EditInput
              placeholder="e.g. ^[A-Za-z0-9]+$"
              value={constraints.pattern}
              customOnChange={(value) =>
                setConstraints({ ...constraints, pattern: value })
              }
            />
          </>
        )}

        {compatible.includes("minLength") && (
          <>
            <label className="text-sm font-medium">Min Length</label>
            <EditInput
              type="number"
              placeholder="e.g. 3"
              value={constraints.minLength}
              customOnChange={(value) =>
                setConstraints({ ...constraints, minLength: value })
              }
            />
          </>
        )}

        {compatible.includes("maxLength") && (
          <>
            <label className="text-sm font-medium">Max Length</label>
            <EditInput
              type="number"
              placeholder="e.g. 255"
              value={constraints.maxLength}
              customOnChange={(value) =>
                setConstraints({ ...constraints, maxLength: value })
              }
            />
          </>
        )}

        {compatible.includes("min") && (
          <>
            <label className="text-sm font-medium">Min Value</label>
            <EditInput
              type="number"
              placeholder="e.g. 1"
              value={constraints.min}
              customOnChange={(value) =>
                setConstraints({ ...constraints, min: value })
              }
            />
          </>
        )}

        {compatible.includes("max") && (
          <>
            <label className="text-sm font-medium">Max Value</label>
            <EditInput
              type="number"
              placeholder="e.g. 100"
              value={constraints.max}
              customOnChange={(value) =>
                setConstraints({ ...constraints, max: value })
              }
            />
          </>
        )}

        {compatible.includes("step") && (
          <>
            <label className="text-sm font-medium">Step Size</label>
            <EditInput
              type="number"
              step="any"
              placeholder="e.g. 0.1"
              value={constraints.step}
              customOnChange={(value) =>
                setConstraints({ ...constraints, step: value })
              }
            />
          </>
        )}
      </div>

      <div className="flex justify-end gap-4 w-full mt-8">
        <Button variant="outline" className="flex-1 font-black" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="flex-1 font-black"
          onClick={() => {
            const questionData = { type: selectedType, constraints, questionText };
            onSave(questionData);
            resetAll();
          }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}

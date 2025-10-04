import Modal from "@/components/global/Modal";
import EditInput from "@/components/forms/EditInput";
import { EditSelect } from "@/components/forms/EditSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import useEditModal from "@/hooks/useEditModal";

interface Constraints {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface QuestionData {
  type: string;
  constraints: Constraints;
  questionText: string;
}

export default function EditModal({
  isEditModalOpen,
  onClose,
  onSave,
  editData = null,
}: {
  isEditModalOpen: boolean;
  onClose: () => void;
  onSave: (data: QuestionData) => void;
  editData?: QuestionData | null;
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
              // ensure boolean passed to Checkbox
              checked={Boolean(constraints?.required)}
              onCheckedChange={(checked) =>
                setConstraints({ ...constraints, required: Boolean(checked) })
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
              value={constraints?.pattern ?? ''}
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
              // EditInput expects a string value — convert number -> string
              value={String(constraints?.minLength ?? '')}
              customOnChange={(value) =>
                setConstraints({ ...constraints, minLength: value === '' ? 0 : Number(value) })
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
              value={String(constraints?.maxLength ?? '')}
              customOnChange={(value) =>
                setConstraints({ ...constraints, maxLength: value === '' ? 0 : Number(value) })
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
              value={String(constraints?.min ?? '')}
              customOnChange={(value) =>
                setConstraints({ ...constraints, min: value === '' ? 0 : Number(value) })
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
              value={String(constraints?.max ?? '')}
              customOnChange={(value) =>
                setConstraints({ ...constraints, max: value === '' ? 0 : Number(value) })
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
              value={String(constraints?.step ?? '')}
              customOnChange={(value) =>
                setConstraints({ ...constraints, step: value === '' ? 0 : parseFloat(value) })
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

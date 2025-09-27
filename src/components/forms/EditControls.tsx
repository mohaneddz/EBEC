import { Button } from "@/components/ui/button";
import { Pen, Minus } from "lucide-react";

interface Props {
  onPenClick?: () => void;
  onMinusClick?: () => void;
}

export default function EditControls({ onPenClick, onMinusClick }: Props) {
  return (
    <div className="flex gap-2 ml-4">
      <Button variant="icon" size="icon" className="rounded-full bg-primary-light text-white" onClick={onPenClick}>
        <Pen />
      </Button>
      <Button variant="icon" size="icon" className="rounded-full bg-destructive text-white" onClick={onMinusClick}>
        <Minus />
      </Button>
    </div>
  );
}

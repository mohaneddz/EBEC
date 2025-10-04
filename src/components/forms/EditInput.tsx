import { Input } from "@/components/ui/input";

interface Props extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  placeholder?: string;
  value?: string;
  customOnChange?: (value: string) => void;
}

export default function EditInput({ placeholder, value, customOnChange, ...rest }: Props) {
  return (
    <Input
      className="w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => customOnChange?.(e.target.value)}
      {...rest}
    />
  );
}

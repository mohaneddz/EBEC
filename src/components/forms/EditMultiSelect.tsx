"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface Props {
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
}

const constraintOptions = [
  { value: "required", label: "Required" },
  { value: "minLength", label: "Min Length" },
  { value: "maxLength", label: "Max Length" },
  { value: "pattern", label: "Regex Pattern" },
  { value: "min", label: "Min Value" },
  { value: "max", label: "Max Value" },
  { value: "step", label: "Step Size" },
  { value: "unique", label: "Unique" },
  { value: "readonly", label: "Read Only" },
]

export function EditMultiSelect({ value = [], onChange, disabled }: Props) {
  const [open, setOpen] = React.useState(false)

  const toggleValue = (val: string) => {
    const newValues = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val]
    onChange?.(newValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between bg-gray-100 border text-gray-500 text-base border-gray-300 cursor-pointer"
        >
          {value.length > 0
            ? constraintOptions
              .filter((c) => value.includes(c.value))
              .map((c) => c.label)
              .join(", ")
            : "Select constraints"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 z-[60]">
        <Command>
          <CommandList>
            <CommandGroup heading="Constraints">
              {constraintOptions.map((c) => (
                <CommandItem
                  key={c.value}
                  value={c.value}
                  onSelect={() => toggleValue(c.value)}  // ✅
                  className="flex items-center justify-between cursor-pointer"
                >
                  {c.label}
                  {value.includes(c.value) && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

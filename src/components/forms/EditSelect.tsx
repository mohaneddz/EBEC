import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  value?: string
  groups: { label: string; items: { label: string; value: string }[] }[]
  onChange?: (value: string) => void
}

export function EditSelect({ value, onChange, groups }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-gray-100 border border-gray-300 cursor-pointer">
        <SelectValue placeholder="Select a question type" />
      </SelectTrigger>

      <SelectContent className="z-[60]" position="popper" sideOffset={4}>
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

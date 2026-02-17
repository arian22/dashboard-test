"use client"

import { useThemeConfig } from "@/components/active-theme"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_THEMES = [
  {
    name: "پیش فرض",
    value: "default-scaled",
  },
  {
    name: "آبی",
    value: "blue-scaled",
  },
  {
    name: "سبز",
    value: "green-scaled",
  },
  {
    name: "بنفش",
    value: "purple-scaled",
  },
  {
    name: "نارنجی",
    value: "amber-scaled",
  },
  {
    name: "قرمز",
    value: "red-scaled",
  },
]

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className="flex items-center gap-2" dir="rtl">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="flex-row-reverse justify-between text-right *:data-[slot=select-value]:w-16">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent side="bottom" align="start" dir="rtl">
          <SelectGroup>
            <SelectLabel>انتخاب رنگ</SelectLabel>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
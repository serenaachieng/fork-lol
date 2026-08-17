// src/features/decanting/components/WeekDatePicker.jsx
//
// Replaces the native <input type="date"> for the "Week of" field
// with a shadcn Popover + Calendar. Keeps the same external contract
// as before: value is a plain "yyyy-MM-dd" string, onChange receives
// that same string — so DecantingPage's weekOf/setWeekOf state and
// validation logic need zero changes.
import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export default function WeekDatePicker({ id = "week-picker", label, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  const handleSelect = (date) => {
    if (!date) return;
    // Store as yyyy-MM-dd, matching what a native <input type="date">
    // would have produced — keeps weekOf's shape unchanged everywhere
    // else it's used (buildItemsPayload, validation, etc).
    onChange({ target: { value: format(date, "yyyy-MM-dd") } });
    setOpen(false);
  };

  return (
    <div className="login-form__field">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 size-4" />
            {selectedDate ? format(selectedDate, "yyyy/MM/dd") : <span className="text-muted-foreground">yyyy/mm/dd</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
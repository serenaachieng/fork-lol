// components/common/SelectField.jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="login-form__field">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(val) => onChange({ target: { value: val } })}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
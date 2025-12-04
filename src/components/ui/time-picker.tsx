
import { Input } from "@/components/ui/input"


export default function TimePicker({value,onChange,disabled}:any) {
  return (
            <Input type="time" id="time" value={value}
            disabled={disabled}
             onChange={onChange} aria-label="Choose time" className="w-full" />
  )
}


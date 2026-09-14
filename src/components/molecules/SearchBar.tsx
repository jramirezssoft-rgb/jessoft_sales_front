import type { KeyboardEvent, Ref } from "react";
import Input from "../atoms/Input";
import { Icons } from "../atoms/Icon";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  placeholder = "Buscar...",
  inputRef,
  autoFocus,
}: SearchBarProps) {
  return (
    <Input
      inputRef={inputRef}
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      fullWidth
      prefix={<Icons.search size={16} />}
    />
  );
}

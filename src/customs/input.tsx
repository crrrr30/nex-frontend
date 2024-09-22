import { cn } from "@/lib/utils";
import { ChangeEventHandler } from "react";

export default function Input({
  icon,
  placeholder,
  value,
  onChange,
  onSubmit: submit,
  error = false,
}: {
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit?: () => void;
  error?: boolean;
}) {
  const className = cn(
    "border-b transition-colors flex items-center p-2 grow",
    error ? "border-b-red-500" : "has-[:focus]:border-b-black"
  );
  return (
    <div className={className}>
      {icon && <span className="mr-4">{icon}</span>}
      <input
        className="bg-transparent border-none outline-none w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={submit ? (e) => e.key === "Enter" && submit() : undefined}
      />
    </div>
  );
}

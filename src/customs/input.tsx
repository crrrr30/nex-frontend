import { cn } from "@/lib/utils";

export default function Input({
  icon,
  placeholder,
  onSubmit,
  error = false,
  ...props
}: {
  icon?: React.ReactNode;
  placeholder?: string;
  onSubmit?: () => void;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
        {...props}
        onKeyDown={
          onSubmit ? (e) => e.key === "Enter" && onSubmit() : undefined
        }
      />
    </div>
  );
}

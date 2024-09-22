import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InlineCodeProps {
  children: ReactNode;
  className?: string;
}

export default function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code className={cn(className, "bg-gray-100 p-1 rounded-md")}>
      {children}
    </code>
  );
}

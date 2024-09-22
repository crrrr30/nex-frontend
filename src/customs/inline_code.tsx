import { ReactNode } from "react";

interface InlineCodeProps {
  children: ReactNode;
}

export default function InlineCode({ children }: InlineCodeProps) {
  return <code className="bg-gray-100 p-1 rounded-md">{children}</code>;
}

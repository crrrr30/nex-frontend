import { cn } from "@/lib/utils";

export default function StatusDot({
  status,
}: {
  status: "pending" | "error" | "success";
}) {
  let color: string;
  switch (status) {
    case "pending":
      color = "bg-yellow-500";
      break;
    case "error":
      color = "bg-red-500";
      break;
    case "success":
      color = "bg-green-500";
      break;
  }
  return <span className={cn("size-1.5 rounded-full", color)} />;
}

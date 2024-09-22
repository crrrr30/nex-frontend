import { ReactNode } from "react";
import Link from "next/link";
// import { ArrowRightIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NexLink({
  href,
  icon: Icon,
  onClick,
  children,
  className,
  error = false,
}: {
  href?: string;
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  onClick?: () => void;
  children: string;
  // children: ReactNode;
  className?: string;
  error?: boolean;
}) {
  const iconClassName = cn(
    error ? "text-red-500" : "",
    "inline ml-1 mb-1 group-hover:translate-x-1 transition-transform transform-gpu size-4"
  );
  const linkClassName = cn(
    error ? "error-link" : "black-link",
    "group",
    className
  );

  const icon = Icon ? (
    <Icon className={iconClassName} />
  ) : (
    <ArrowRightIcon className={iconClassName} />
  );

  if (href)
    return (
      <Link href={href} className={linkClassName}>
        <span>
          {children}
          {icon}
        </span>
      </Link>
    );
  else if (onClick)
    return (
      <button onClick={onClick} className={linkClassName}>
        <span className={error ? "text-red-500" : ""}>
          {children}
          {icon}
        </span>
      </button>
    );
  else return children;
}

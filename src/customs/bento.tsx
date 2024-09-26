import { MagicCard } from "@/components/magicui/magic-card";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CubeIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import NexLink from "./link";

const features = [
  {
    Icon: CubeIcon,
    name: "Create a Package",
    description: "Publish your own packages and share it with anyone anywhere.",
    href: "/create-package",
    cta: "Let's Go!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "Search for Packages",
    description:
      "Explore all packages from our centrally hosted or community supported directory.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
  },
  {
    Icon: DownloadIcon,
    name: "Install a Package",
    description: "Install a distributed package with a ticket.",
    href: "/install-package",
    cta: "Download Now",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
  },
];

export function Bento({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("flex flex-row justify-between", className)}>
      {features.map((feature) => (
        <MagicCard className="group h-72 w-[25vw] border rounded-xl px-4 py-6 backdrop-blur-sm">
          <div className="flex flex-col h-full justify-between">
            <div className="group-hover:-translate-y-2 duration-300">
              <div className="h-8" />
              <feature.Icon className="size-8" />
              <div className="h-6" />
              <p className="text-xl font-bold max-w-[75%]">{feature.name}</p>
            </div>
            <div className="grow" />
            <div>
              <div className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-gray-100 rounded-lg text-sm">
                <NexLink onClick={() => {}}>{feature.cta}</NexLink>
              </div>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
}

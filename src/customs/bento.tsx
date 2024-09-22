import {
  CubeIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

const features = [
  {
    Icon: CubeIcon,
    name: "Create a Package",
    description: "Publish your own packages and share it with anyone anywhere.",
    href: "/",
    cta: "Let's Go!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    // className: "row-start-1 row-end-3 col-start-1 col-end-2",
    className: "row-start-1 row-end-3 col-start-1 col-end-2",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "Search for Packages",
    description:
      "Explore all packages from our centrally hosted or community supported directory.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    // className: "row-start-3 row-end-5 col-start-1 col-end-2",
    className: "row-start-1 row-end-3 col-start-2 col-end-3",
  },
  {
    Icon: DownloadIcon,
    name: "Install a Package",
    description: "Install a distributed package with a ticket.",
    href: "/",
    cta: "Download Now",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    // className: "row-start-3 row-end-5 col-start-1 col-end-2",
    className: "row-start-1 row-end-3 col-start-3 col-end-4",
  },
];

export function Bento({ className, ...props }: { className?: string }) {
  <p className="row-end"> </p>;
  return (
    <BentoGrid className={`grid-rows-4 ${className}`} {...props}>
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

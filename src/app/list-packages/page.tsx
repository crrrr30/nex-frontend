"use client";

import BlurFade from "@/components/magicui/blur-fade";
import SparklesText from "@/components/magicui/sparkles-text";
import InlineCode from "@/customs/inline_code";
import TopBar from "@/customs/top_bar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { MagicCard } from "@/components/magicui/magic-card";
import NexLink from "@/customs/link";

interface Dependency {
  package_ticket: string;
  version: string;
}

interface VersionMetadata {
  version: string;
  files: { [key: string]: number[] };
  dependencies: Dependency[];
}

interface Package {
  name: string;
  version: VersionMetadata;
  description: string;
  ticket: string;
}

export default function ListPackages() {
  const [packages, setPackages] = useState<Package[]>();

  require("@lottiefiles/lottie-player");

  useEffect(() => {
    (async () => {
      console.log("Listing Packages");
      const res: Package[] = await invoke("list_packages");
      console.log("List Packages:", res);
      setPackages(res);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-16">
      <script
        type="module"
        src="https://unpkg.com/@dotlottie/player-component@1.0.0/dist/dotlottie-player.js"
      ></script>
      <BlurFade delay={0.25} inView>
        <TopBar />
      </BlurFade>

      <BlurFade delay={0.25 * 2} inView>
        <SparklesText
          text="Your Packages"
          className="text-3xl"
          sparklesCount={6}
        />
      </BlurFade>

      <div className="h-8" />
      <BlurFade delay={0.25 * 3} inView>
        {packages ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <lottie-player
              className="bg-red-500"
              autoplay
              loop
              mode="normal"
              src="/loading.json"
              style={{ width: "180px", height: "180px" }}
            />
            <p>Loading...</p>
          </div>
        )}
      </BlurFade>
    </div>
  );
}

function BytesToHexHash(bytes: number[]): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function FileEntry({
  path,
  hash,
  ...prop
}: {
  path: string;
  hash: number[];
} & React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsOpen(false), 1000);
  }, [isOpen]);

  return (
    <li className="relative flex flex-row justify-between">
      {path}:
      <InlineCode className="max-w-36 text-sm overflow-auto">
        {BytesToHexHash(hash)}
      </InlineCode>
      <button className="absolute top-0 right-0 w-6 h-full flex justify-center items-center">
        <Popover
          open={isOpen}
          onOpenChange={async (isOpen) =>
            isOpen && (await writeText(BytesToHexHash(hash)))
          }
        >
          <PopoverTrigger onClick={() => setIsOpen(true)}>
            <div className="backdrop-blur-sm bg-white bg-opacity-50 p-1 rounded-sm border">
              <CopyIcon />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit">
            <Label>Copied!</Label>
          </PopoverContent>
        </Popover>
      </button>
    </li>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsOpen(false), 1000);
  }, [isOpen]);

  return (
    <MagicCard className="bg-opacity-50 rounded-md border p-4 backdrop-blur-sm">
      <p className="font-bold flex justify-between items-center">
        {pkg.name}{" "}
        <InlineCode className="text-sm">v{pkg.version.version}</InlineCode>
      </p>
      {pkg.description.length > 0 && (
        <Label className="text-gray-500">{pkg.description}</Label>
      )}
      <div className="h-[1px] my-4 bg-gray-200" />
      <ScrollArea>
        <div className="h-4" />
        <p className="text-sm font-bold">Files:</p>
        <ul>
          {Object.entries(pkg.version.files).map(([path, hash], i) => (
            <FileEntry key={i} path={path} hash={hash}></FileEntry>
          ))}
        </ul>
        <div className="h-4" />
        <p className="text-sm font-bold">Dependencies:</p>
        {pkg.version.dependencies.length > 0 ? (
          <ul>
            {pkg.version.dependencies.map((dep) => (
              <li>
                {dep.package_ticket} - {dep.version}
              </li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </ScrollArea>

      <div className="h-4" />
      <span>
        <Popover
          open={isOpen}
          onOpenChange={async (isOpen) =>
            isOpen && (await writeText(pkg.ticket))
          }
        >
          <PopoverTrigger onClick={() => setIsOpen(true)}>
            <NexLink onClick={() => {}} icon={CopyIcon}>
              Ticket
            </NexLink>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit">
            <Label>Copied!</Label>
          </PopoverContent>
        </Popover>
      </span>
    </MagicCard>
  );
}

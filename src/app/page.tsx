"use client";

import BlurFade from "@/components/magicui/blur-fade";
import SparklesText from "@/components/magicui/sparkles-text";
import { Bento } from "@/customs/bento";
import { open } from "@tauri-apps/plugin-shell";

import NexLink from "@/customs/link";

export default function Home() {
  return (
    <div className="py-24 max-w-[80vw] mx-auto">
      <div className="flex flex-row justify-center">
        <div className="flex flex-col">
          <BlurFade delay={0.25} inView>
            <SparklesText text="Introducing nex" />
          </BlurFade>
          <div className="h-8" />
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-lg">
              <NexLink
                onClick={async () => await open("https://www.nexinaction.com/")}
              >
                <span className="font-bold">nex</span>
              </NexLink>{" "}
              is a next generation distributed package manager.
            </p>
          </BlurFade>
        </div>
      </div>
      <div className="h-24" />
      <Bento />
      <div className="h-24" />
      <div>
        <p className="text-lg">
          <span className="font-bold">nex</span> is an{" "}
          <NexLink
            onClick={async () => await open("https://github.com/cab7390/nex")}
          >
            open-source
          </NexLink>{" "}
          project build on top of{" "}
          <NexLink onClick={async () => await open("iroh.computer/")}>
            Iroh
          </NexLink>{" "}
          by <NexLink onClick={() => {}}>Christian Bowman</NexLink>,{" "}
          <NexLink onClick={() => {}}>David Araujo</NexLink>, and{" "}
          <NexLink onClick={() => {}}>Jonathan Cui</NexLink>.
        </p>
      </div>
    </div>
  );
}

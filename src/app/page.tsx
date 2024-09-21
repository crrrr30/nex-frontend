"use client";

import { invoke } from "@tauri-apps/api/core";
import BlurFade from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import SparklesText from "@/components/magicui/sparkles-text";
import { Bento } from "@/customs/bento";
import InlineCode from "@/customs/mine";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ReactNode, useState } from "react";

export default function Home() {
  return (
    <>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />
      <div>
        <div className="flex flex-row justify-center py-48">
          <div className="flex flex-col">
            <BlurFade delay={0.25} inView>
              <SparklesText text="Introducing nex" />
            </BlurFade>
            <div className="h-8" />
            <BlurFade delay={0.25 * 2} inView>
              <p className="text-lg">
                <InlineCode>nex</InlineCode> is a next generation distributed
                package manager.{" "}
                <MyLink href="https://google.com/">hello world</MyLink>
                <button
                  onClick={async () => {
                    const str: string = await invoke("my_custom_command", {
                      my_value: "Jon",
                    });
                    console.log("str return:", str);
                  }}
                >
                  <p>Click me</p>
                </button>
              </p>
            </BlurFade>
          </div>
        </div>
        <Bento className="max-w-[80vw] mx-auto h-[600px]" />
      </div>
    </>
  );
}

function MyLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="black-link group">
      <span>
        {children}
        <ArrowRightIcon className="inline ml-1 group-hover:translate-x-12 transform-gpu" />
      </span>
    </Link>
  );
}

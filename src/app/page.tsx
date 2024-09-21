"use client";

import BlurFade from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import SparklesText from "@/components/magicui/sparkles-text";
import { Bento } from "@/customs/bento";
import InlineCode from "@/customs/mine";
import { cn } from "@/lib/utils";

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
                <button onClick={async () => await open("https://google.com/")}>
                  Hi
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

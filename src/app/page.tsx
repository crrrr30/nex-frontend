"use client";

import BlurFade from "@/components/magicui/blur-fade";
import SparklesText from "@/components/magicui/sparkles-text";
import { Bento } from "@/customs/bento";
import InlineCode from "@/customs/inline_code";

export default function Home() {
  return (
    <>
      <div className="flex flex-row justify-center py-48">
        <div className="flex flex-col">
          <BlurFade delay={0.25} inView>
            <SparklesText text="Introducing nex" />
          </BlurFade>
          <div className="h-8" />
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-lg">
              <InlineCode>nex</InlineCode> is a next generation distributed
              package manager.
            </p>
          </BlurFade>
        </div>
      </div>
      <Bento className="max-w-[80vw] mx-auto h-[600px]" />
    </>
  );
}

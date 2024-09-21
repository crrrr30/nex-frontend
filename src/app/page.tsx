import BlurFade from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import DotPattern from "@/components/magicui/dot-pattern";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import SparklesText from "@/components/magicui/sparkles-text";
import { BentoDemo } from "@/customs/bento";
import { SearchCommand } from "@/customs/command";
import { DockDemo } from "@/customs/dock";
import InlineCode from "@/customs/mine";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
                package manager.
              </p>
            </BlurFade>
          </div>
        </div>
        <BentoDemo className="max-w-[80vw] mx-auto" />
      </div>
    </>
  );
}

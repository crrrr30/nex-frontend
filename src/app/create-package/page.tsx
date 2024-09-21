import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import SparklesText from "@/components/magicui/sparkles-text";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function CreatePackage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center gap-16 my-8">
        <SparklesText text="nex" className="text-xl" sparklesCount={4} />
        <Input>
          <MagnifyingGlassIcon />
        </Input>
      </div>
    </div>
  );
}

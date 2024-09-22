"use client";

import SparklesText from "@/components/magicui/sparkles-text";
import { useState } from "react";
import Input from "@/customs/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function TopBar() {
  const [searchValue, setSearchValue] = useState("");

  function search() {
    console.log("Searching for", searchValue);
  }

  return (
    <div className="flex justify-between items-center py-16">
      <p className="text-xl font-bold" children="nex" />
      {/* <SparklesText text="nex" className="text-xl" sparklesCount={4} /> */}
      <div className="w-12" />
      <Input
        icon={<MagnifyingGlassIcon className="size-5" />}
        onChange={(e) => setSearchValue(e.target.value)}
        onSubmit={search}
      />
      <div className="w-4" />
      <RainbowButton onClick={search}>Search</RainbowButton>
    </div>
  );
}

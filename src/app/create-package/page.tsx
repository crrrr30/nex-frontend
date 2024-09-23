"use client";

import BlurFade from "@/components/magicui/blur-fade";
import SparklesText from "@/components/magicui/sparkles-text";
import Input from "@/customs/input";
import TopBar from "@/customs/top_bar";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { FileTree, PackageFile } from "./file_tree";
import NexLink from "@/customs/link";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function CreatePackage() {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState(false);

  const [version, setVersion] = useState<string>("");
  const [versionError, setVersionError] = useState(false);

  const [description, setDescription] = useState<string>("");

  const [packageDir, setPackageDir] = useState<string | undefined>();
  const [packageDirError, setPackageDirError] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<PackageFile[]>([]);

  function clearPage() {
    setName("");
    setNameError(false);

    setVersion("");
    setVersionError(false);

    setDescription("");

    setPackageDir(undefined);
    setPackageDirError(false);

    setSelectedFiles([]);
  }

  async function handleSubmit() {
    let abort = false;

    if (name.length === 0) {
      setNameError(true);
      abort = true;
    } else setNameError(false);

    const splitVersions = version.split(".");
    if (
      splitVersions.length != 3 ||
      splitVersions.filter((v) => Number(v).toString() == v && Number(v) >= 0)
        .length != 3
    ) {
      setVersionError(true);
      abort = true;
    } else setVersionError(false);

    if (!packageDir) {
      setPackageDirError(true);
      abort = true;
    } else setPackageDirError(false);

    if (abort) return;

    const result: string = await invoke("create_package", {
      name,
      version,
      description,
      packageDir,
      selectedFiles,
    });

    toast("Package created");
    clearPage();
  }

  return (
    <div className="max-w-4xl mx-auto px-16">
      <BlurFade delay={0.25} inView>
        <TopBar />
      </BlurFade>

      <BlurFade delay={0.25 * 2} inView>
        <SparklesText
          text="Create a New Package"
          className="text-3xl"
          sparklesCount={6}
        />
      </BlurFade>

      <div className="h-8" />

      <BlurFade delay={0.25 * 3} inView>
        <div className="flex gap-16">
          <Input
            placeholder="Package Name"
            onChange={(e) => setName(e.target.value)}
            error={nameError}
          />
          <Input
            placeholder="Version (x.x.x)"
            onChange={(e) => setVersion(e.target.value)}
            error={versionError}
          />
        </div>

        <div className="h-6" />

        <Input
          placeholder="Description (Optional)"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="h-6" />

        <div className="flex flex-row gap-16">
          <span className="min-w-fit">
            <NexLink
              onClick={async () => {
                const selected = await open({
                  directory: true,
                });
                if (selected) {
                  setPackageDir(selected);
                  setSelectedFiles([]);
                }
              }}
              error={packageDirError}
            >
              Select Project Directory
            </NexLink>
          </span>
          {packageDir && <p>{packageDir}</p>}
        </div>

        {packageDir && (
          <>
            <div className="h-6" />

            <FileTree
              baseDir={packageDir}
              paths={selectedFiles}
              setPaths={setSelectedFiles}
            />
          </>
        )}

        {/* <div className="h-8" />
        <h1>My tree:</h1>
        <div className="h-8" />
        <MyTree /> */}

        <div className="h-8" />

        <RainbowButton onClick={handleSubmit}>Create</RainbowButton>
      </BlurFade>
    </div>
  );
}

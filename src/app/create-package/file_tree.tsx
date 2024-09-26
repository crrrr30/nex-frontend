"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import NexLink from "@/customs/link";
import { open } from "@tauri-apps/plugin-dialog";
import StatusDot from "@/customs/dot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Input from "@/customs/input";
import { toast } from "sonner";
import { MagicCard } from "@/components/magicui/magic-card";

export interface PackageFile {
  path: string;
  installPath: string | undefined;
}

interface FileTreeNode {
  id: string;
  name: string;
  isFile: boolean;
  children: FileTreeNode[];
  path: string;
}

export function FileTree({
  baseDir: base_dir,
  paths,
  setPaths,
}: {
  baseDir: string;
  paths: PackageFile[];
  setPaths: Dispatch<SetStateAction<PackageFile[]>>;
}) {
  const [installPathEdits, setInstallPathEdits] = useState<{
    [key: string]: string;
  }>({});
  const [editing, setEditing] = useState<string | undefined>();

  useEffect(() => {
    setInstallPathEdits(
      Object.fromEntries(paths.map((p) => [p.path, p.installPath ?? ""]))
    );
  }, [paths]);

  const filePaths = paths.map((p) => p.path);

  const commonPrefix = base_dir + "/";
  const relativePaths = filePaths.map((path) =>
    path.startsWith(commonPrefix) ? path.substring(commonPrefix.length) : path
  );

  // Build the tree using the relative paths
  const { rootNodes: elements, maxId } = buildTree(relativePaths, filePaths);

  function renderTree(node: FileTreeNode) {
    const installPath = installPathEdits[node.path];
    const finalInstallPath = paths.filter((p) => p.path == node.path)[0]
      .installPath;

    if (!node) return null;

    if (node.isFile) {
      return (
        <div className="flex">
          <Popover
            open={node.path === editing}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                document.getElementById(node.path)?.blur();
              }
              setEditing(isOpen ? node.path : undefined);

              if (!isOpen) {
                setPaths(
                  paths.map((p) => {
                    console.log(
                      "installPath.endsWith('/')",
                      installPath.endsWith("/")
                    );
                    return p.path === node.path
                      ? {
                          path: p.path,
                          installPath: installPath.endsWith("/")
                            ? installPath + node.name
                            : installPath,
                        }
                      : p;
                  })
                );
              }
            }}
          >
            <PopoverTrigger className="flex items-center">
              <File
                value={node.id}
                key={node.id}
                className="pointer-events-none bg-clip-border"
              >
                <p>{node.name}</p>
              </File>
              <div className="w-4" />
              <StatusDot status={finalInstallPath ? "success" : "pending"} />
              {finalInstallPath && (
                <>
                  <div className="w-4" />
                  <span className="text-sm text-gray-400">
                    {finalInstallPath}
                  </span>
                </>
              )}
            </PopoverTrigger>
            <PopoverContent align="start">
              <Input
                id={node.path}
                placeholder={"Install Path"}
                value={installPath}
                onChange={(e) =>
                  setInstallPathEdits({
                    ...installPathEdits,
                    [node.path]: e.target.value,
                  })
                }
                onSubmit={() => {
                  setPaths(
                    paths.map((p) =>
                      p.path === node.path
                        ? {
                            path: p.path,
                            installPath: installPath.endsWith("/")
                              ? installPath + node.name
                              : installPath,
                          }
                        : p
                    )
                  );
                  setEditing(undefined);
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="grow" />
          <button
            className="text-red-500 text-base"
            onClick={() => {
              setPaths(paths.filter((p) => p.path !== node.path));
            }}
          >
            <TrashIcon />
          </button>
        </div>
      );
    } else {
      return (
        <Folder element={node.name} value={node.id} key={node.id}>
          {node.children.map((child) => renderTree(child))}
        </Folder>
      );
    }
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background bg-opacity-50 backdrop-blur-sm">
      <MagicCard className="w-full px-4 py-4">
        <NexLink
          icon={PlusIcon}
          onClick={async () => {
            const selected = await open({
              multiple: true,
              recursive: true,
            });

            if (!selected) return;

            let failed = false;
            for (const path of selected) {
              if (!path.startsWith(base_dir)) {
                toast(
                  `The path "${
                    path.split("/")[path.split("/").length - 1]
                  }" is not in the project directory. From ${selected.join(
                    ", "
                  )}`
                );
                failed = true;
              }
            }
            if (failed) return;

            setPaths((paths) =>
              [
                ...paths,
                ...selected.map((p) => ({ path: p, installPath: undefined })),
              ].sort()
            );
          }}
        >
          Add Files
        </NexLink>
        <div className="h-6" />
        {paths.length > 0 && (
          <Tree
            initialExpandedItems={Array(maxId)
              .fill("")
              .map((_, i) => (i + 1).toString())}
          >
            {elements.map((element) => renderTree(element))}
          </Tree>
        )}
      </MagicCard>
    </div>
  );
}

function buildTree(paths: string[], allPaths: string[]) {
  let idCounter = 1;

  function createNode(
    name: string,
    isFile: boolean = false,
    path: string = ""
  ) {
    return {
      id: (idCounter++).toString(),
      name: name,
      isFile: isFile,
      children: [],
      path: path,
    };
  }

  const rootNodes: FileTreeNode[] = [];

  for (let i = 0; i < paths.length; i++) {
    // const path of paths
    const path = paths[i];

    const parts = path.split("/").filter(Boolean); // Remove empty strings
    let currentLevel = rootNodes;

    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      const isFile = index === parts.length - 1 && !path.endsWith("/");
      let node = currentLevel.find((n) => n.name === part);

      if (!node) {
        node = createNode(part, isFile, allPaths[i]);
        currentLevel.push(node);
      }

      if (!node.isFile) {
        currentLevel = node.children;
      }
    }
  }

  return { rootNodes, maxId: idCounter - 1 };
}

"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
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
  paths,
  setPaths,
}: {
  paths: PackageFile[];
  setPaths: Dispatch<SetStateAction<PackageFile[]>>;
}) {
  const filePaths = paths.map((p) => p.path);
  console.log("Rebuilding with paths", filePaths);

  // Compute the longest common prefix
  const commonPrefix = getCommonPathPrefix(filePaths);

  // Strip the common prefix from each path
  const relativePaths = filePaths.map((path) =>
    path.startsWith(commonPrefix) ? path.substring(commonPrefix.length) : path
  );

  // Build the tree using the relative paths
  const elements = buildTree(relativePaths, filePaths);

  // Collect folder IDs for initial expansion if needed
  const folderIds: string[] = [];

  function collectFolderIds(node: FileTreeNode) {
    if (!node.isFile) {
      folderIds.push(node.id);
      node.children.forEach(collectFolderIds);
    }
  }

  elements.forEach(collectFolderIds);

  function renderTree(node: FileTreeNode) {
    const [installPath, setInstallPath] = useState("");
    const finalInstallPath = paths.filter((p) => p.path == node.path)[0]
      .installPath;

    if (!node) return null;

    if (node.isFile) {
      return (
        <div
          className="flex hover:cursor-pointer"
          onClick={() => {
            console.log("Hi from node", node);
          }}
        >
          <Popover
            onOpenChange={(isOpen) => {
              console.log("Popover for node", node, "is now", isOpen);
              if (!isOpen) {
                setPaths(
                  paths.map((p) =>
                    p.path === node.path ? { path: p.path, installPath } : p
                  )
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
                placeholder={"Install Path"}
                value={installPath}
                onChange={(e) => setInstallPath(e.target.value)}
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
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <div className="w-full flex pl-4 py-4">
        <NexLink
          icon={PlusIcon}
          onClick={async () => {
            const selected = await open({
              multiple: true,
              recursive: true,
            });

            if (!selected) return;

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
      </div>
      {paths.length > 0 && (
        <Tree
          className="p-2 overflow-hidden rounded-md bg-background"
          initialExpandedItems={folderIds}
          elements={elements}
        >
          {elements.map((element) => renderTree(element))}
        </Tree>
      )}
    </div>
  );
}

function getCommonPathPrefix(paths: string[]) {
  if (!paths || paths.length === 0) return "";

  // Split each path into its components
  const splitPaths = paths.map((path) => path.split("/"));
  const minLen = Math.min(...splitPaths.map((parts) => parts.length));
  const commonParts = [];

  // Find the common prefix
  for (let i = 0; i < minLen; i++) {
    const part = splitPaths[0][i];
    if (splitPaths.every((parts) => parts[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }

  return commonParts.length > 0 ? commonParts.join("/") + "/" : "";
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

  // Collapse nodes with only one child
  collapseSingleChildFolders(rootNodes);

  console.log(rootNodes);
  return rootNodes;
}

function collapseSingleChildFolders(nodes: FileTreeNode[], level = 0) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (!node.isFile) {
      if (
        node.children.length === 1 &&
        !node.children[0].isFile &&
        level > 0 // Only collapse beyond the root level
      ) {
        // Collapse the child into the parent
        node.name = node.name + "/" + node.children[0].name;
        node.id = node.id; // Keep the parent's ID
        node.children = node.children[0].children;
        // Repeat the process in case there are multiple single-child folders
        collapseSingleChildFolders([node], level);
      } else {
        // Recurse into children
        collapseSingleChildFolders(node.children, level + 1);
      }
    }
  }
}

"use client";

import InlineCode from "@/customs/inline_code";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface Dependency {
  package_ticket: string;
  version: string;
}

interface VersionMetadata {
  version: string;
  files: { [key: string]: number[] };
  dependencies: Dependency[];
}

interface Package {
  name: string;
  version: VersionMetadata;
  description: string;
  ticket: string;
}

export default function ListPackages() {
  const [packages, setPackages] = useState<Package[]>();

  useEffect(() => {
    (async () => {
      console.log("Listing Packages");
      const res: Package[] = await invoke("list_packages");
      console.log("List Packages:", res);
      setPackages(res);
    })();
  }, []);
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">List Packages</h1>
      <div>
        {packages ? (
          packages.length == 0 ? (
            <p>Add a new one to get fucking started</p>
          ) : (
            <>
              {packages.map((p) => (
                <div key={p.name} className="border p-4 my-4">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <p className="text-lg">{p.description}</p>
                  <p className="text-lg">
                    Ticket: <InlineCode>{p.ticket}</InlineCode>
                  </p>
                  <h3 className="text-lg font-bold">
                    Version: {p.version.version}
                  </h3>
                  <h3 className="text-lg font-bold">Dependencies:</h3>
                  <ul>
                    {p.version.dependencies.map((d) => (
                      <li key={d.package_ticket}>
                        {d.package_ticket}@{d.version}
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-bold">Files:</h3>
                  <ul>
                    {Object.entries(p.version.files).map(([path, hash]) => (
                      <li key={path}>
                        {path} <InlineCode>{BytesToHexHash(hash)}</InlineCode>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

function BytesToHexHash(bytes: number[]): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

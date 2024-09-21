"use client";

import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import { ReactNode, useEffect, useState } from "react";
import { SearchCommand } from "./command";

export default function KeybindWrapper({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    (async () => {
      return;

      if (await isRegistered("CmdOrControl+K")) {
        await unregister(["CommandOrControl+K", "Escape"]);
      }
      await register("CommandOrControl+K", (shortcut) => {
        if (shortcut.state == "Released") setShowSearch((prev) => !prev);
      });
      await register("Escape", (shortcut) => {
        if (shortcut.state == "Released")
          setShowSearch((prev) => {
            if (prev) return false;
            return prev;
          });
      });
    })();
  }, []);

  return (
    <>
      {children}

      {showSearch && <SearchCommand />}
    </>
  );
}

"use client";

import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SearchCommand } from "./command";

export const KeybindContext = createContext<{ showSearch: boolean }>({
  showSearch: false,
});

export default function KeybindWrapper({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    (async () => {
      if (await isRegistered("CmdOrControl+K")) {
        await unregister(["CommandOrControl+K"]);
      }
      await register(["CommandOrControl+K"], (shortcut) => {
        if (shortcut.state == "Released") setShowSearch((prev) => !prev);
      });
    })();
  }, []);

  return (
    <KeybindContext.Provider value={{ showSearch: showSearch }}>
      {children}

      {showSearch && <SearchCommand />}
    </KeybindContext.Provider>
  );
}

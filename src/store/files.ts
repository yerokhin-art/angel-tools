import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  computeMissing,
  type FileRow,
  type LocalFile,
} from "../utils/cameraSequence";

export type Filter = "all" | "local" | "missed";

type State = {
  directoryPath: string | null;
  allRows: FileRow[];
  missedRows: FileRow[];
  filter: Filter;
  loading: boolean;
  selectDirectory: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilter: (f: Filter) => void;
  copyMissedList: () => Promise<void>;
};

export const useFileStore = create<State>((set, get) => ({
  directoryPath: null,
  allRows: [],
  missedRows: [],
  filter: "all",
  loading: false,

  selectDirectory: async () => {
    const dir = (await open({
      directory: true,
      multiple: false,
      defaultPath: get().directoryPath ?? undefined,
    })) as string | null;
    if (!dir) return;
    set({ directoryPath: dir });
    await get().refresh();
  },

  refresh: async () => {
    const dir = get().directoryPath;
    if (!dir) return;
    set({ loading: true });
    try {
      const files = (await invoke("list_directory", { dir })) as LocalFile[];
      const { rows, missed } = computeMissing(files);
      set({ allRows: rows, missedRows: missed });
    } finally {
      set({ loading: false });
    }
  },

  setFilter: (f) => set({ filter: f }),

  copyMissedList: async () => {
    const { missedRows } = get();
    const text = missedRows.map((r) => r.name).join("\n");
    await navigator.clipboard.writeText(text);
  },
}));

// Selectors
export const selectFilteredRows = (s: State): FileRow[] => {
  switch (s.filter) {
    case "local":
      return s.allRows.filter((r) => r.kind === "local");
    case "missed":
      return s.allRows.filter((r) => r.kind === "missing");
    default:
      return s.allRows;
  }
};
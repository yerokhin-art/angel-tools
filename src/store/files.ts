import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  computeMissing,
  type FileRow,
  type LocalFile,
} from "../utils/cameraSequence";

export type Filter = "all" | "local" | "missed";

export type FolderInfo = {
  name: string;
  path: string;
};

type State = {
  directoryPath: string | null;
  allRows: FileRow[];
  missedRows: FileRow[];
  filter: Filter;
  searchQuery: string;
  loading: boolean;
  folderStructure: FolderInfo[];
  selectDirectory: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilter: (f: Filter) => void;
  setSearchQuery: (query: string) => void;
  copyMissedList: () => Promise<void>;
};

export const useFileStore = create<State>((set, get) => ({
  directoryPath: null,
  allRows: [],
  missedRows: [],
  filter: "all",
  searchQuery: "",
  loading: false,
  folderStructure: [],

  selectDirectory: async () => {
    const dir = (await open({
      directory: true,
      multiple: false,
      defaultPath: get().directoryPath ?? undefined,
    })) as string | null;
    if (!dir) return;
    set({ directoryPath: dir, searchQuery: "", filter: "all" });
    await get().refresh();
  },

  refresh: async () => {
    const dir = get().directoryPath;
    if (!dir) return;
    set({ loading: true });
    try {
      const files = (await invoke("list_directory", { dir })) as LocalFile[];
      const { rows, missed } = computeMissing(files);
      
      // Extract folder structure from file paths
      const folders = new Map<string, FolderInfo>();
      for (const file of files) {
        const parts = file.path.split("/");
        // Remove the filename to get directory parts
        parts.pop();
        // Get immediate subdirectories relative to the selected directory
        const dirParts = dir.split("/");
        if (parts.length > dirParts.length) {
          const subfolderName = parts[dirParts.length];
          const subfolderPath = parts.slice(0, dirParts.length + 1).join("/");
          if (subfolderName && !folders.has(subfolderPath)) {
            folders.set(subfolderPath, { name: subfolderName, path: subfolderPath });
          }
        }
      }
      
      set({ 
        allRows: rows, 
        missedRows: missed,
        folderStructure: Array.from(folders.values()).sort((a, b) => 
          a.name.localeCompare(b.name)
        ),
      });
    } finally {
      set({ loading: false });
    }
  },

  setFilter: (f) => set({ filter: f }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),

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

// Selector that applies both filter and search
export const selectSearchFilteredRows = (s: State): FileRow[] => {
  const filtered = selectFilteredRows(s);
  const query = s.searchQuery.toLowerCase().trim();
  
  if (!query) {
    return filtered;
  }
  
  return filtered.filter((row) => 
    row.name.toLowerCase().includes(query)
  );
};

// Count selectors
export const selectTotalFiles = (s: State): number => selectFilteredRows(s).length;

export const selectAvailableCount = (s: State): number =>
  selectFilteredRows(s).filter((r) => r.kind === "local").length;

export const selectMissingCount = (s: State): number =>
  selectFilteredRows(s).filter((r) => r.kind === "missing").length;
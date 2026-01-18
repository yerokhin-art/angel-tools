// Utilities to derive numeric sequences from camera-like filenames and compute gaps.

export type SequenceInfo = {
  keyPattern: string; // e.g. "C####.MP4"
  index: number; // numeric part (parsed)
  width: number; // digit width (e.g. 4)
  buildName: (idx: number) => string;
};

// Try to match the last numeric run: prefix + digits + (ext?)
const lastDigitsRe = /^(.*?)(\d+)(\.[^.]+)?$/;

export function deriveSequence(filename: string): SequenceInfo | null {
  const m = filename.match(lastDigitsRe);
  if (!m) return null;
  const [, prefix, digits, ext = ""] = m;
  const width = digits.length;
  const index = Number.parseInt(digits, 10);
  if (!Number.isFinite(index)) return null;
  const keyPattern = `${prefix}${"#".repeat(width)}${ext}`;
  const buildName = (idx: number) =>
    `${prefix}${idx.toString().padStart(width, "0")}${ext}`;
  return { keyPattern, index, width, buildName };
}

export type LocalFile = {
  name: string;
  path: string;
  size: number;
  modified_ms?: number;
};

export type FileRow = {
  id: string;
  name: string;
  sizeBytes: number;
  mtimeMs?: number;
  kind: "local" | "missing";
  keyPattern?: string;
  index?: number;
};

export function computeMissing(local: LocalFile[]): {
  rows: FileRow[];
  missed: FileRow[];
} {
  // Convert locals to rows with sequence metadata
  const localRows: FileRow[] = local.map((f) => {
    const seq = deriveSequence(f.name);
    return {
      id: f.path || f.name,
      name: f.name,
      sizeBytes: f.size ?? 0,
      mtimeMs: f.modified_ms,
      kind: "local",
      keyPattern: seq?.keyPattern,
      index: seq?.index,
    };
  });

  // Group by keyPattern (only those with a sequence)
  const groups = new Map<
    string,
    { width: number; indices: Set<number>; anyName: string }
  >();
  for (const r of localRows) {
    if (!r.keyPattern || typeof r.index !== "number") continue;
    const seq = deriveSequence(r.name);
    if (!seq) continue;
    const g = groups.get(seq.keyPattern) ?? {
      width: seq.width,
      indices: new Set<number>(),
      anyName: r.name,
    };
    g.indices.add(seq.index);
    g.anyName = r.name;
    groups.set(seq.keyPattern, g);
  }

  // For each group, compute continuous range and gaps
  const missed: FileRow[] = [];
  for (const [keyPattern, g] of groups) {
    const indicesSorted = [...g.indices].sort((a, b) => a - b);
    const min = indicesSorted[0];
    const max = indicesSorted[indicesSorted.length - 1];
    // Reconstruct builder from anyName
    const builder =
      deriveSequence(g.anyName)?.buildName ??
      ((i: number) => `${keyPattern.replace(/#+/, String(i))}`);
    for (let i = min; i <= max; i++) {
      if (!g.indices.has(i)) {
        const name = builder(i);
        missed.push({
          id: `missing:${keyPattern}:${i}`,
          name,
          sizeBytes: 0,
          kind: "missing",
          keyPattern,
          index: i,
        });
      }
    }
  }

  const rows = [...localRows, ...missed].sort((a, b) => {
    // Sort by keyPattern then index then name
    const ak = a.keyPattern ?? "~";
    const bk = b.keyPattern ?? "~";
    if (ak !== bk) return ak.localeCompare(bk);
    if (a.index != null && b.index != null && a.index !== b.index)
      return a.index - b.index;
    return a.name.localeCompare(b.name);
  });

  return { rows, missed };
}

export function formatSizeMB(bytes: number): string {
  if (!bytes) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatMtime(ms?: number): string {
  if (!ms) return "-";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "-";
  }
}

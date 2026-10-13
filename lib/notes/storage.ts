export const notesStorageKey = "notes-browser";
export const noteColors = [
  "#fef3c7",
  "#fce7f3",
  "#dbeafe",
  "#dcfce7",
  "#ede9fe",
  "#ffedd5",
  "#e0f2fe",
  "#fae8ff",
] as const;

export type Note = {
  id: string;
  title: string;
  body: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};
type NotesStorage = Pick<Storage, "getItem" | "setItem">;

export function loadNotes(storage: NotesStorage): Note[] {
  try {
    const notes: unknown = JSON.parse(storage.getItem(notesStorageKey) ?? "[]");
    if (!Array.isArray(notes)) return [];
    const ids = new Set<string>();
    for (const note of notes) {
      if (
        !note ||
        typeof note !== "object" ||
        typeof note.id !== "string" ||
        !note.id ||
        ids.has(note.id) ||
        typeof note.title !== "string" ||
        typeof note.body !== "string" ||
        !noteColors.includes(note.color) ||
        typeof note.createdAt !== "number" ||
        !Number.isFinite(new Date(note.createdAt).getTime()) ||
        typeof note.updatedAt !== "number" ||
        !Number.isFinite(new Date(note.updatedAt).getTime())
      )
        return [];
      ids.add(note.id);
    }
    return notes;
  } catch {
    return [];
  }
}

export function saveNotes(storage: NotesStorage, notes: Note[]) {
  storage.setItem(notesStorageKey, JSON.stringify(notes));
}

export function createNote(): Note {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "",
    body: "",
    color: noteColors[Math.floor(Math.random() * noteColors.length)],
    createdAt: now,
    updatedAt: now,
  };
}

export function reorderNotes(
  notes: Note[],
  sourceId: string,
  targetId: string,
): Note[] {
  const source = notes.findIndex((note) => note.id === sourceId);
  const target = notes.findIndex((note) => note.id === targetId);
  if (source < 0 || target < 0 || source === target) return notes;
  const result = [...notes];
  const [note] = result.splice(source, 1);
  result.splice(target, 0, note);
  return result;
}

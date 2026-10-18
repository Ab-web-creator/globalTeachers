"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useEffect, useId, useRef, useState } from "react";
import { Oswald } from "next/font/google";
import { MobileMenuCloseIcon, NewNoteIcon, NotesInfoIcon, SearchIcon } from "@/app/components/svg";
import {
  createNote,
  loadNotes,
  reorderNotes,
  saveNotes,
  type Note,
} from "../../../../lib/notes/storage";
import {
  notesMessages,
  type NotesLocale,
} from "../../../../lib/notes/messages";
import NoteCard from "./note-card";
import styles from "./notes-modal.module.css";

const oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: "600", display: "swap", preload: false });

export default function NotesModal({
  buttonClassName,
  onOpenChange,
  locale,
}: {
  buttonClassName: string;
  onOpenChange: (open: boolean) => void;
  locale?: NotesLocale;
}) {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const currentNotes = useRef<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const headingId = useId();
  const messages = notesMessages[locale ?? "ru"];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function commit(next: Note[]) {
    currentNotes.current = next;
    setNotes(next);
    try {
      saveNotes(localStorage, next);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function openNotes() {
    if (dialog.current?.open) return;
    let loaded = currentNotes.current;
    // Keep unsaved in-memory changes if a storage write failed.
    if (!storageError) {
      try {
        loaded = loadNotes(localStorage);
      } catch {
        setStorageError(true);
      }
    }
    currentNotes.current = loaded;
    setNotes(loaded);
    setSearch("");
    setEditingId(null);
    dialog.current?.showModal();
    setOpen(true);
    onOpenChange(true);
  }

  function finishEditing(id: string) {
    const note = currentNotes.current.find((item) => item.id === id);
    if (note && !note.title.trim() && !note.body.trim())
      commit(currentNotes.current.filter((item) => item.id !== id));
    setEditingId((current) => (current === id ? null : current));
  }

  function closeNotes() {
    if (editingId) finishEditing(editingId);
    setOpen(false);
    onOpenChange(false);
  }

  const query = search.toLocaleLowerCase();
  const visibleNotes = notes.filter((note) =>
    `${note.title}\n${note.body}`.toLocaleLowerCase().includes(query),
  );

  return (
    <>
      <button
        type="button"
        onClick={openNotes}
        aria-label={t.content(messages.open)}
        title={t.content(messages.open)}
        aria-haspopup="dialog"
        className={buttonClassName}
      >
        <span aria-hidden="true" className="text-lg font-semibold">
          N
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={headingId}
        onClose={closeNotes}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            event.currentTarget.close();
        }}
        className="fixed inset-0 z-50 m-auto h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-8xl overflow-hidden rounded-3xl bg-white p-0 text-brand-700 shadow-2xl backdrop:bg-brand-950/50 backdrop:backdrop-blur-sm [&_:focus-visible]:outline-1 [&_:focus-visible]:outline-offset-2"
      >
        <div className="flex h-full flex-col">
          <header className="relative shrink-0 border-b border-brand-100 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center gap-4">
            <h2
              id={headingId}
              className={`${oswald.className} w-full text-xl font-semibold tracking-tight text-gray-400 sm:w-auto sm:flex-1 uppercase`}
            >
              {t.content(messages.heading)}
            </h2>
            <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-1 sm:justify-end">
              {notes.length > 0 && (
                <div className="relative min-w-0 flex-1 sm:max-w-64">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  aria-label={t.content(messages.search)}
                  placeholder={t.content(messages.search)}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className={`${styles.searchField} w-full min-w-0 rounded-full border border-brand-200 py-2 pr-11 pl-11 text-base`}
                />
                {t.content(search && (
                  <button
                    type="button"
                    aria-label={t("home.notes.notesModal.message0447")}
                    onClick={(event) => {
                      setSearch("");
                      event.currentTarget.parentElement?.querySelector("input")?.focus();
                    }}
                    className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-brand-50 hover:text-gray-500"
                  >
                    <MobileMenuCloseIcon className="size-6" strokeWidth={1} />
                  </button>
                ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  const note = createNote();
                  setSearch("");
                  commit([note, ...currentNotes.current]);
                  setEditingId(note.id);
                }}
                className={`${styles.newNoteButton} inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand-200 bg-white px-4 py-2 text-base font-semibold text-neutral-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50`}
              >
                <NewNoteIcon className="size-5 shrink-0" />
                {t.content(messages.newNote)}
              </button>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={t.content(messages.close)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-50 hover:text-brand-700"
            >
              <MobileMenuCloseIcon />
            </button>
            </div>
            </div>
            {notes.length > 0 && (
              <p className="mt-2 text-base text-neutral-500">
                {t.language !== "ru" ? t("notes.count", { count: notes.length }) : messages.count(notes.length)}
              </p>
            )}
            {storageError && (
              <p
                role="alert"
                className="mt-4 text-sm leading-relaxed text-amber-800"
              >
                {t.content(messages.storageError)}
              </p>
            )}
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-brand-50/40 p-5 sm:p-8">
            {visibleNotes.length > 0 ? (
              <div className="flex flex-wrap items-start gap-5">
                {visibleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    editing={editingId === note.id}
                    messages={messages}
                    onEdit={() => setEditingId(note.id)}
                    onFinish={() => finishEditing(note.id)}
                    onChange={(field, value) =>
                      commit(
                        currentNotes.current.map((item) =>
                          item.id === note.id
                            ? { ...item, [field]: value, updatedAt: Date.now() }
                            : item,
                        ),
                      )
                    }
                    onDelete={() => {
                      if (window.confirm(t.content(messages.confirmDelete))) {
                        commit(
                          currentNotes.current.filter(
                            (item) => item.id !== note.id,
                          ),
                        );
                        if (editingId === note.id) setEditingId(null);
                      }
                    }}
                    onReorder={(targetId) =>
                      commit(
                        reorderNotes(currentNotes.current, note.id, targetId),
                      )
                    }
                    onMove={(direction) => {
                      const index = currentNotes.current.findIndex(
                        (item) => item.id === note.id,
                      );
                      const target = currentNotes.current[index + direction];
                      if (target)
                        commit(
                          reorderNotes(
                            currentNotes.current,
                            note.id,
                            target.id,
                          ),
                        );
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center">
                <p className="text-lg font-semibold">
                  {t.content(notes.length ? messages.noMatches : messages.empty)}
                </p>
                <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-500">
                  {t.content(notes.length ? messages.noMatchesHint : messages.emptyHint)}
                </p>
              </div>
            )}
          </div>
          <footer className="shrink-0 border-t border-brand-100 px-5 py-3 sm:px-8">
            <div className="flex items-start gap-2 text-neutral-500">
              <NotesInfoIcon className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-relaxed">{t.content(messages.device)}</p>
            </div>
          </footer>
        </div>
      </dialog>
    </>
  );
}

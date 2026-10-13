"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NoteDragHandleIcon, NoteTrashIcon } from "@/app/components/svg";
import type { Note } from "../../../../lib/notes/storage";
import type { NotesMessages } from "../../../../lib/notes/messages";
import styles from "./note-card.module.css";

type Props = {
  note: Note;
  editing: boolean;
  messages: NotesMessages;
  onEdit: () => void;
  onFinish: () => void;
  onChange: (field: "title" | "body", value: string) => void;
  onDelete: () => void;
  onReorder: (targetId: string) => void;
  onMove: (direction: number) => void;
};

export default function NoteCard({
  note,
  editing,
  messages,
  onEdit,
  onFinish,
  onChange,
  onDelete,
  onReorder,
  onMove,
}: Props) {
  const card = useRef<HTMLElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLTextAreaElement>(null);
  const pointer = useRef<{ x: number; y: number; dragging: boolean; pointerId: number } | null>(
    null,
  );
  const [frozenWidth, setFrozenWidth] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const suppressClick = useRef(false);
  const dragController = useRef<AbortController | null>(null);
  useEffect(() => () => dragController.current?.abort(), []);

  useLayoutEffect(() => {
    if (editing) title.current?.focus();
  }, [editing]);

  useLayoutEffect(() => {
    if (!editing || !body.current) return;
    body.current.style.height = "auto";
    body.current.style.height = `${Math.min(240, Math.max(80, body.current.scrollHeight))}px`;
  }, [editing, note.body]);

  function startEditing() {
    setFrozenWidth(card.current?.getBoundingClientRect().width ?? 192);
    onEdit();
  }

  function movePointer(event: PointerEvent) {
    const start = pointer.current;
    if (!start || event.pointerId !== start.pointerId) return;
    if (
      !start.dragging &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5
    )
      return;
    start.dragging = true;
    setDragging(true);
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-note-id]");
    if (target?.dataset.noteId && target.dataset.noteId !== note.id)
      onReorder(target.dataset.noteId);
  }

  function finishPointer() {
    suppressClick.current = pointer.current?.dragging ?? false;
    dragController.current?.abort();
    dragController.current = null;
    pointer.current = null;
    setDragging(false);
  }

  return (
    <article
      ref={card}
      data-note-id={note.id}
      tabIndex={editing ? -1 : 0}
      aria-label={note.title || messages.untitled}
      onClick={(event) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        if (!editing && !(event.target as HTMLElement).closest("button"))
          startEditing();
      }}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          startEditing();
        }
      }}
      onBlur={(event) => {
        if (
          editing &&
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        )
          onFinish();
      }}
      style={{
        backgroundColor: note.color,
        width: editing && frozenWidth ? frozenWidth : undefined,
      }}
      className={`flex w-64 min-w-40 max-w-full shrink-0 flex-col rounded-2xl border px-4 pt-4 pb-1 font-sans text-brand-700 transition-shadow ${editing ? "min-h-48 border-brand-500 shadow-lg" : "h-48 cursor-text border-black/10 shadow-sm hover:shadow-md"} ${dragging ? "opacity-50" : ""}`}
    >
      <div
        tabIndex={0}
        aria-label={messages.drag}
        title={messages.drag}
        className="flex shrink-0 touch-none items-center gap-2 cursor-grab active:cursor-grabbing"
        onClick={(event) => {
          event.stopPropagation();
          if (suppressClick.current) { suppressClick.current = false; return; }
          if (!editing && !(event.target as HTMLElement).closest("[data-note-grip]")) startEditing();
        }}
          onPointerDown={(event) => {
            if (event.button !== 0 || (event.target as HTMLElement).closest("input")) return;
            suppressClick.current = false;
            event.preventDefault();
            pointer.current = {
              x: event.clientX,
              y: event.clientY,
              dragging: false,
              pointerId: event.pointerId,
            };
            dragController.current?.abort();
            const controller = new AbortController();
            dragController.current = controller;
            window.addEventListener("pointermove", movePointer, { signal: controller.signal });
            window.addEventListener("pointerup", (up) => {
              if (up.pointerId !== pointer.current?.pointerId) return;
              movePointer(up);
              finishPointer();
            }, { signal: controller.signal });
            window.addEventListener("pointercancel", (cancel) => {
              if (cancel.pointerId === pointer.current?.pointerId) finishPointer();
            }, { signal: controller.signal });
          }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const direction = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : 0;
          if (direction) { event.preventDefault(); event.stopPropagation(); onMove(direction); }
          else if (event.key === "Enter") { event.preventDefault(); startEditing(); }
        }}
      >
        <span data-note-grip aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center text-neutral-400"><NoteDragHandleIcon /></span>
        {editing ? (
          <span className={`${styles.fieldFrame} block min-w-0 flex-1`}>
          <input
            ref={title}
            aria-label={messages.title}
            placeholder={messages.title}
            value={note.title}
            onChange={(event) => onChange("title", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                body.current?.focus();
              }
            }}
            className={`${styles.textField} w-full min-w-0 rounded-md bg-transparent font-sans text-base font-semibold text-neutral-900 outline-none placeholder:text-neutral-500`}
          />
          </span>
        ) : (
          <h3 className="min-w-0 break-words text-base font-semibold text-neutral-900">{note.title || messages.untitled}</h3>
        )}
      </div>
      {editing ? (
        <div className={`${styles.fieldFrame} mt-3 min-w-0`}>
        <textarea
          ref={body}
          aria-label={messages.body}
          placeholder={messages.body}
          value={note.body}
          onChange={(event) => onChange("body", event.target.value)}
          className={`${styles.textField} block font-sans max-h-60 min-h-20 w-full min-w-0 resize-none overflow-y-auto rounded-md bg-transparent text-base leading-normal text-neutral-700 outline-none placeholder:text-neutral-500`}
        />
        </div>
      ) : (
        <p className={`font-sans mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain whitespace-pre-wrap break-words text-base leading-normal text-neutral-700`}>{note.body}</p>
      )}
      <footer className="mt-auto flex shrink-0 items-center justify-between gap-4 pt-2 text-sm text-neutral-400">
        <time dateTime={new Date(note.updatedAt).toISOString()} className="text-neutral-400">
          {new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(note.updatedAt)}
        </time>
        <button
          type="button"
          aria-label={messages.delete}
          title={messages.delete}
          onClick={onDelete}
          className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-red-50 hover:text-red-600"
        >
          <NoteTrashIcon className="size-3.5" />
        </button>
      </footer>
    </article>
  );
}

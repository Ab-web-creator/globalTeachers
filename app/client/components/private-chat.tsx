"use client";

import { useEffect, useLayoutEffect, useRef, type FormEvent } from "react";
import { CallChatIcon, ChatSendIcon } from "@/app/components/svg";
import type { ChatMessage } from "../../../lib/client-area/types";

type Props = {
  messages: ChatMessage[];
  name: string;
  admin: boolean;
  active: boolean;
  fillHeight?: boolean;
  timeZone: string;
  draft: string;
  pending: boolean;
  onDraftChange: (value: string) => void;
  onSend: (event: FormEvent) => void;
  onRead?: () => void;
};

export default function PrivateChat({
  messages,
  name,
  admin,
  active,
  fillHeight = false,
  timeZone,
  draft,
  pending,
  onDraftChange,
  onSend,
  onRead,
}: Props) {
  const readMarker = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ownRole = admin ? "admin" : "client";
  const last = messages.at(-1);
  const lastId = last?.id;
  const lastIsOwn = last?.author === ownRole;
  const previousLastId = useRef(lastId);
  const dateFormat = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  });
  const timeFormat = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });

  useEffect(() => {
    const log = logRef.current;
    if (log && (atBottom.current || lastIsOwn))
      log.scrollTop = log.scrollHeight;
    if (lastIsOwn && lastId !== previousLastId.current)
      inputRef.current?.focus({ preventScroll: true });
    previousLastId.current = lastId;
  }, [lastId, lastIsOwn]);

  useEffect(() => {
    if (!onRead || !readMarker.current) return;
    let visible = false;
    const read = () => {
      if (visible && document.visibilityState === "visible") onRead();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        read();
      },
      { threshold: 1 },
    );
    observer.observe(readMarker.current);
    document.addEventListener("visibilitychange", read);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", read);
    };
  }, [onRead, lastId]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 128)}px`;
  }, [draft]);

  return (
    <section
      data-private-chat
      aria-labelledby="private-chat-title"
      className={`overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm ${fillHeight ? "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" : ""}`}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-brand-100 px-5 py-3 sm:px-6">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-amber-600">
          <CallChatIcon className="size-8" />
        </span>
        <div className="min-w-0">
          <h2
            id="private-chat-title"
            className="truncate text-xl font-semibold"
          >
            {admin ? name : "Личный чат"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Только вы и {admin ? "клиент" : "администратор"}
          </p>
        </div>
      </header>
      <div
        ref={logRef}
        onScroll={(event) => {
          const log = event.currentTarget;
          atBottom.current =
            log.scrollHeight - log.scrollTop - log.clientHeight < 40;
        }}
        role="log"
        aria-label="Личная переписка"
        aria-live="polite"
        aria-relevant="additions text"
        className={`flex h-96 flex-col gap-3 overflow-y-auto overscroll-auto bg-white px-4 py-5 sm:h-112 sm:px-5 ${fillHeight ? "lg:h-0 lg:min-h-112 lg:flex-1" : ""}`}
      >
        {!messages.length && (
          <div className="m-auto max-w-xs text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-brand-400">
              <CallChatIcon className="size-6" />
            </span>
            <p className="mt-4 text-base font-medium">Начните разговор</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              {admin
                ? "Напишите клиенту — сообщения сохранятся на его личной странице."
                : "Задайте вопрос или обсудите предстоящую консультацию. Переписка останется здесь."}
            </p>
          </div>
        )}
        {messages.map((item, index) => {
          const own = item.author === ownRole;
          const date = new Date(item.created_at);
          const day = dateFormat.format(date);
          const previous =
            index > 0
              ? dateFormat.format(new Date(messages[index - 1].created_at))
              : null;
          return (
            <div key={item.id} className="shrink-0">
              {day !== previous && (
                <p className="my-3 text-center text-sm font-medium text-neutral-500">
                  {day}
                </p>
              )}
              <div
                className={`flex flex-col ${own ? "items-end" : "items-start"}`}
              >
                <p
                  className={`max-w-4/5 whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-base leading-relaxed ${own ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md border border-brand-100 bg-white text-brand-950"}`}
                >
                  {item.body}
                </p>
                <p
                  title={`${day}, ${timeFormat.format(date)} (${timeZone})`}
                  className="mt-1 px-2 text-xs text-neutral-400"
                >
                  {own
                    ? "Вы"
                    : item.author === "admin"
                      ? "TeacherNavigator"
                      : name}{" "}
                  ·{" "}
                  <time dateTime={new Date(item.created_at).toISOString()}>
                    {timeFormat.format(date)}
                  </time>
                </p>
              </div>
            </div>
          );
        })}
        <div ref={readMarker} aria-hidden="true" className="h-px shrink-0" />
      </div>
      <div className="shrink-0 border-t border-brand-100 bg-white px-4 py-4 sm:px-5">
        <form
          data-chat-composer
          onSubmit={onSend}
          className="flex items-end gap-2 rounded-3xl border border-brand-200 bg-brand-50/50 p-1 focus-within:border-brand-500"
        >
          <textarea
            ref={inputRef}
            aria-label="Сообщение"
            placeholder="Написать сообщение…"
            rows={1}
            maxLength={5000}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                if (!pending && active && draft.trim())
                  event.currentTarget.form?.requestSubmit();
              }
            }}
            readOnly={pending}
            disabled={!active}
            style={{ outline: "none" }}
            className="min-h-9 min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl bg-transparent px-3 py-1.5 text-base leading-normal text-brand-950 outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            aria-label={
              pending ? "Отправляем сообщение" : "Отправить сообщение"
            }
            disabled={pending || !active || !draft.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-slate-900 transition-colors hover:bg-yellow-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            <ChatSendIcon className="size-5" />
          </button>
        </form>
        <p className="mt-2 hidden px-2 text-xs text-neutral-400 sm:block">
          Enter — отправить · Shift+Enter — новая строка
        </p>
      </div>
    </section>
  );
}

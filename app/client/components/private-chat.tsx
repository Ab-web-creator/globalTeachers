"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { CallChatIcon, ChatSendIcon, PrivateChatIcon, TwoHeartsIcon } from "@/app/components/svg";
import type { ChatMessage } from "../../../lib/client-area/types";
import ChatMessageActions from "./chat-message-actions";
import ClearChatDialog from "./clear-chat-dialog";

type Props = {
  messages: ChatMessage[];
  name: string;
  admin: boolean;
  active: boolean;
  fillHeight?: boolean;
  viewportHeight?: boolean;
  timeZone: string;
  draft: string;
  pending: boolean;
  onDraftChange: (value: string) => void;
  onSend: (event: FormEvent) => void;
  onRead?: () => void;
  onEditMessage?: (id: string, body: string) => Promise<void>;
  onDeleteMessage?: (id: string) => Promise<void>;
  onClearMessages?: (scope: "admin" | "client" | "both") => Promise<void>;
};

export default function PrivateChat({
  messages,
  name,
  admin,
  active,
  fillHeight = false,
  viewportHeight = false,
  timeZone,
  draft,
  pending,
  onDraftChange,
  onSend,
  onRead,
  onEditMessage,
  onDeleteMessage,
  onClearMessages,
}: Props) {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!viewportHeight) return;
    const section = sectionRef.current;
    if (!section) return;
    const siteHeader = document.querySelector<HTMLElement>("header.sticky");
    const viewport = window.visualViewport;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = viewport?.height ?? window.innerHeight;
        const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
        section.style.setProperty("--chat-mobile-height", `${Math.max(0, height - headerHeight)}px`);
      });
    };
    const observer = new ResizeObserver(measure);
    if (siteHeader) observer.observe(siteHeader);
    window.addEventListener("resize", measure);
    viewport?.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      viewport?.removeEventListener("resize", measure);
    };
  }, [viewportHeight]);
  const readMarker = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const heartAnimations = useRef<Animation[]>([]);
  const seenMessages = useRef(new Set(messages.map((message) => message.id)));
  const sentCount = useRef(0);
  const conversation = useRef(name);
  const ownRole = admin ? "admin" : "client";
  const last = messages.at(-1);
  const lastId = last?.id;
  const lastIsOwn = last?.author === ownRole;
  const previousLastId = useRef(lastId);
  useEffect(() => {
    if (conversation.current !== name) {
      conversation.current = name;
      seenMessages.current = new Set(messages.map((message) => message.id));
      sentCount.current = 0;
      return;
    }
    let celebrate = false;
    for (const message of messages) {
      if (seenMessages.current.has(message.id)) continue;
      seenMessages.current.add(message.id);
      if (admin && message.author === "admin") {
        sentCount.current += 1;
        if (sentCount.current % 3 === 0) celebrate = true;
      }
    }
    if (!celebrate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    heartAnimations.current.forEach((animation) => animation.cancel());
    heartAnimations.current = Array.from(heartsRef.current?.children ?? []).map((heart, index) => {
      const drift = ((index % 7) - 3) * 38;
      return heart.animate([
        { opacity: 0, transform: "translate(0, 0) scale(0.3) rotate(0deg)" },
        { opacity: 1, offset: 0.15 },
        { opacity: 0, transform: `translate(${drift}px, -${280 + (index % 5) * 40}px) scale(1.1) rotate(${drift}deg)` },
      ], { duration: 1800 + (index % 4) * 150, delay: (index % 6) * 60, easing: "cubic-bezier(0.2, 0.6, 0.35, 1)" });
    });
  }, [messages, admin, name]);
  useEffect(() => () => heartAnimations.current.forEach((animation) => animation.cancel()), []);
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
      ref={sectionRef}
      data-private-chat
      aria-labelledby="private-chat-title"
      className={`relative overflow-hidden border-brand-100 bg-white ${admin ? "-mx-5 border-t sm:mx-0 sm:rounded-3xl sm:border sm:shadow-sm" : "rounded-xl border shadow-sm"} ${viewportHeight ? "flex h-[var(--chat-mobile-height,calc(100dvh-4rem))] min-h-0 flex-col sm:h-[min(42rem,80dvh)] sm:min-h-96 lg:h-[calc(100dvh-7rem)]" : fillHeight ? "lg:flex lg:max-h-[calc(100dvh-7rem)] lg:min-h-0 lg:flex-1 lg:flex-col" : ""}`}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-brand-100 px-5 py-3 sm:px-6">
        <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-50 ${admin ? "size-12 text-brand-500" : "size-14 text-amber-600"}`}>
          <PrivateChatIcon className="size-8" />
        </span>
        <div className="min-w-0">
          <h2
            id="private-chat-title"
            className={`break-words font-semibold ${admin ? "text-base" : "text-base sm:text-lg"}`}
          >
            {admin ? "Поговорим от души" : "Давайте поболтаем"}
          </h2>
          <p className={`${admin ? "mt-0" : "mt-1"} text-sm text-neutral-500`}>
            {admin ? <>тут только вы и ваш клиент<span className="hidden sm:inline">: разговор приватный</span></> : <>О планах, сомнениях<span className="hidden sm:inline"> и всём, что хочется обсудить</span>.</>}
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
        className={`flex flex-col gap-3 overflow-y-auto overscroll-auto bg-white px-4 py-5 sm:px-5 ${viewportHeight ? "min-h-0 flex-1" : `h-96 sm:h-112 ${fillHeight ? "lg:h-0 lg:min-h-64 lg:flex-1" : ""}`}`}
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
                data-chat-message
                className={`flex flex-col ${own ? "items-end" : "items-start"}`}
              >
                <p
                  data-message-bubble
                  className={`relative max-w-4/5 after:absolute after:bottom-0 after:h-2 after:w-2 after:content-[''] whitespace-pre-wrap break-words rounded-xl px-4 py-2.5 text-base leading-relaxed ${own ? "rounded-br-none bg-brand-500 text-white after:-right-1.5 after:bg-brand-500 after:[clip-path:polygon(0_0,0_100%,100%_100%)]" : item.author === "admin" ? "rounded-bl-none bg-brand-50 text-brand-950 after:-left-1.5 after:bg-brand-50 after:[clip-path:polygon(100%_0,0_100%,100%_100%)]" : "rounded-bl-none bg-brand-50 text-brand-950 after:-left-1.5 after:bg-brand-50 after:[clip-path:polygon(100%_0,0_100%,100%_100%)]"}`}
                >
                  {item.body}
                </p>
                {admin && item.client_deleted_at && <span className="mt-1 text-xs font-medium text-red-600">Клиент удалил это сообщение · исходный текст сохранён</span>}
                {admin && Boolean(item.client_edit_history?.length) && (
                  <details className="mt-2 max-w-4/5 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                    <summary className="cursor-pointer font-medium">Клиент изменил сообщение · история ({item.client_edit_history!.length})</summary>
                    <ol className="mt-2 space-y-2">{item.client_edit_history!.map((entry, revision) => <li key={revision} className="whitespace-pre-wrap break-words"><span className="font-medium">Версия {revision + 1} · {timeFormat.format(new Date(entry.changed_at))}</span><p className="mt-1">{entry.body}</p></li>)}</ol>
                  </details>
                )}
                {admin && item.hidden_from_client && !item.client_deleted_at && <span className="mt-1 text-xs text-amber-700">Удалено у клиента · видно только вам</span>}
                <div className="mt-1 flex max-w-full flex-wrap items-center justify-end gap-0.5 has-[form]:flex-col has-[form]:items-end">
                  <p title={`${day}, ${timeFormat.format(date)} (${timeZone})`} className="pr-1 text-xs text-neutral-400">
                    {!(admin && own) && <>{own ? "Вы" : item.author === "admin" ? "TeacherNavigator" : name} · </>}
                    <time dateTime={new Date(item.created_at).toISOString()}>{timeFormat.format(date)}</time>
                  </p>
                  {own && (admin || active) && onEditMessage && onDeleteMessage && (
                    <ChatMessageActions admin={admin} body={item.body} onEdit={body => onEditMessage(item.id, body)} onDelete={() => onDeleteMessage(item.id)} />
                  )}
                </div>
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
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            <ChatSendIcon className="size-5" />
          </button>
        </form>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2">
        <p className="hidden text-xs text-neutral-400 sm:block">
          Enter — отправить · Shift+Enter — новая строка
        </p>
        {admin && onClearMessages && <button type="button" onClick={() => setClearDialogOpen(true)} disabled={pending || !messages.length} className="ml-auto rounded text-xs text-red-600 underline-offset-4 hover:underline focus-visible:-outline-offset-2 disabled:opacity-40">Удалить все</button>}
        </div>

      </div>
      {admin && clearDialogOpen && onClearMessages && <ClearChatDialog onConfirm={onClearMessages} onClose={() => setClearDialogOpen(false)} />}
      {admin && (
        <div ref={heartsRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 bottom-20 z-10 overflow-hidden motion-reduce:hidden">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} className={`absolute bottom-0 opacity-0 ${index % 3 === 0 ? "text-red-500" : index % 3 === 1 ? "text-amber-400" : "text-purple-500"}`} style={{ left: `${25 + (index % 9) * 6}%` }}>
              <TwoHeartsIcon solid className={index % 2 === 0 ? "size-7" : "size-5"} />
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

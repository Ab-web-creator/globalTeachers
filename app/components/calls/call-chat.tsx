import { useEffect, useRef, useState } from "react";
import { CallWindowCloseIcon, CallChatIcon, ChatSendIcon } from "@/app/components/svg";
import type { CallRoomModel } from "./use-call-session";

type CallChatProps = Pick<CallRoomModel,
  | "sendChatMessage"
  | "token"
  | "name"
  | "chatOpen"
  | "immersive"
  | "messages"
  | "showChat"
  | "chatReady"
>;

export default function CallChat({
  sendChatMessage,
  token,
  name,
  chatOpen,
  immersive,
  messages,
  showChat,
  chatReady,
}: CallChatProps) {
  const [chatDraft, setChatDraft] = useState("");
  const chatLog = useRef<HTMLDivElement>(null);
  const chatAtBottomRef = useRef(true);
  useEffect(() => {
    if (chatOpen) chatAtBottomRef.current = true;
  }, [chatOpen]);
  useEffect(() => {
    const log = chatLog.current;
    // Follow new messages unless the reader scrolled up; always follow their own message.
    if (log && (chatAtBottomRef.current || messages.at(-1)?.own)) {
      log.scrollTop = log.scrollHeight;
    }
  }, [messages, chatOpen]);
  return (
    <>
      {immersive && chatOpen && (
        <aside id="call-chat" aria-label="Чат звонка" className="absolute inset-y-0 right-0 z-40 flex w-full flex-col border-l border-slate-700 bg-[#121826] p-4 text-white sm:w-96">
          <div className="flex items-center justify-between"><button type="button" aria-expanded={chatOpen} aria-controls="call-chat" onClick={() => showChat(false)} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"><CallChatIcon className="size-4" />Chat tab</button><button type="button" onClick={() => showChat(false)} aria-label="Закрыть чат"><CallWindowCloseIcon className="size-5" /></button></div>
          <div ref={chatLog} onScroll={(event) => { const log = event.currentTarget; chatAtBottomRef.current = log.scrollHeight - log.scrollTop - log.clientHeight < 40; }} role="log" aria-live="polite" className="my-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
            {messages.length === 0 && <p className="text-sm text-slate-400">Сообщения доступны во время звонка.</p>}
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${message.own ? "items-end" : "items-start"}`}>
                <p className={`max-w-4/5 rounded-3xl px-4 py-2 text-base wrap-break-word ${message.own ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md bg-slate-100 text-slate-900"}`}>{message.text}</p>
                <span className="mt-1 px-2 text-sm text-slate-400">{message.own ? "Вы" : token ? "Консультант" : name}</span>
              </div>
            ))}
          </div>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (sendChatMessage(chatDraft)) setChatDraft("");
          }} className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 p-1.5">
            <input aria-label="Сообщение" placeholder="Сообщение…" maxLength={2000} value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 pl-4 text-base text-white outline-none! placeholder:text-slate-500" />
            <button type="submit" aria-label="Отправить сообщение" disabled={!chatReady || !chatDraft.trim()} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-slate-900 transition hover:bg-yellow-300 disabled:bg-yellow-400/25 disabled:text-slate-500"><ChatSendIcon className="size-5" /></button>
          </form>
        </aside>
      )}
    </>
  );
}

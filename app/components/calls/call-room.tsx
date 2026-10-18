"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CallWindowCloseIcon, CallWindowMinimizeIcon, CallWindowFullscreenIcon, CallChatIcon } from "@/app/components/svg";
import useMinimizedCallDrag from "./use-minimized-call-drag";
import CallChat from "./call-chat";
import CallControls from "./call-controls";
import CallVideoStage from "./call-video-stage";
import useCallSession, { type CallRoomProps } from "./use-call-session";

export default function CallRoom(props: CallRoomProps) {
  const t = useTranslations();
  const room = useCallSession(props);
  const {
    token,
    name,
    minimized,
    onRestore,
    focusedVideo,
    chatOpen,
    fullscreen,
    localRatio,
    remoteRatio,
    state,
    error,
    immersive,
    callActive,
    expiresLabel,
    statusText,
    infoOnVideo,
    showChat,
    setError,
    action,
    onMinimize,
    onDismiss,
    callFrameRef,
    unread,
    fullscreenSupported,
    relay,
    cleanup,
  } = room;
  const { style: minimizedStyle, dragHandlers } = useMinimizedCallDrag(minimized);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [host] = useState(() => typeof document === "undefined" ? null : document.createElement("div"));
  useLayoutEffect(() => {
    if (!host) return;
    const target = immersive || minimized ? document.body : anchorRef.current;
    target?.appendChild(host);
    return () => { host.remove(); };
  }, [host, immersive, minimized]);
  return (
    <>
      <div ref={anchorRef} />
      {host && createPortal(
    <section ref={callFrameRef} {...dragHandlers}
      style={minimized ? minimizedStyle : immersive ? undefined : { "--call-max-width": `min(${state === "accepted" ? "64rem" : "42rem"}, calc(max(12rem, 100dvh - ${token ? "24rem" : "30rem"}) * ${state === "accepted" && focusedVideo === "remote" ? remoteRatio : localRatio} + 3rem + 2px))` } as CSSProperties}
      className={minimized ? "fixed right-4 bottom-4 z-50 touch-none select-none cursor-grab active:cursor-grabbing w-52 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-800 bg-[#121826] p-2 shadow-2xl" : immersive ? "fixed inset-0 z-60 flex h-dvh w-full flex-col gap-3 overflow-hidden bg-[#121826] p-3 sm:p-4" : "mx-auto w-full bg-white px-4 py-6 sm:max-w-(--call-max-width) sm:rounded-3xl sm:border sm:border-brand-100 sm:p-6 sm:shadow-sm"}
    >
      <div className={minimized || immersive ? "hidden" : ""}>
      {!infoOnVideo && <h1 className="text-2xl font-semibold sm:text-3xl">{t("call.token.page.message0001")}</h1>}
      {!infoOnVideo && (
        <>
          <p className="mt-3 text-lg">{t.content(token ? `Вы: ${name}` : name)}</p>
          <p suppressHydrationWarning className="mt-2 text-sm text-neutral-500">
            {t("components.calls.callRoom.message0228")}{" "}{t.content(expiresLabel)}
          </p>
          <p className="mt-4" role="status">{t.content(statusText)}</p>
        </>
      )}
      {t.content(error && (
        <p className="mt-3 text-red-700" role="alert">
          {t.content(error)}
        </p>
      ))}
      {!token && !relay && (
        <p className="mt-3 text-sm text-neutral-500">
          {t("components.calls.callRoom.message0229")}</p>
      )}
      </div>
      {immersive && (
        <header className={`-mx-3 flex shrink-0 items-center justify-between border-b border-slate-700 bg-[#121826] px-3 pb-3 sm:-mx-4 sm:px-4 ${chatOpen ? "sm:mr-92" : ""}`}>
        <div className="flex gap-2">
          <button type="button" aria-label={t("components.calls.callControls.message0226")} title={t("components.calls.callControls.message0226")} onClick={() => { if (callActive) void action("end"); else { cleanup(); onDismiss?.(); } }} className="flex pointer-coarse:max-lg:hidden size-6 items-center justify-center rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-red-500 text-white hover:bg-red-600"><CallWindowCloseIcon className="size-4" /></button>
          <button type="button" aria-label={t.content(minimized ? "Вернуться к звонку" : "Свернуть звонок")} title={t.content(minimized ? "Вернуться к звонку" : "Свернуть звонок")} onClick={async () => { if (document.fullscreenElement) await document.exitFullscreen(); if (minimized) onRestore?.(); else onMinimize?.(); }} className="group flex size-6 items-center justify-center gap-2 rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-yellow-400 text-neutral-900 hover:bg-yellow-500 pointer-coarse:max-lg:size-auto pointer-coarse:max-lg:rounded-xl pointer-coarse:max-lg:bg-slate-700 pointer-coarse:max-lg:px-3 pointer-coarse:max-lg:py-2 pointer-coarse:max-lg:text-sm pointer-coarse:max-lg:text-white pointer-coarse:max-lg:hover:scale-100 pointer-coarse:max-lg:hover:bg-slate-600"><CallWindowMinimizeIcon className="size-4 opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:max-lg:opacity-100" /><span className="hidden pointer-coarse:max-lg:inline">{t("components.calls.callRoom.message0232")}</span></button>
          {fullscreenSupported && <button type="button" aria-label={t.content(fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим")} title={t.content(fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим")} onClick={() => { void (document.fullscreenElement ? document.exitFullscreen() : callFrameRef.current?.requestFullscreen())?.catch(() => setError("Полноэкранный режим недоступен в этом браузере.")); }} className="flex size-6 items-center justify-center rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-green-500 text-white hover:bg-green-600"><CallWindowFullscreenIcon expanded={fullscreen} className="size-4" /></button>}
        </div>

          {!chatOpen && <button type="button" aria-expanded={chatOpen} aria-controls="call-chat" onClick={() => showChat(true)} aria-label={t.content(unread ? `Chat tab, непрочитанных сообщений: ${unread}` : undefined)} className="relative inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600">
            <CallChatIcon className="size-4" />Chat tab
            {unread > 0 && <span aria-hidden="true" className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold ring-2 ring-[#121826]">{t.content(unread > 99 ? "99+" : unread)}</span>}
          </button>}
        </header>
      )}
      {t.content(immersive && error && <p role="alert" className="absolute top-3 right-3 z-50 max-w-xs rounded-lg bg-red-950/90 p-2 text-sm text-white">{t.content(error)}</p>)}
      <CallVideoStage {...room} />
      <CallChat {...room} />
      <CallControls {...room} />
    </section>,
        host,
      )}
    </>
  );
}

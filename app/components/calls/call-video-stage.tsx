import { useEffect, useRef, useState, type CSSProperties } from "react";
import useVideoInset from "./use-video-inset";
import { CameraIcon, MicrophoneIcon, PhoneCallIcon, VideoExpandIcon } from "@/app/components/svg";
import type { CallRoomModel } from "./use-call-session";

type CallVideoStageProps = Pick<CallRoomModel,
  | "token"
  | "name"
  | "minimized"
  | "onRestore"
  | "focusedVideo"
  | "setFocusedVideo"
  | "chatOpen"
  | "localRatio"
  | "setLocalRatio"
  | "remoteRatio"
  | "setRemoteRatio"
  | "state"
  | "expired"
  | "error"
  | "connected"
  | "muted"
  | "waitingForConsultant"
  | "soundBlocked"
  | "enableSound"
  | "mediaReady"
  | "checking"
  | "deviceError"
  | "remoteAudioBlocked"
  | "setRemoteAudioBlocked"
  | "remoteMuted"
  | "micLevels"
  | "local"
  | "remote"
  | "playRemote"
  | "checkDevices"
  | "immersive"
  | "toggleCamera"
  | "callActive"
  | "expiresLabel"
  | "statusText"
  | "micCheck"
  | "previewOff"
  | "cameraOff"
  | "infoOnVideo"
  | "button"
>;

export default function CallVideoStage({
  token,
  name,
  minimized,
  onRestore,
  focusedVideo,
  setFocusedVideo,
  chatOpen,
  localRatio,
  setLocalRatio,
  remoteRatio,
  setRemoteRatio,
  state,
  expired,
  error,
  connected,
  muted,
  waitingForConsultant,
  soundBlocked,
  enableSound,
  mediaReady,
  checking,
  deviceError,
  remoteAudioBlocked,
  setRemoteAudioBlocked,
  remoteMuted,
  micLevels,
  local,
  remote,
  playRemote,
  checkDevices,
  immersive,
  toggleCamera,
  callActive,
  expiresLabel,
  statusText,
  micCheck,
  previewOff,
  cameraOff,
  infoOnVideo,
  button,
}: CallVideoStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { dragRef, suppressInsetClickRef, startInsetDrag, moveInset, insetStyle } = useVideoInset(stageRef);
  const [stageRatio, setStageRatio] = useState(16 / 9);
  useEffect(() => {
    const stage = stageRef.current;
    if (!immersive || !stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setStageRatio(width / height);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [immersive]);
  // Crop to fill only when video and stage share an orientation; a portrait phone
  // video on a landscape screen (or the reverse) is shown whole with dark bars.
  const videoFit = (ratio: number) => (ratio >= 1) === (stageRatio >= 1) ? "object-cover" : "object-contain";
  // Bottom-left corner of the visible picture, which object-contain centres between bars.
  const pictureCorner = (ratio: number, focused: boolean): CSSProperties => {
    const letterboxed = focused && videoFit(ratio) === "object-contain";
    const sideBars = letterboxed && ratio < stageRatio ? (1 - ratio / stageRatio) * 50 : 0;
    const topBars = letterboxed && ratio > stageRatio ? (1 - stageRatio / ratio) * 50 : 0;
    return { left: `calc(${sideBars}% + 0.75rem)`, bottom: `calc(${topBars}% + 0.75rem)` };
  };
  return (
    <>
      <div className={immersive ? `relative flex min-h-0 flex-1 gap-3 ${chatOpen ? "sm:mr-96" : ""}` : "contents"}>
      <div className={immersive ? "flex min-h-0 min-w-0 flex-1 items-center justify-center" : "contents"}>
      <div ref={stageRef} style={state === "accepted" && !immersive ? { aspectRatio: focusedVideo === "local" ? localRatio : remoteRatio } : undefined} className={`relative ${immersive ? "h-full w-full" : ""} fullscreen:mt-0 fullscreen:h-full fullscreen:w-full fullscreen:aspect-auto ${state === "accepted" ? `${minimized || immersive ? "" : "mt-4"} overflow-hidden rounded-2xl ${immersive ? "bg-[#121826]" : "bg-neutral-950"}` : `${infoOnVideo && !error ? "" : "mt-6"} grid w-full grid-cols-1 gap-4`} ${!token && !mediaReady && state !== "accepted" ? "hidden" : ""}`}>
        {callActive && minimized && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between p-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"><span className="size-1.5 rounded-full bg-white" />LIVE</span>
            <button type="button" aria-label="Вернуться к звонку" title="Вернуться к звонку" onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); onRestore?.(); }} className="pointer-events-auto flex size-8 items-center justify-center rounded-lg bg-neutral-950/70 text-white transition duration-200 hover:scale-105 hover:bg-neutral-950 motion-reduce:transform-none motion-reduce:transition-none"><VideoExpandIcon className="size-4" /></button>
          </div>
        )}
        <div style={state === "accepted" && focusedVideo === "local" ? insetStyle : undefined} className={state !== "accepted" ? "hidden" : focusedVideo === "local" ? "absolute z-20 w-1/4 max-w-40 rounded-xl border-2 border-white/70 shadow-lg" : focusedVideo === "remote" ? "absolute inset-0" : "min-w-0"}>
          <div className={`relative overflow-hidden rounded-xl ${immersive && focusedVideo === "remote" ? "h-full" : ""}`}>
          {state === "accepted" && focusedVideo === "local" && (
            <button type="button" onPointerDown={startInsetDrag} onPointerMove={moveInset} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; suppressInsetClickRef.current = true; }} onClick={(event) => { if (event.detail === 0 || !suppressInsetClickRef.current) setFocusedVideo("remote"); suppressInsetClickRef.current = false; }} aria-label="Показать видео собеседника крупно" className="absolute inset-0 z-30 touch-none cursor-grab rounded-xl active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
          )}
          {remoteMuted && !(state === "accepted" && focusedVideo === "local") && (
            <span role="img" aria-label="Микрофон собеседника выключен" style={pictureCorner(remoteRatio, immersive && focusedVideo === "remote")} className="pointer-events-none absolute z-10 flex size-8 items-center justify-center rounded-full bg-neutral-950/60 text-white"><MicrophoneIcon off className="size-4" /></span>
          )}
          <video ref={remote} disablePictureInPicture disableRemotePlayback onResize={(event) => { const video = event.currentTarget; if (video.videoWidth && video.videoHeight) setRemoteRatio(video.videoWidth / video.videoHeight); }} autoPlay playsInline onClick={() => void playRemote()} onPlaying={() => setRemoteAudioBlocked(false)} style={immersive && focusedVideo === "remote" ? undefined : { aspectRatio: remoteRatio }} className={`block w-full rounded-xl ${immersive && focusedVideo === "remote" ? `h-full ${videoFit(remoteRatio)}` : "h-auto bg-neutral-900"}`} />
          </div>
          {remoteAudioBlocked && (
            <button type="button" className={`${button} mt-3`} onClick={() => void playRemote()}>
              Включить звук
            </button>
          )}
          {!connected && <p className="mt-2 text-sm text-neutral-600">Подключаем видео собеседника…</p>}
        </div>
        <div style={state === "accepted" && focusedVideo === "remote" ? insetStyle : undefined} className={state === "accepted" ? focusedVideo === "remote" ? "absolute z-20 w-1/4 max-w-40 rounded-xl border-2 border-white/70 shadow-lg" : focusedVideo === "local" ? "absolute inset-0" : "min-w-0" : "w-full"}>
          <div className={`relative overflow-hidden rounded-xl ${immersive && focusedVideo === "local" ? "h-full" : ""} ${previewOff ? "bg-yellow-900" : ""}`}>
          {state === "accepted" && focusedVideo === "remote" && (
            <button type="button" onPointerDown={startInsetDrag} onPointerMove={moveInset} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; suppressInsetClickRef.current = true; }} onClick={(event) => { if (event.detail === 0 || !suppressInsetClickRef.current) setFocusedVideo("local"); suppressInsetClickRef.current = false; }} aria-label="Показать свою камеру крупно" className="absolute inset-0 z-30 touch-none cursor-grab rounded-xl active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
          )}
          {cameraOff && state === "accepted" && focusedVideo === "remote" && (
            <span role="img" aria-label="Ваша камера выключена" className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/70"><CameraIcon off className="size-6" /></span>
          )}
          {(infoOnVideo || micCheck || (cameraOff && !(state === "accepted" && focusedVideo === "remote"))) && (
            // Details on top, microphone check at the bottom, camera notice centred in the space between.
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col text-white">
              {infoOnVideo && (
                <div className="m-3 w-fit rounded-2xl bg-neutral-950/55 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur-md sm:m-4 sm:px-5 sm:py-4">
                  <h1 className="text-lg font-semibold leading-snug sm:text-xl">Видеоконсультация</h1>
                  <p className="mt-2 text-base leading-snug"><span className="text-white/60">Вы:</span> <span className="font-medium">{name}</span></p>
                  <p className="mt-1 text-sm text-white/70">Приглашение действует до {expiresLabel}</p>
                  {!waitingForConsultant && (
                    <p role="status" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                      <span className={`size-2 shrink-0 rounded-full ${state === "waiting" ? "bg-brand-400" : "bg-white/50"}`} />
                      {statusText}
                    </p>
                  )}
                </div>
              )}
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden p-4 text-center">
                {cameraOff && !(state === "accepted" && focusedVideo === "remote") && (
                  <>
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"><CameraIcon off className="size-7" /></span>
                    <p role="status" className="text-base font-medium">Камера выключена</p>
                    <button type="button" onClick={toggleCamera} className="pointer-events-auto rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/25">Включить камеру</button>
                  </>
                )}
              </div>
              {micCheck && (
                <div className="rounded-b-xl bg-neutral-950/65 px-4 py-3 backdrop-blur-md">
                  <p id="microphone-level-label" className="text-sm text-white/80">{muted ? "Микрофон выключен" : "Говорите — индикатор должен двигаться"}</p>
                  <div id="microphone-level" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={muted ? 0 : micLevels[0]} aria-labelledby="microphone-level-label" className="mt-2 flex h-6 items-center gap-1">
                    {micLevels.map((level, index) => (
                      <span key={index} style={{ height: `${muted ? 12 : Math.max(12, level)}%` }} className={`min-w-0 flex-1 rounded-full transition-[height] duration-100 ease-out motion-reduce:transition-none ${muted ? "bg-white/30" : "bg-brand-300"}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {muted && mediaReady && !micCheck && !(state === "accepted" && focusedVideo === "remote") && (
            <span role="img" aria-label="Ваш микрофон выключен" style={pictureCorner(localRatio, immersive && focusedVideo === "local")} className="pointer-events-none absolute z-10 flex size-8 items-center justify-center rounded-full bg-neutral-950/60 text-white"><MicrophoneIcon off className="size-4" /></span>
          )}
          <video ref={local} disablePictureInPicture disableRemotePlayback onResize={(event) => { const video = event.currentTarget; if (video.videoWidth && video.videoHeight) setLocalRatio(video.videoWidth / video.videoHeight); }} autoPlay playsInline muted style={immersive && focusedVideo === "local" ? undefined : { aspectRatio: localRatio }} className={`block w-full rounded-xl ${immersive && focusedVideo === "local" ? `h-full ${videoFit(localRatio)}` : `h-auto max-sm:max-h-[calc(100dvh-7rem)] max-sm:object-cover ${previewOff ? "" : "bg-neutral-900"}`} ${!mediaReady ? "hidden" : ""} ${previewOff ? "invisible" : ""}`} />
          {!mediaReady && (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-brand-50 p-5 text-center text-sm text-neutral-600" role="status">
              <p>{expired || state === "revoked" ? "Приглашение недоступно" : deviceError ? "Камера и микрофон недоступны" : "Подключаем камеру… Разрешите доступ в браузере."}</p>
              {deviceError && !expired && state !== "revoked" && <button type="button" disabled={checking} className={`${button} disabled:opacity-50`} onClick={() => void checkDevices()}>Попробовать снова</button>}
            </div>
          )}
          {waitingForConsultant && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/50 p-4 text-center text-white">
              <PhoneCallIcon className="size-8 motion-safe:animate-pulse" />
              <p role="status" className="text-lg font-medium">Ожидаем ответа консультанта</p>
              {soundBlocked && <button type="button" onClick={enableSound} className="rounded-lg bg-white/20 px-3 py-2 text-sm hover:bg-white/30">Включить звук звонка</button>}
            </div>
          )}
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

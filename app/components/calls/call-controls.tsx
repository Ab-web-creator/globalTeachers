"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { CameraIcon, MicrophoneIcon, PhoneCallIcon, ScreenShareIcon } from "@/app/components/svg";
import type { CallRoomModel } from "./use-call-session";

type CallControlsProps = Pick<CallRoomModel,
  | "toggleMicrophone"
  | "token"
  | "incomingCall"
  | "minimized"
  | "chatOpen"
  | "state"
  | "expired"
  | "muted"
  | "camera"
  | "mediaReady"
  | "checking"
  | "immersive"
  | "toggleCamera"
  | "callActive"
  | "button"
  | "sharingScreen"
  | "changingScreen"
  | "toggleScreenShare"
  | "action"
>;

export default function CallControls({
  toggleMicrophone,
  token,
  incomingCall,
  minimized,
  chatOpen,
  state,
  expired,
  muted,
  camera,
  mediaReady,
  checking,
  immersive,
  toggleCamera,
  callActive,
  button,
  sharingScreen,
  changingScreen,
  toggleScreenShare,
  action,
}: CallControlsProps) {
  const t = useTranslations();
  // Call controls are touch-sized, except in the compact minimized window.
  const controlSize = minimized ? "px-3 py-2 text-sm" : "px-4 py-3 text-base";
  const controlIcon = `${minimized ? "size-4" : "size-5"} shrink-0`;
  return (
    <>
      <div className={immersive ? `flex shrink-0 flex-wrap items-center gap-3 ${chatOpen ? "sm:mr-96" : ""}` : `${minimized ? "mt-3 gap-2" : "mt-5 gap-3"} flex flex-wrap ${state === "accepted" ? "" : "w-full"}`}>
        {t.content(token && !incomingCall && !expired && state !== "revoked" && (
          <button
            type="button"
            aria-label={t.content(callActive ? "Завершить" : "Позвонить")}
            disabled={!callActive && (!mediaReady || checking)}
            className={`order-last ml-auto inline-flex w-fit items-center justify-center gap-2 rounded-xl ${controlSize} text-white disabled:opacity-50 ${callActive ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`}
            onClick={() => void action(callActive ? "end" : "ring")}
          >
            <PhoneCallIcon className={controlIcon} />
            <span className={minimized ? "hidden" : ""}>{t.content(callActive ? "Завершить" : "Позвонить")}</span>
          </button>
        ))}
        {incomingCall && (
          <>
            <button className={button} onClick={() => void action("accept")}>
              {t("client.appointmentCall.message0019")}</button>
            <button className={button} onClick={() => void action("decline")}>
              {t("client.appointmentCall.message0020")}</button>
          </>
        )}
        {mediaReady && (
          <>
            <button
              aria-label={t.content(`Микрофон: ${muted ? "выключен" : "включён"}`)}
              aria-pressed={!muted}
              className={`inline-flex items-center gap-2 rounded-xl ${controlSize} text-white ${muted ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`}
              onClick={toggleMicrophone}
            >
              <MicrophoneIcon off={muted} className={controlIcon} />
              <span className={minimized ? "hidden" : "hidden sm:inline"}>{t("components.calls.callControls.message0218")}</span>
            </button>
            <button
              aria-label={t.content(`Камера: ${camera ? "включена" : "выключена"}`)}
              aria-pressed={camera}
              className={`inline-flex items-center gap-2 rounded-xl ${controlSize} text-white ${camera ? "bg-brand-500 hover:bg-brand-600" : "bg-red-600 hover:bg-red-700"}`}
              onClick={toggleCamera}
            >
              <CameraIcon off={!camera} className={controlIcon} />
              <span className={minimized ? "hidden" : "hidden sm:inline"}>{t("components.calls.callControls.message0222")}</span>
            </button>
            {state === "accepted" && (
              <button type="button" disabled={changingScreen} aria-pressed={sharingScreen} onClick={() => void toggleScreenShare()} className={`hidden items-center gap-2 rounded-xl ${controlSize} text-white disabled:opacity-50 lg:inline-flex ${sharingScreen ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`} aria-label={t.content(sharingScreen ? "Остановить демонстрацию экрана" : "Поделиться экраном")}>
                <ScreenShareIcon className={controlIcon} />
                <span className={minimized ? "hidden" : ""}>{t.content(sharingScreen ? "Остановить показ" : "Поделиться экраном")}</span>
              </button>
            )}
          </>
        )}
        {!token && !incomingCall && callActive && (
          <button aria-label={t("components.calls.callControls.message0226")}
            className={`order-last ml-auto inline-flex w-fit items-center gap-2 rounded-xl bg-red-600 ${controlSize} text-white hover:bg-red-700`}
            onClick={() => void action("end")}
          >
            <PhoneCallIcon className={controlIcon} />
            <span className={minimized ? "hidden" : ""}>{t("components.calls.callControls.message0214")}</span>
          </button>
        )}
      </div>
    </>
  );
}

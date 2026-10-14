"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon, MicrophoneIcon, PhoneCallIcon, CallWindowCloseIcon, CallWindowMinimizeIcon, CallWindowFullscreenIcon, VideoExpandIcon, CallChatIcon, ScreenShareIcon, ChatSendIcon } from "@/app/components/svg";
import useCallRingtone from "./use-call-ringtone";
type Signal = {
  type: "offer" | "answer" | "candidate";
  sdp?: string;
  candidate?: RTCIceCandidateInit;
};
const micBarCount = 32;

export default function CallRoom({
  id,
  token,
  name,
  expires,
  minimized = false,
  onMinimize,
  onRestore,
  onDismiss,
}: {
  id: string;
  token?: string;
  name: string;
  expires: string;
  minimized?: boolean;
  onMinimize?: () => void;
  onRestore?: () => void;
  onDismiss?: () => void;
}) {
  const router = useRouter();
  const [focusedVideo, setFocusedVideo] = useState<"local" | "remote">("remote");
  const callFrameRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [changingScreen, setChangingScreen] = useState(false);
  const screenStream = useRef<MediaStream | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{ text: string; own: boolean }[]>([]);
  // Incoming messages so far, and how many of them were on screen when the chat was last open or closed.
  const [received, setReceived] = useState(0);
  const [seen, setSeen] = useState(0);
  const unread = chatOpen ? 0 : received - seen;
  const chatLog = useRef<HTMLDivElement>(null);
  const chatAtBottom = useRef(true);
  useEffect(() => {
    const log = chatLog.current;
    // Follow new messages unless the reader has scrolled up; always follow one's own message.
    if (log && (chatAtBottom.current || messages.at(-1)?.own)) log.scrollTop = log.scrollHeight;
  }, [messages, chatOpen]);
  function showChat(open: boolean) {
    if (open) chatAtBottom.current = true;
    setSeen(received);
    setChatOpen(open);
  }
  const [chatReady, setChatReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  // iPhone Safari has no element fullscreen, so the button is hidden there.
  const fullscreenSupported = useSyncExternalStore(() => () => {}, () => !!document.fullscreenEnabled, () => false);
  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === callFrameRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  const [insetPosition, setInsetPosition] = useState({ x: 0.98, y: 0.98 });
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressInsetClick = useRef(false);
  function startInsetDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const tile = event.currentTarget.parentElement?.parentElement;
    if (!tile) return;
    const bounds = tile.getBoundingClientRect();
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top, moved: false };
    suppressInsetClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveInset(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    const tile = event.currentTarget.parentElement?.parentElement;
    if (!current || current.id !== event.pointerId || !tile || !stageRef.current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    suppressInsetClick.current = true;
    const stage = stageRef.current.getBoundingClientRect();
    const bounds = tile.getBoundingClientRect();
    const width = Math.max(0, stage.width - bounds.width);
    const height = Math.max(0, stage.height - bounds.height);
    setInsetPosition({
      x: width ? Math.max(0, Math.min(1, (current.left + dx - stage.left) / width)) : 0,
      y: height ? Math.max(0, Math.min(1, (current.top + dy - stage.top) / height)) : 0,
    });
  }
  const insetStyle = {
    left: `${insetPosition.x * 100}%`,
    top: `${insetPosition.y * 100}%`,
    transform: `translate(-${insetPosition.x * 100}%, -${insetPosition.y * 100}%)`,
  };
  const [localRatio, setLocalRatio] = useState(4 / 3);
  const [remoteRatio, setRemoteRatio] = useState(4 / 3);
  const [stageRatio, setStageRatio] = useState(16 / 9);
  const [state, setState] = useState("waiting"),
    [expired, setExpired] = useState(false),
    [error, setError] = useState(""),
    [connected, setConnected] = useState(false),
    [muted, setMuted] = useState(true),
    [camera, setCamera] = useState(true),
    [relay, setRelay] = useState(true);
  const waitingForConsultant = !!token && state === "ringing" && !expired;
  const { blocked: soundBlocked, enableSound } = useCallRingtone(waitingForConsultant, "outgoing");
  const [mediaReady, setMediaReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [remoteAudioBlocked, setRemoteAudioBlocked] = useState(false);
  const [remoteMuted, setRemoteMuted] = useState<boolean | null>(null);
  const muteChannel = useRef<RTCDataChannel | null>(null);
  // Recent microphone levels, newest first; new samples enter on the left and scroll right.
  const [micLevels, setMicLevels] = useState<number[]>(() => Array(micBarCount).fill(0));
  const mediaRequest = useRef<Promise<MediaStream> | null>(null);
  const mediaGeneration = useRef(0);
  const local = useRef<HTMLVideoElement>(null),
    remote = useRef<HTMLVideoElement>(null),
    pc = useRef<RTCPeerConnection>(null),
    stream = useRef<MediaStream>(null),
    starting = useRef(false),
    candidates = useRef<RTCIceCandidateInit[]>([]);
  const servers = useRef<RTCIceServer[]>([]);
  const locallyEnded = useRef(false);
  const actionVersion = useRef(0);
  const actionPending = useRef(false);
  const microphoneMuted = useRef(true);
  const cameraEnabled = useRef(true);
  useEffect(() => {
    if (!minimized && token || !["ended", "declined", "revoked"].includes(state)) return;
    const timer = setTimeout(() => {
      if (!token) router.replace("/admin");
      onDismiss?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [state, token, router, minimized, onDismiss]);
  useEffect(() => {
    microphoneMuted.current = muted;
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    if (muteChannel.current?.readyState === "open") {
      muteChannel.current.send(JSON.stringify({ muted }));
    }
  }, [muted]);
  async function send(action: string, payload?: Signal) {
    const response = await fetch("/api/calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "x-call-token": token } : {}),
      },
      body: JSON.stringify({ id, action, payload }),
    });
    if (!response.ok)
      throw new Error(
        "Не удалось выполнить действие. Обновите страницу или проверьте срок приглашения.",
      );
  }
  function cleanup(keepPreview = false) {
    screenStream.current?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    screenStream.current = null;
    setSharingScreen(false);
    if (local.current) local.current.srcObject = stream.current;
    if (document.fullscreenElement === callFrameRef.current) void document.exitFullscreen().catch(() => {});
    if (!keepPreview) {
      mediaGeneration.current += 1;
      mediaRequest.current = null;
    }
    pc.current?.close();
    pc.current = null;
    muteChannel.current = null;
    setChatReady(false);
    setRemoteMuted(null);
    if (!keepPreview) {
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = null;
      setMediaReady(false);
    }
    starting.current = false;
    candidates.current = [];
    microphoneMuted.current = true;
    stream.current?.getAudioTracks().forEach((track) => { track.enabled = false; });
    setMuted(true);
    if (!keepPreview) {
      cameraEnabled.current = true;
      setCamera(true);
    }
    if (remote.current) remote.current.srcObject = null;
    setConnected(false);
    setFocusedVideo("remote");
    setRemoteAudioBlocked(false);
  }
  async function playRemote() {
    const video = remote.current;
    if (!video?.srcObject) return;
    const media = video.srcObject;
    try {
      await video.play();
      if (video.srcObject === media) setRemoteAudioBlocked(false);
    } catch (cause) {
      if (video.srcObject !== media) return;
      if (cause instanceof DOMException && cause.name === "NotAllowedError") {
        setRemoteAudioBlocked(true);
      } else if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setError("Не удалось воспроизвести видео собеседника. Проверьте подключение.");
      }
    }
  }
  async function stopScreenShare() {
    const display = screenStream.current;
    screenStream.current = null;
    display?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    setSharingScreen(false);
    if (local.current) local.current.srcObject = stream.current;
    const cameraTrack = stream.current?.getVideoTracks()[0];
    const sender = pc.current?.getSenders().find((item) => item.track?.kind === "video");
    if (sender && cameraTrack) {
      try { await sender.replaceTrack(cameraTrack); }
      catch { setError("Не удалось вернуться к камере. Завершите звонок и подключитесь снова."); }
    }
  }
  async function toggleScreenShare() {
    if (changingScreen) return;
    setChangingScreen(true);
    const peer = pc.current;
    try {
      if (screenStream.current) { await stopScreenShare(); return; }
      if (!peer || !navigator.mediaDevices?.getDisplayMedia) throw new Error("Демонстрация экрана недоступна.");
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      if (pc.current !== peer || peer.connectionState === "closed") {
        display.getTracks().forEach((track) => track.stop());
        return;
      }
      const track = display.getVideoTracks()[0];
      const sender = peer.getSenders().find((item) => item.track?.kind === "video");
      if (!track || !sender) { display.getTracks().forEach((item) => item.stop()); throw new Error("Не удалось начать демонстрацию экрана."); }
      try { await sender.replaceTrack(track); }
      catch (cause) { display.getTracks().forEach((item) => item.stop()); throw cause; }
      if (pc.current !== peer) { display.getTracks().forEach((item) => item.stop()); return; }
      screenStream.current = display;
      track.onended = () => { void stopScreenShare(); };
      if (local.current) local.current.srcObject = display;
      setSharingScreen(true);
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "NotAllowedError")) setError("Не удалось начать демонстрацию экрана. Попробуйте снова.");
    } finally { setChangingScreen(false); }
  }
  async function getMedia() {
    if (stream.current) return stream.current;
    if (mediaRequest.current) return mediaRequest.current;
    if (!navigator.mediaDevices)
      throw new Error("Для камеры и микрофона нужен HTTPS или localhost.");
    const generation = mediaGeneration.current;
    const request = navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((media) => {
      if (generation !== mediaGeneration.current) {
        media.getTracks().forEach((track) => track.stop());
        throw new Error("Проверка устройств отменена.");
      }
      media.getAudioTracks().forEach((track) => { track.enabled = !microphoneMuted.current; });
      media.getVideoTracks().forEach((track) => { track.enabled = cameraEnabled.current; });
      stream.current = media;
      if (local.current) local.current.srcObject = media;
      setMediaReady(true);
      return media;
    });
    mediaRequest.current = request;
    try { return await request; }
    finally { if (mediaRequest.current === request) mediaRequest.current = null; }
  }
  async function checkDevices() {
    setDeviceError(false);
    setChecking(true);
    setError("");
    try { await getMedia(); }
    catch { setDeviceError(true); setError("Не удалось включить камеру и микрофон. Разрешите доступ в браузере и проверьте подключение устройств."); }
    finally { setChecking(false); }
  }
  useEffect(() => {
    if (!mediaReady || !stream.current) return;
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream.current);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const timer = setInterval(() => {
      analyser.getByteTimeDomainData(samples);
      const energy = samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length;
      const level = Math.min(100, Math.round(Math.sqrt(energy) * 400));
      setMicLevels((levels) => [level, ...levels.slice(0, -1)]);
    }, 100);
    void context.resume().catch(() => {});
    return () => {
      clearInterval(timer);
      source.disconnect();
      void context.close();
    };
  }, [mediaReady]);
  async function prepare() {
    if (pc.current) return pc.current;
    const media = await getMedia();
    const peer = new RTCPeerConnection({ iceServers: servers.current });
    pc.current = peer;
    function attachMuteChannel(channel: RTCDataChannel) {
      muteChannel.current = channel;
      channel.onopen = () => {
        if (pc.current === peer) {
          setChatReady(true);
          channel.send(JSON.stringify({ muted: microphoneMuted.current }));
        }
      };
      channel.onclose = () => { if (pc.current === peer) setChatReady(false); };
      channel.onmessage = (event) => {
        if (pc.current !== peer) return;
        try {
          const data = JSON.parse(event.data);
          if (typeof data.muted === "boolean") setRemoteMuted(data.muted);
          if (typeof data.message === "string" && data.message.trim() && data.message.length <= 2000) {
            setMessages((current) => [...current, { text: data.message, own: false }].slice(-200));
            setReceived((count) => count + 1);
          }
        } catch { /* Ignore malformed device status messages. */ }
      };
    }
    if (token) attachMuteChannel(peer.createDataChannel("device-status"));
    else peer.ondatachannel = (event) => {
      if (event.channel.label === "device-status") attachMuteChannel(event.channel);
    };
    media.getTracks().forEach((t) => peer.addTrack(t, media));
    peer.ontrack = (e) => {
      if (remote.current) {
        if (remote.current.srcObject !== e.streams[0]) {
          remote.current.srcObject = e.streams[0];
        }
        void playRemote();
      }
    };
    peer.onicecandidate = (e) => {
      if (e.candidate)
        void send("signal", {
          type: "candidate",
          candidate: e.candidate.toJSON(),
        }).catch((e) => setError(e.message));
    };
    peer.onconnectionstatechange = () => {
      setConnected(peer.connectionState === "connected");
      if (peer.connectionState === "failed")
        setError(token ? "Не удалось установить соединение. Проверьте интернет и попробуйте позвонить снова." : "Соединение не удалось. Проверьте настройки TURN-сервера.");
    };
    return peer;
  }
  useEffect(() => {
    let stopped = false,
      after = 0,
      previousState = "",
      previewRequested = false;
    async function poll() {
      const version = actionVersion.current;
      if (actionPending.current) return;
      try {
        const r = await fetch(`/api/calls?id=${id}&after=${after}`, {
          headers: token ? { "x-call-token": token } : {},
          cache: "no-store",
        });
        if (!r.ok) {
          if (r.status === 404 || r.status === 401) {
            cleanup();
            setState("ended");
            setExpired(true);
          }
          throw new Error("Приглашение недоступно или срок действия истёк.");
        }
        const data = await r.json();
        if (stopped || actionPending.current || version !== actionVersion.current) return;
        if (!token && data.state === "ringing" && (locallyEnded.current || ["ended", "declined"].includes(previousState))) {
          router.replace("/admin");
          return;
        }
        if (locallyEnded.current && ["accepted", "ringing"].includes(data.state)) return;
        servers.current = data.iceServers;
        setRelay(data.relayConfigured);
        setState(data.state);
        if (["ended", "declined", "revoked"].includes(data.state)) {
          if (data.state !== previousState) cleanup(!!token && data.state !== "revoked");
          previousState = data.state;
          if (token && data.state !== "revoked" && !previewRequested) {
            previewRequested = true;
            void checkDevices();
          }
          return;
        }
        previousState = data.state;
        if (token && data.state === "waiting" && !previewRequested) {
          previewRequested = true;
          void checkDevices();
        }
        if (data.state === "ringing" && pc.current) cleanup(!!token);
        if (data.state === "accepted" && token && !starting.current) {
          starting.current = true;
          const peer = await prepare();
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await send("signal", { type: "offer", sdp: offer.sdp });
        }
        for (const entry of data.signals) {
          if (stopped || actionPending.current || version !== actionVersion.current) return;
          const signalId = Number(entry.id);
          if (signalId <= after) continue;
          const s: Signal = entry.payload;
          if (s.type === "candidate") {
            if (pc.current?.remoteDescription)
              await pc.current.addIceCandidate(s.candidate!);
            else candidates.current.push(s.candidate!);
          } else {
            const peer = await prepare();
            if (stopped || actionPending.current || version !== actionVersion.current || pc.current !== peer) return;
            // A later ICE failure can cause this batch to be fetched again.
            // An already-applied answer must not be applied in the stable state.
            if (s.type === "answer" && peer.signalingState === "stable" && peer.remoteDescription?.type === "answer" && peer.remoteDescription.sdp === s.sdp) {
              after = signalId;
              continue;
            }
            await peer.setRemoteDescription({ type: s.type, sdp: s.sdp });
            if (s.type === "answer") after = signalId;
            for (const c of candidates.current) await peer.addIceCandidate(c);
            candidates.current = [];
            if (s.type === "offer") {
              const answer = await peer.createAnswer();
              await peer.setLocalDescription(answer);
              await send("signal", { type: "answer", sdp: answer.sdp });
            }
          }
          after = signalId;
        }
      } catch (e) {
        if (starting.current && !pc.current) {
          starting.current = false;
          await send("end").catch(() => {});
        }
        if (!stopped)
          setError(e instanceof Error ? e.message : "Ошибка соединения");
      }
    }
    let timer: ReturnType<typeof setTimeout>;
    async function loop() {
      await poll();
      if (!stopped) timer = setTimeout(loop, 1500);
    }
    void loop();
    return () => {
      stopped = true;
      clearTimeout(timer);
      mediaGeneration.current += 1;
      pc.current?.close();
      stream.current?.getTracks().forEach((t) => t.stop());
      screenStream.current?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    };
    // The room identity is fixed for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);
  async function action(kind: string) {
    if (actionPending.current) return;
    actionPending.current = true;
    actionVersion.current += 1;
    try {
      setError("");
      if (kind === "end" || kind === "decline") {
        locallyEnded.current = true;
        setState(kind === "decline" ? "declined" : "ended");
        cleanup(!!token);
      }
      if (kind === "ring") {
        enableSound();
        await getMedia();
      }
      if (kind === "accept") await prepare();
      await send(kind);
      if (kind === "ring") {
        locallyEnded.current = false;
        setState("ringing");
      }
      if (kind === "end" || kind === "decline") cleanup(!!token);
    } catch (e) {
      cleanup(!!token);
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      actionVersion.current += 1;
      actionPending.current = false;
    }
  }
  const immersive = state === "accepted" && !minimized;
  useEffect(() => {
    if (!immersive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [immersive]);
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
  function toggleCamera() {
    cameraEnabled.current = !camera;
    stream.current?.getVideoTracks().forEach((t) => (t.enabled = !camera));
    setCamera(!camera);
  }
  const callActive = ["ringing", "accepted"].includes(state);
  const expiresLabel = new Date(expires).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const statusText = connected
    ? "Соединение установлено"
    : ({
        waiting: "Можно начать звонок",
        ringing: "Ожидаем ответа консультанта",
        accepted: "Подключаемся…",
        declined: "Звонок отклонён",
        ended: "Звонок завершён",
        revoked: "Приглашение отменено",
      } as Record<string, string>)[state];
  // Before the call the client's details sit over their own camera preview.
  // Before the call the microphone check sits along the bottom of the own preview.
  const micCheck = !minimized && mediaReady && state !== "accepted";
  const infoOnVideo = !!token && mediaReady && state !== "accepted" && !minimized;
  const button =
    "rounded-xl bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600";
  return (
    <section ref={callFrameRef}
      style={minimized || immersive ? undefined : { "--call-max-width": `min(${state === "accepted" ? "64rem" : "42rem"}, calc(max(12rem, 100dvh - ${token ? "24rem" : "30rem"}) * ${state === "accepted" && focusedVideo === "remote" ? remoteRatio : localRatio} + 3rem + 2px))` } as CSSProperties}
      className={minimized ? "fixed right-4 bottom-4 z-50 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-800 bg-[#121826] p-2 shadow-2xl" : immersive ? "fixed inset-0 z-60 flex h-dvh w-full flex-col gap-3 overflow-hidden bg-[#121826] p-3 sm:p-4" : "mx-auto w-full bg-white px-4 py-6 sm:max-w-(--call-max-width) sm:rounded-3xl sm:border sm:border-brand-100 sm:p-6 sm:shadow-sm"}
    >
      <div className={minimized || immersive ? "hidden" : ""}>
      {!infoOnVideo && <h1 className="text-2xl font-semibold sm:text-3xl">Видеоконсультация</h1>}
      {!infoOnVideo && (
        <>
          <p className="mt-3 text-lg">{token ? `Вы: ${name}` : name}</p>
          <p suppressHydrationWarning className="mt-2 text-sm text-neutral-500">
            Приглашение действует до {expiresLabel}
          </p>
          <p className="mt-4" role="status">{statusText}</p>
        </>
      )}
      {error && (
        <p className="mt-3 text-red-700" role="alert">
          {error}
        </p>
      )}
      {!token && !relay && (
        <p className="mt-3 text-sm text-neutral-500">
          TURN не настроен: доступно локальное тестирование; соединение между
          разными сетями может не установиться.
        </p>
      )}
      </div>
      {immersive && (
        <header className={`-mx-3 flex shrink-0 items-center justify-between border-b border-slate-700 bg-[#121826] px-3 pb-3 sm:-mx-4 sm:px-4 ${chatOpen ? "sm:mr-76" : ""}`}>
        <div className="flex gap-2">
          <button type="button" aria-label="Завершить звонок" title="Завершить звонок" onClick={() => { if (callActive) void action("end"); else { cleanup(); onDismiss?.(); } }} className="flex pointer-coarse:max-lg:hidden size-6 items-center justify-center rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-red-500 text-white hover:bg-red-600"><CallWindowCloseIcon className="size-4" /></button>
          <button type="button" aria-label={minimized ? "Вернуться к звонку" : "Свернуть звонок"} title={minimized ? "Вернуться к звонку" : "Свернуть звонок"} onClick={async () => { if (document.fullscreenElement) await document.exitFullscreen(); if (minimized) onRestore?.(); else onMinimize?.(); }} className="group flex size-6 items-center justify-center rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-yellow-400 text-neutral-900 hover:bg-yellow-500"><CallWindowMinimizeIcon className="size-4 opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100" /></button>
          {fullscreenSupported && <button type="button" aria-label={fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"} title={fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"} onClick={() => { void (document.fullscreenElement ? document.exitFullscreen() : callFrameRef.current?.requestFullscreen())?.catch(() => setError("Полноэкранный режим недоступен в этом браузере.")); }} className="flex size-6 items-center justify-center rounded-full transition duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none bg-green-500 text-white hover:bg-green-600"><CallWindowFullscreenIcon expanded={fullscreen} className="size-4" /></button>}
        </div>

          {!chatOpen && <button type="button" aria-expanded={chatOpen} aria-controls="call-chat" onClick={() => showChat(true)} aria-label={unread ? `Chat tab, непрочитанных сообщений: ${unread}` : undefined} className="relative inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600">
            <CallChatIcon className="size-4" />Chat tab
            {unread > 0 && <span aria-hidden="true" className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold ring-2 ring-[#121826]">{unread > 99 ? "99+" : unread}</span>}
          </button>}
        </header>
      )}
      {immersive && error && <p role="alert" className="absolute top-3 right-3 z-50 max-w-xs rounded-lg bg-red-950/90 p-2 text-sm text-white">{error}</p>}
      <div className={immersive ? `relative flex min-h-0 flex-1 gap-3 ${chatOpen ? "sm:mr-80" : ""}` : "contents"}>
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
            <button type="button" onPointerDown={startInsetDrag} onPointerMove={moveInset} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; suppressInsetClick.current = true; }} onClick={(event) => { if (event.detail === 0 || !suppressInsetClick.current) setFocusedVideo("remote"); suppressInsetClick.current = false; }} aria-label="Показать видео собеседника крупно" className="absolute inset-0 z-30 touch-none cursor-grab rounded-xl active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
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
          <div className={`relative overflow-hidden rounded-xl ${immersive && focusedVideo === "local" ? "h-full" : ""}`}>
          {state === "accepted" && focusedVideo === "remote" && (
            <button type="button" onPointerDown={startInsetDrag} onPointerMove={moveInset} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; suppressInsetClick.current = true; }} onClick={(event) => { if (event.detail === 0 || !suppressInsetClick.current) setFocusedVideo("local"); suppressInsetClick.current = false; }} aria-label="Показать свою камеру крупно" className="absolute inset-0 z-30 touch-none cursor-grab rounded-xl active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
          )}
          {mediaReady && !camera && !sharingScreen && !waitingForConsultant && (state === "accepted" && focusedVideo === "remote" ? (
            <span role="img" aria-label="Ваша камера выключена" className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/70"><CameraIcon off className="size-6" /></span>
          ) : (
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-white ${micCheck ? "pb-24" : ""}`}>
              <span className="flex size-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"><CameraIcon off className="size-7" /></span>
              <p role="status" className="text-base font-medium">Камера выключена</p>
              <button type="button" onClick={toggleCamera} className="rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/25">Включить камеру</button>
            </div>
          ))}
          {micCheck && (
            <div className="absolute inset-x-0 bottom-0 z-10 rounded-b-xl bg-neutral-950/65 px-4 py-3 text-white backdrop-blur-md">
              <p id="microphone-level-label" className="text-sm text-white/80">{muted ? "Микрофон выключен" : "Говорите — индикатор должен двигаться"}</p>
              <div id="microphone-level" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={muted ? 0 : micLevels[0]} aria-labelledby="microphone-level-label" className="mt-2 flex h-6 items-center gap-1">
                {micLevels.map((level, index) => (
                  <span key={index} style={{ height: `${muted ? 12 : Math.max(12, level)}%` }} className={`min-w-0 flex-1 rounded-full transition-[height] duration-100 ease-out motion-reduce:transition-none ${muted ? "bg-white/30" : "bg-brand-300"}`} />
                ))}
              </div>
            </div>
          )}
          {infoOnVideo && (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 w-fit rounded-2xl bg-neutral-950/55 px-4 py-3 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md sm:inset-x-4 sm:top-4 sm:px-5 sm:py-4">
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
          {muted && mediaReady && !micCheck && !(state === "accepted" && focusedVideo === "remote") && (
            <span role="img" aria-label="Ваш микрофон выключен" style={pictureCorner(localRatio, immersive && focusedVideo === "local")} className="pointer-events-none absolute z-10 flex size-8 items-center justify-center rounded-full bg-neutral-950/60 text-white"><MicrophoneIcon off className="size-4" /></span>
          )}
          <video ref={local} disablePictureInPicture disableRemotePlayback onResize={(event) => { const video = event.currentTarget; if (video.videoWidth && video.videoHeight) setLocalRatio(video.videoWidth / video.videoHeight); }} autoPlay playsInline muted style={immersive && focusedVideo === "local" ? undefined : { aspectRatio: localRatio }} className={`block w-full rounded-xl ${immersive && focusedVideo === "local" ? `h-full ${videoFit(localRatio)}` : "h-auto bg-neutral-900 max-sm:max-h-[calc(100dvh-7rem)] max-sm:object-cover"} ${!mediaReady ? "hidden" : ""}`} />
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
      {immersive && chatOpen && (
        <aside id="call-chat" aria-label="Чат звонка" className="absolute inset-y-0 right-0 z-40 flex w-full flex-col border-l border-slate-700 bg-[#121826] p-4 text-white sm:w-80">
          <div className="flex items-center justify-between"><button type="button" aria-expanded={chatOpen} aria-controls="call-chat" onClick={() => showChat(false)} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"><CallChatIcon className="size-4" />Chat tab</button><button type="button" onClick={() => showChat(false)} aria-label="Закрыть чат"><CallWindowCloseIcon className="size-5" /></button></div>
          <div ref={chatLog} onScroll={(event) => { const log = event.currentTarget; chatAtBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 40; }} role="log" aria-live="polite" className="my-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
            {messages.length === 0 && <p className="text-sm text-slate-400">Сообщения доступны во время звонка.</p>}
            {messages.map((message, index) => <p key={index} className={`break-words rounded-lg p-2 text-base ${message.own ? "bg-brand-700" : "bg-slate-700"}`}><span className="mb-1 block text-sm text-white/70">{message.own ? "Вы" : token ? "Консультант" : "Участник"}</span>{message.text}</p>)}
          </div>
          <form onSubmit={(event) => {
            event.preventDefault();
            const text = chatDraft.trim();
            if (!text || muteChannel.current?.readyState !== "open") return;
            try {
              muteChannel.current.send(JSON.stringify({ message: text }));
              setMessages((current) => [...current, { text, own: true }].slice(-200));
              setChatDraft("");
            } catch { setError("Не удалось отправить сообщение."); }
          }} className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 p-1.5">
            <input aria-label="Сообщение" placeholder="Сообщение…" maxLength={2000} value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 pl-4 text-base text-white outline-none! placeholder:text-slate-500" />
            <button type="submit" aria-label="Отправить сообщение" disabled={!chatReady || !chatDraft.trim()} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-slate-900 transition hover:bg-yellow-300 disabled:bg-yellow-400/25 disabled:text-slate-500"><ChatSendIcon className="size-5" /></button>
          </form>
        </aside>
      )}
      <div className={immersive ? `flex shrink-0 flex-wrap items-center gap-3 ${chatOpen ? "sm:mr-80" : ""}` : `mt-5 flex flex-wrap gap-3 ${state === "accepted" ? "" : "w-full"}`}>
        {token && !expired && state !== "revoked" && (
          <button
            type="button"
            aria-label={callActive ? "Завершить" : "Позвонить"}
            disabled={!callActive && (!mediaReady || checking)}
            className={`order-last ml-auto inline-flex w-fit items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-white disabled:opacity-50 ${callActive ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`}
            onClick={() => void action(callActive ? "end" : "ring")}
          >
            <PhoneCallIcon className="size-4 shrink-0" />
            <span className={minimized ? "hidden" : ""}>{callActive ? "Завершить" : "Позвонить"}</span>
          </button>
        )}
        {!token && state === "ringing" && (
          <>
            <button className={button} onClick={() => void action("accept")}>
              Принять
            </button>
            <button className={button} onClick={() => void action("decline")}>
              Отклонить
            </button>
          </>
        )}
        {mediaReady && (
          <>
            <button
              aria-label={`Микрофон: ${muted ? "выключен" : "включён"}`}
              aria-pressed={!muted}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white ${muted ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`}
              onClick={() => {
                microphoneMuted.current = !muted;
                stream.current
                  ?.getAudioTracks()
                  .forEach((t) => (t.enabled = muted));
                setMuted(!muted);
              }}
            >
              <MicrophoneIcon off={muted} className="size-4 shrink-0" />
              <span className={minimized ? "hidden" : "hidden sm:inline"}>Микрофон</span>
            </button>
            <button
              aria-label={`Камера: ${camera ? "включена" : "выключена"}`}
              aria-pressed={camera}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white ${camera ? "bg-brand-500 hover:bg-brand-600" : "bg-red-600 hover:bg-red-700"}`}
              onClick={toggleCamera}
            >
              <CameraIcon off={!camera} className="size-4 shrink-0" />
              <span className={minimized ? "hidden" : "hidden sm:inline"}>Камера</span>
            </button>
            {state === "accepted" && (
              <button type="button" disabled={changingScreen} aria-pressed={sharingScreen} onClick={() => void toggleScreenShare()} className={`hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-white disabled:opacity-50 lg:inline-flex ${sharingScreen ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`} aria-label={sharingScreen ? "Остановить демонстрацию экрана" : "Поделиться экраном"}>
                <ScreenShareIcon className="size-4 shrink-0" />
                <span className={minimized ? "hidden" : ""}>{sharingScreen ? "Остановить показ" : "Поделиться экраном"}</span>
              </button>
            )}
          </>
        )}
        {!token && callActive && (
          <button aria-label="Завершить звонок"
            className="order-last ml-auto inline-flex w-fit items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
            onClick={() => void action("end")}
          >
            <PhoneCallIcon className="size-4 shrink-0" />
            <span className={minimized ? "hidden" : ""}>Завершить</span>
          </button>
        )}
      </div>
    </section>
  );
}

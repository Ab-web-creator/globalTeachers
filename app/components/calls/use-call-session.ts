"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useCallRingtone from "./use-call-ringtone";
import useCallFullscreen from "./use-call-fullscreen";
import useMicrophoneLevels from "./use-microphone-levels";
type Signal = {
  type: "offer" | "answer" | "candidate";
  sdp?: string;
  candidate?: RTCIceCandidateInit;
};

export type CallRoomProps = {
  id: string;
  token?: string;
  name: string;
  expires: string;
  minimized?: boolean;
  onMinimize?: () => void;
  onRestore?: () => void;
  onDismiss?: () => void;
};

export default function useCallSession({
  id, token, name, expires, minimized = false, onMinimize, onRestore, onDismiss,
}: CallRoomProps) {
  const router = useRouter();
  const [focusedVideo, setFocusedVideo] = useState<"local" | "remote">("remote");
  const callFrameRef = useRef<HTMLElement>(null);
  const { fullscreen, fullscreenSupported, exitFullscreen } = useCallFullscreen(callFrameRef);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [changingScreen, setChangingScreen] = useState(false);
  const screenStream = useRef<MediaStream | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; own: boolean }[]>([]);
  // Incoming messages so far, and how many of them were on screen when the chat was last open or closed.
  const [received, setReceived] = useState(0);
  const [seen, setSeen] = useState(0);
  const unread = chatOpen ? 0 : received - seen;
  function showChat(open: boolean) {
    setSeen(received);
    setChatOpen(open);
  }
  const [chatReady, setChatReady] = useState(false);
  const [localRatio, setLocalRatio] = useState(4 / 3);
  const [remoteRatio, setRemoteRatio] = useState(4 / 3);
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
  const mediaRequest = useRef<Promise<MediaStream> | null>(null);
  const mediaGeneration = useRef(0);
  const local = useRef<HTMLVideoElement>(null),
    remote = useRef<HTMLVideoElement>(null),
    pc = useRef<RTCPeerConnection>(null),
    stream = useRef<MediaStream>(null),
    starting = useRef(false),
    candidates = useRef<RTCIceCandidateInit[]>([]);
  const micLevels = useMicrophoneLevels(stream, mediaReady);
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
    exitFullscreen();
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
  function toggleMicrophone() {
    microphoneMuted.current = !muted;
    stream.current?.getAudioTracks().forEach((track) => { track.enabled = muted; });
    setMuted(!muted);
  }
  function sendChatMessage(message: string) {
    const text = message.trim();
    if (!text || muteChannel.current?.readyState !== "open") return false;
    try {
      muteChannel.current.send(JSON.stringify({ message: text }));
      setMessages((current) => [...current, { text, own: true }].slice(-200));
      return true;
    } catch {
      setError("Не удалось отправить сообщение.");
      return false;
    }
  }
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
  const cameraHidden = mediaReady && !camera && !sharingScreen;
  // A disabled camera track renders black frames; before the call, show a coloured box instead.
  const previewOff = cameraHidden && state !== "accepted";
  const cameraOff = cameraHidden && !waitingForConsultant;
  const infoOnVideo = !!token && mediaReady && state !== "accepted" && !minimized;
  const button =
    "rounded-xl bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600";
  return {
    toggleMicrophone,
    sendChatMessage,
    token,
    name,
    minimized,
    onRestore,
    focusedVideo,
    setFocusedVideo,
    chatOpen,
    fullscreen,
    localRatio,
    setLocalRatio,
    remoteRatio,
    setRemoteRatio,
    state,
    expired,
    error,
    connected,
    muted,
    camera,
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
    messages,
    showChat,
    chatReady,
    setError,
    sharingScreen,
    changingScreen,
    toggleScreenShare,
    action,
    onMinimize,
    onDismiss,
    callFrameRef,
    unread,
    fullscreenSupported,
    relay,
    cleanup,
  };
}

export type CallRoomModel = ReturnType<typeof useCallSession>;

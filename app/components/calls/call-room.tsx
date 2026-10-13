"use client";
import { useEffect, useRef, useState } from "react";
type Signal = {
  type: "offer" | "answer" | "candidate";
  sdp?: string;
  candidate?: RTCIceCandidateInit;
};
export default function CallRoom({
  id,
  token,
  name,
  expires,
}: {
  id: string;
  token?: string;
  name: string;
  expires: string;
}) {
  const [state, setState] = useState("waiting"),
    [retryAfter, setRetryAfter] = useState(0),
    [expired, setExpired] = useState(false),
    [error, setError] = useState(""),
    [connected, setConnected] = useState(false),
    [muted, setMuted] = useState(true),
    [camera, setCamera] = useState(true),
    [relay, setRelay] = useState(true);
  const local = useRef<HTMLVideoElement>(null),
    remote = useRef<HTMLVideoElement>(null),
    pc = useRef<RTCPeerConnection>(null),
    stream = useRef<MediaStream>(null),
    starting = useRef(false),
    candidates = useRef<RTCIceCandidateInit[]>([]);
  const servers = useRef<RTCIceServer[]>([]);
  const locallyEnded = useRef(false);
  const microphoneMuted = useRef(true);
  useEffect(() => {
    microphoneMuted.current = muted;
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
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
  function cleanup() {
    pc.current?.close();
    pc.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    starting.current = false;
    candidates.current = [];
    microphoneMuted.current = true;
    setMuted(true);
    setCamera(true);
    setConnected(false);
  }
  async function prepare() {
    if (pc.current) return pc.current;
    if (!navigator.mediaDevices)
      throw new Error("Для камеры и микрофона нужен HTTPS или localhost.");
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    media.getAudioTracks().forEach((track) => {
      track.enabled = !microphoneMuted.current;
    });
    stream.current = media;
    if (local.current) local.current.srcObject = media;
    const peer = new RTCPeerConnection({ iceServers: servers.current });
    pc.current = peer;
    media.getTracks().forEach((t) => peer.addTrack(t, media));
    peer.ontrack = (e) => {
      if (remote.current) {
        remote.current.srcObject = e.streams[0];
        void remote.current
          .play()
          .catch(() => setError("Нажмите на видео, чтобы включить звук."));
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
        setError("Соединение не удалось. Проверьте настройки TURN-сервера.");
    };
    return peer;
  }
  useEffect(() => {
    let stopped = false,
      after = 0;
    async function poll() {
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
        if (stopped) return;
        if (locallyEnded.current && ["accepted", "ringing"].includes(data.state)) return;
        servers.current = data.iceServers;
        setRelay(data.relayConfigured);
        setState(data.state);
        setRetryAfter(data.retryAfter ?? 0);
        if (["ended", "declined", "revoked"].includes(data.state)) {
          cleanup();
          return;
        }
        if (data.state === "ringing" && pc.current) cleanup();
        if (data.state === "accepted" && token && !starting.current) {
          starting.current = true;
          const peer = await prepare();
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await send("signal", { type: "offer", sdp: offer.sdp });
        }
        for (const entry of data.signals) {
          const s: Signal = entry.payload;
          if (s.type === "candidate") {
            if (pc.current?.remoteDescription)
              await pc.current.addIceCandidate(s.candidate!);
            else candidates.current.push(s.candidate!);
          } else {
            const peer = await prepare();
            await peer.setRemoteDescription({ type: s.type, sdp: s.sdp });
            for (const c of candidates.current) await peer.addIceCandidate(c);
            candidates.current = [];
            if (s.type === "offer") {
              const answer = await peer.createAnswer();
              await peer.setLocalDescription(answer);
              await send("signal", { type: "answer", sdp: answer.sdp });
            }
          }
          after = Number(entry.id);
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
      pc.current?.close();
      stream.current?.getTracks().forEach((t) => t.stop());
    };
    // The room identity is fixed for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);
  async function action(kind: string) {
    try {
      setError("");
      if (kind === "end" || kind === "decline") {
        locallyEnded.current = true;
        setState(kind === "decline" ? "declined" : "ended");
        setRetryAfter(20);
        cleanup();
      }
      if (kind === "accept") await prepare();
      await send(kind);
      if (kind === "ring") {
        locallyEnded.current = false;
        setState("ringing");
      }
      if (kind === "end" || kind === "decline") cleanup();
    } catch (e) {
      cleanup();
      setError(e instanceof Error ? e.message : "Ошибка");
    }
  }
  const button =
    "rounded-xl bg-brand-500 px-5 py-3 text-base text-white hover:bg-brand-600";
  return (
    <section className="mx-auto max-w-5xl rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold">Видеоконсультация</h1>
      <p className="mt-3 text-lg">{name}</p>
      <p suppressHydrationWarning className="mt-2 text-sm text-neutral-500">
        Приглашение действует до {new Date(expires).toLocaleString("ru-RU")}
      </p>
      <p className="mt-4" role="status">
        {connected
          ? "Соединение установлено"
          : (
              {
                waiting: "Можно начать звонок",
                ringing: "Ожидаем ответа консультанта",
                accepted: "Подключаемся…",
                declined: "Звонок отклонён",
                ended: "Звонок завершён",
              revoked: "Приглашение отменено",
              } as Record<string, string>
            )[state]}
      </p>
      {error && (
        <p className="mt-3 text-red-700" role="alert">
          {error}
        </p>
      )}
      {!relay && (
        <p className="mt-3 text-sm text-neutral-500">
          TURN не настроен: доступно локальное тестирование; соединение между
          разными сетями может не установиться.
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <video
          ref={remote}
          autoPlay
          playsInline
          controls
          onClick={() => void remote.current?.play()}
          className="aspect-video w-full rounded-xl bg-neutral-900"
        />
        <video
          ref={local}
          autoPlay
          playsInline
          muted
          className="aspect-video w-full rounded-xl bg-neutral-900"
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {token && state === "waiting" && (
          <button className={button} onClick={() => void action("ring")}>
            Позвонить консультанту
          </button>
        )}
        {token && !expired && ["ended", "declined"].includes(state) && (
          <div>
            <button type="button" disabled={retryAfter > 0} className={`${button} disabled:opacity-50`} onClick={() => void action("ring")}>
              Позвонить снова
            </button>
            <p className="mt-2 text-sm text-neutral-500">
              {retryAfter > 0 ? `Повторный звонок доступен через ${retryAfter} с. Он начнётся только после нажатия кнопки.` : "Нажмите кнопку, чтобы начать новый звонок."}
            </p>
          </div>
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
        {state === "accepted" && (
          <>
            <button
              className={button}
              onClick={() => {
                microphoneMuted.current = !muted;
                stream.current
                  ?.getAudioTracks()
                  .forEach((t) => (t.enabled = muted));
                setMuted(!muted);
              }}
            >
              {muted ? "Включить микрофон" : "Выключить микрофон"}
            </button>
            <button
              className={button}
              onClick={() => {
                stream.current
                  ?.getVideoTracks()
                  .forEach((t) => (t.enabled = !camera));
                setCamera(!camera);
              }}
            >
              {camera ? "Выключить камеру" : "Включить камеру"}
            </button>
          </>
        )}
        {["ringing", "accepted"].includes(state) && (
          <button
            className="rounded-xl bg-red-600 px-5 py-3 text-white"
            onClick={() => void action("end")}
          >
            Завершить
          </button>
        )}
      </div>
    </section>
  );
}

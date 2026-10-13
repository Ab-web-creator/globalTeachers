"use client";
import { useState } from "react";
import { VideoCallIcon } from "@/app/components/svg";
export default function VideoCallInvitation({
  applicationId,
}: {
  applicationId: string;
}) {
  const [open, setOpen] = useState(false),
    [hours, setHours] = useState("24"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [link, setLink] = useState(""),
    [invitationId, setInvitationId] = useState(""),
    [email, setEmail] = useState("");
  async function create() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          applicationId,
          hours: Number(hours),
        }),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setLink(data.url);
      setInvitationId(data.id);
      setEmail(data.email);
    } catch {
      setError("Не удалось создать приглашение.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-neutral-500 shadow-sm"
      >
        <span className="flex size-8 items-center justify-center rounded-full group-hover:bg-neutral-200">
          <VideoCallIcon />
        </span>
        Видеозвонок
      </button>
      {open && (
        <div className="absolute top-full right-0 z-40 mt-2 w-72 rounded-xl border border-brand-100 bg-white p-4 shadow-xl">
          <label className="block text-sm">
            Срок приглашения
            <select
              value={hours}
              disabled={!!link || busy}
              onChange={(e) => setHours(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-brand-200 p-2"
            >
              <option value="1">1 час</option>
              <option value="24">24 часа</option>
              <option value="72">3 дня</option>
              <option value="168">7 дней</option>
            </select>
          </label>
          <button
            disabled={busy || !!link}
            onClick={() => void create()}
            className="mt-3 rounded-lg bg-brand-500 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {busy ? "Создаём…" : "Создать приглашение"}
          </button>
          {error && <p role="alert">{error}</p>}
          {link && (
            <>
              <input
                aria-label="Ссылка приглашения"
                readOnly
                value={link}
                className="mt-3 w-full border p-2 text-sm"
                onFocus={(e) => e.target.select()}
              />
              <a
                className="mt-3 block text-sm text-brand-600"
                href={`/admin/mail/new?${new URLSearchParams({ to: email, subject: "Приглашение на видеоконсультацию", text: `Здравствуйте!\n\nДля видеоконсультации откройте личную ссылку:\n${link}\n\nСрок действия: ${hours} ч. После открытия нажмите «Позвонить консультанту».` })}`}
              >
                Подготовить письмо
              </a>
              <button className="mt-3 text-sm text-red-700" onClick={async () => {
                const response = await fetch("/api/calls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: invitationId, action: "revoke" }) });
                if (response.ok) { setLink(""); setInvitationId(""); } else setError("Не удалось отменить приглашение.");
              }}>Отменить приглашение</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

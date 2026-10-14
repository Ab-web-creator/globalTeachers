"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormSelectChevronIcon, VideoCallIcon } from "@/app/components/svg";

type Invitation = {
  id: string;
  url: string | null;
  email: string;
  expiresAt: string;
};

export default function VideoCallInvitation({ applicationId }: { applicationId: string }) {
  const [cardsTarget, setCardsTarget] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState("24");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copyStatus, setCopyStatus] = useState<{ id: string; message: string } | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/calls?${new URLSearchParams({ applicationId })}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();
        const data: Invitation[] = await response.json();
        setInvitations(data.map((invitation) => ({
          ...invitation,
          url: invitation.url ? new URL(invitation.url, window.location.origin).href : null,
        })));
      } catch {
        if (!controller.signal.aborted) setError("Не удалось загрузить приглашения. Обновите страницу.");
      } finally {
        if (!controller.signal.aborted) {
          setCardsTarget(document.getElementById(`video-invitations-${applicationId}`));
          setLoading(false);
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [applicationId]);

  async function create() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", applicationId, hours: Number(hours) }),
      });
      if (!response.ok) throw new Error();
      const invitation: Invitation = await response.json();
      setInvitations((current) => [invitation, ...current]);
      setOpen(false);
    } catch {
      setError("Не удалось создать приглашение.");
    } finally {
      setBusy(false);
    }
  }

  async function copyInvitation(invitation: Invitation) {
    if (!invitation.url) return;
    try {
      await navigator.clipboard.writeText(invitation.url);
      setCopyStatus({ id: invitation.id, message: "Ссылка скопирована." });
      setOpen(false);
    } catch {
      setCopyStatus({ id: invitation.id, message: "Не удалось скопировать ссылку. Выделите её и скопируйте вручную." });
    }
  }

  async function revokeInvitation(id: string) {
    setRevoking(id);
    setError("");
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "revoke" }),
      });
      if (!response.ok) throw new Error();
      setInvitations((current) => current.filter((invitation) => invitation.id !== id));
      setCopyStatus(null);
    } catch {
      setError("Не удалось отменить приглашение.");
    } finally {
      setRevoking(null);
    }
  }

  return (
    <div className="relative">
      {loading && <p role="status" className="mb-3 text-sm text-neutral-600">Загружаем приглашения…</p>}
      {cardsTarget && invitations.length > 0 && createPortal(
      <section aria-labelledby={`video-invitations-title-${applicationId}`} className="mb-7 border-b border-brand-100 pb-7">
        <h3 id={`video-invitations-title-${applicationId}`} className="text-base font-semibold">Приглашения на видеозвонок</h3>
        <div className="mt-4 flex flex-wrap gap-3">
        {invitations.map((invitation, index) => (
          <div key={invitation.id} className="w-72 max-w-full rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm">
            <p className="font-medium">Приглашение на видеозвонок №{index + 1}</p>
            <p className="mt-2 text-neutral-600">Действует до {new Date(invitation.expiresAt).toLocaleString("ru-RU")}</p>
            {invitation.url ? (
              <input aria-label="Ссылка приглашения" readOnly value={invitation.url} onFocus={(e) => e.target.select()} className="mt-3 w-full rounded-lg border border-brand-200 bg-white p-2" />
            ) : (
              <p className="mt-2 text-neutral-600">Приглашение действует, но его ссылка не сохранена. Для новой ссылки отмените это приглашение и создайте другое.</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              {invitation.url && <button type="button" onClick={() => void copyInvitation(invitation)} className="text-brand-600 hover:text-brand-700">Скопировать ссылку</button>}
              <button type="button" disabled={revoking !== null} onClick={() => void revokeInvitation(invitation.id)} className="text-red-700 disabled:opacity-50">{revoking === invitation.id ? "Отменяем…" : "Отменить приглашение"}</button>
            </div>
            {invitation.url && (
              <a className="mt-3 block text-brand-600" href={`/admin/mail/new?${new URLSearchParams({ to: invitation.email, subject: "Приглашение на видеоконсультацию", text: `Здравствуйте!\n\nДля видеоконсультации откройте личную ссылку:\n${invitation.url}\n\nПриглашение действует до ${new Date(invitation.expiresAt).toLocaleString("ru-RU")}. После открытия нажмите «Позвонить консультанту».` })}`}>Подготовить письмо</a>
            )}
            {copyStatus?.id === invitation.id && <p role="status" className="mt-2 text-neutral-600">{copyStatus.message}</p>}
          </div>
        ))}
        </div>
      </section>, cardsTarget)}
      <button type="button" disabled={loading} onClick={() => setOpen(!open)} className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-neutral-500 shadow-sm disabled:opacity-50">
        <span className="flex size-8 items-center justify-center rounded-full group-hover:bg-neutral-200"><VideoCallIcon /></span>
        Пригласить на видеозвонок
        {!loading && invitations.length > 0 && (
          <span
            aria-label={`Активных приглашений: ${invitations.length}`}
            className="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-base font-medium text-brand-600"
          >
            {invitations.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full right-0 z-40 mt-2 w-72 rounded-xl border border-brand-100 bg-white p-4 shadow-xl">
          <label className="block text-sm">
            Срок приглашения
            <span className="relative mt-2 block">
              <select value={hours} disabled={busy} onChange={(e) => setHours(e.target.value)} className="block w-full appearance-none rounded-lg border border-brand-200 p-2 pr-12">
                <option value="1">1 час</option>
                <option value="24">24 часа</option>
                <option value="72">3 дня</option>
                <option value="168">7 дней</option>
              </select>
              <FormSelectChevronIcon />
            </span>
          </label>
          <button type="button" disabled={busy} onClick={() => void create()} className="mt-3 rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-50">{busy ? "Создаём…" : "Создать приглашение"}</button>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

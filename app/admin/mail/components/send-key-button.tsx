"use client";

import Link from "next/link";
import { AboutBenefitCheckIcon, AccessKeyIcon, CallWindowCloseIcon } from "@/app/components/svg";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientTier, Invitation } from "../../../../lib/client-area/types";

type Props = { messageId: string; tier?: ClientTier };
const actionClass =
  "rounded-full border border-brand-200 px-5 py-2 text-sm text-neutral-600 hover:bg-brand-50 disabled:opacity-50";
const fieldClass =
  "w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500";

async function action(body: object): Promise<Invitation> {
  const response = await fetch("/api/admin/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Не удалось подготовить приглашение.");
  return result;
}

export default function SendKeyButton({ messageId, tier }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedTier, setSelectedTier] = useState(tier ?? "");
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  async function prepare(value = selectedTier) {
    setOpen(true);
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      setInvitation(
        await action({ action: "prepare", messageId, tier: value }),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось подготовить письмо.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          void prepare();
        }}
        className={actionClass}
      >
        Send Key
      </button>
      {open && (
        <InvitationDialog
          preparing={busy}
          invitation={invitation}
          onChange={setInvitation}
          onClose={() => {
            setOpen(false);
            setInvitation(null);
          }}
        >
          {!invitation && (
            <>
              <h2 className="text-xl font-semibold">Ключ от личной страницы</h2>
              <p className="mt-4 text-base text-neutral-600">
                Выберите пакет клиента. После подготовки письмо отправится
                автоматически через десять секунд.
              </p>
              <label className="mt-5 block text-sm font-medium">
                Пакет
                <span className="relative mt-2 block">
                  <select
                    value={selectedTier}
                    onChange={(event) => setSelectedTier(event.target.value)}
                    className={`${fieldClass} appearance-none pr-12`}
                  >
                    <option value="">Выберите пакет</option>
                    <option>START</option>
                    <option>PRO</option>
                    <option>VIP</option>
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                  >
                    ⌄
                  </span>
                </span>
              </label>
              {error && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={busy || !selectedTier}
                onClick={() => {
                  void prepare();
                }}
                className="mt-5 rounded-xl bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
              >
                {busy ? "Подготавливаем…" : "Подготовить письмо"}
              </button>
            </>
          )}
        </InvitationDialog>
      )}
    </>
  );
}

function InvitationDialog({
  invitation,
  onChange,
  onClose,
  children,
  preparing,
}: {
  invitation: Invitation | null;
  onChange: (invite: Invitation) => void;
  onClose: () => void;
  children: React.ReactNode;
  preparing: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [remaining, setRemaining] = useState(10);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const busyRef = useRef(false);
  const editing = invitation?.status === "draft";

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement)
        previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!invitation || invitation.status !== "scheduled") return;
    let cancelled = false;
    async function tick() {
      if (!invitation || cancelled) return;
      const seconds = Math.max(
        0,
        Math.ceil((new Date(invitation.due_at).getTime() - Date.now()) / 1000),
      );
      setRemaining(seconds);
      if (seconds || busyRef.current) return;
      busyRef.current = true;
      setWorking(true);
      try {
        const result = await action({
          action: "send-invitation",
          id: invitation.id,
        });
        if (!cancelled) {
          onChange(result);
          router.refresh();
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Не удалось отправить письмо.",
          );
          const latest = await action({
            action: "invitation",
            id: invitation.id,
          }).catch(() => null);
          if (latest && !cancelled) onChange(latest);
        }
      } finally {
        busyRef.current = false;
        if (!cancelled) setWorking(false);
      }
    }
    const timer = window.setInterval(() => {
      void tick();
    }, 250);
    void tick();
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [invitation, onChange, router]);

  useEffect(() => {
    if (invitation?.status !== "sending") return;
    const timer = window.setInterval(() => {
      void action({ action: "invitation", id: invitation.id })
        .then(onChange)
        .catch(() => setError("Не удалось обновить статус письма."));
    }, 2000);
    return () => window.clearInterval(timer);
  }, [invitation, onChange]);

  async function pause(close = false) {
    if (preparing) return;
    if (close && invitation?.first_attempt_at) {
      onClose();
      return;
    }
    if (!invitation || invitation.status === "sent" || editing) {
      if (close) onClose();
      return;
    }
    if (busyRef.current || working) return;
    busyRef.current = true;
    setWorking(true);
    setError("");
    try {
      const draft = await action({ action: "pause", id: invitation.id });
      setSubject(draft.subject);
      setBody(draft.body);
      onChange(draft);
      if (close) onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось остановить отправку.",
      );
    } finally {
      busyRef.current = false;
      setWorking(false);
    }
  }

  async function sendEdited() {
    if (!invitation || busyRef.current) return;
    busyRef.current = true;
    setWorking(true);
    setError("");
    try {
      onChange(
        await action({
          action: "send-invitation",
          id: invitation.id,
          subject: subject || invitation.subject,
          body: body || invitation.body,
        }),
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось отправить письмо.",
      );
    } finally {
      busyRef.current = false;
      setWorking(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Приглашение на личную страницу"
      onCancel={(event) => {
        event.preventDefault();
        void pause(true);
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-brand-100 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-brand-950/50 sm:p-8"
    >
      <button
        type="button"
        aria-label="Закрыть"
        disabled={preparing || working || invitation?.status === "sending"}
        onClick={() => void pause(true)}
        className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50"
      >
        <CallWindowCloseIcon className="size-5" />
      </button>
      <div className="pr-10">{children}</div>
      {invitation && (
        <>
          <div className="flex items-start gap-4 pr-10">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${invitation.status === "sent" ? "bg-green-50 text-green-600" : "bg-brand-50 text-brand-500"}`}
            >
              {invitation.status === "sent" ? (
                <AboutBenefitCheckIcon className="size-6" />
              ) : (
                <AccessKeyIcon className="size-6" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight">
                {invitation.status === "sent"
                  ? "Ключ отправлен"
                  : "Приглашение на личную страницу"}
              </h2>
              <p
                role="status"
                className="mt-1 text-sm leading-relaxed text-neutral-500"
              >
                {working || invitation.status === "sending"
                  ? "Отправляем приглашение…"
                  : invitation.status === "scheduled"
                    ? `Автоматическая отправка через ${remaining} с`
                    : editing
                      ? "Автоотправка остановлена. Можно изменить письмо."
                      : "Приглашение отправлено. Копия сохранена в «Отправленных»."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-brand-50/70 px-4 py-3">
            <div className="min-w-0">
              <p className="text-base font-medium">
                Получатель: {invitation.name}
              </p>
              <p className="mt-0.5 break-all text-sm text-neutral-500">
                {invitation.email}
              </p>
            </div>
            {invitation.status === "sent" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Отправлено
              </span>
            )}
          </div>
          {editing ? (
            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-2 text-base">
                <span className="shrink-0 font-medium">Тема:</span>
                <input
                  value={subject || invitation.subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={300}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-normal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300"
                />
              </label>
              <label className="block text-sm font-medium">
                <textarea
                  aria-label="Текст письма"
                  value={body || invitation.body}
                  onChange={(event) => setBody(event.target.value)}
                  maxLength={50000}
                  rows={14}
                  className={`${fieldClass} mt-2`}
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={working}
                  onClick={() => {
                    void sendEdited();
                  }}
                  className="rounded-xl bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
                >
                  Отправить ключ
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => void pause(true)}
                  className="rounded-xl border border-brand-200 px-6 py-3 text-neutral-600 hover:bg-brand-50 disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-brand-100 bg-white">
              <div className="border-b border-brand-100 bg-neutral-50/70 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Письмо клиенту
                </p>
                <h3 className="mt-2 text-base font-semibold leading-snug">
                  {invitation.subject}
                </h3>
              </div>
              <div className="max-h-80 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 text-sm leading-relaxed text-neutral-600 sm:max-h-96">
                {invitation.body.split(/\n\n+/).map((paragraph, index) => {
                  const lines = paragraph.split("\n");
                  const keyLine = lines.find((line) =>
                    /https?:\/\/[^\s]+\/client#/.test(line),
                  );
                  return keyLine ? (
                    <div
                      key={index}
                      className="rounded-xl border border-brand-100 bg-brand-50/70 p-4"
                    >
                      <p className="font-medium text-brand-700">
                        {lines.filter((line) => line !== keyLine).join(" ")}
                      </p>
                      <p className="mt-2 break-all font-mono text-xs leading-relaxed text-brand-600">
                        {keyLine}
                      </p>
                    </div>
                  ) : (
                    <p
                      key={index}
                      className={`whitespace-pre-wrap break-words ${index === 0 ? "font-medium text-brand-950" : ""}`}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
              {invitation.status === "scheduled" &&
                !invitation.first_attempt_at && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => {
                      void pause();
                    }}
                    aria-label="Остановить автоотправку и редактировать письмо"
                    className="absolute inset-0 rounded-2xl transition-colors hover:bg-brand-50/20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"
                  />
                )}
            </div>
          )}
          {invitation.status === "scheduled" &&
            !invitation.first_attempt_at && (
              <p className="mt-3 text-sm text-neutral-500">
                Нажмите на письмо, чтобы остановить отправку и изменить текст.
              </p>
            )}
        </>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {invitation?.status === "sent" && (
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-brand-100 pt-5">
          <Link
            href={`/admin/clients?client=${invitation.client_id}`}
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-600"
          >
            Открыть страницу клиента →
          </Link>
        </div>
      )}
    </dialog>
  );
}

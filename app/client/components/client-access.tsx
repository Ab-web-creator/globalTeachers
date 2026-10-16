"use client";

import Image from "next/image";
import { CopyKeyIcon } from "@/app/components/svg";
import ClientNotifications from "./client-notifications";
import ClientProfilePhoto from "./client-profile-photo";
import { useEffect, useRef, useState } from "react";

export default function ClientAccess({
  authenticated,
  accessLink,
  name = "Клиент",
  hasPhoto = false,
  tier,
  initialUnread = 0,
}: {
  authenticated: boolean;
  accessLink: string | null;
  name?: string;
  hasPhoto?: boolean;
  tier?: "START" | "PRO" | "VIP";
  initialUnread?: number;
}) {
  const started = useRef(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const copyInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const key = window.location.hash.slice(1);
    if (!key || started.current) return;
    started.current = true;
    // Keep the credential out of history, referrers and subsequent copied URLs.
    window.history.replaceState(null, "", "/client");
    const enter = async () => {
      setBusy(true);
      try {
        const response = await fetch("/api/client/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        window.location.replace("/client");
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Не удалось войти. Откройте ссылку из письма ещё раз.",
        );
        setBusy(false);
      }
    };
    void enter();
  }, []);

  async function copyKey() {
    if (!accessLink) return;
    try {
      await navigator.clipboard.writeText(accessLink);
      setCopied(true);
      setManualCopy(false);
    } catch {
      setManualCopy(true);
      window.setTimeout(() => copyInput.current?.select(), 0);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/client/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      if (!response.ok)
        throw new Error("Не удалось выйти. Попробуйте ещё раз.");
      window.location.replace("/client");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось выйти.");
      setBusy(false);
    }
  }

  return (
    <>
      <header className="border-b border-brand-100 bg-white/80 backdrop-blur-lg">
        <nav
          aria-label="Личная страница"
          className="mx-auto flex max-w-400 flex-wrap items-center justify-between gap-3 px-6 py-2 sm:px-10 lg:px-16 xl:px-20"
        >
          <div className="flex items-center gap-3">
            <span className="size-12 shrink-0 overflow-hidden">
              <Image
                src="/images/brand/teacher-navigator-globe.webp"
                alt="TeacherNavigator"
                width={85}
                height={48}
                className="h-12 w-auto max-w-none"
              />
            </span>
            <span className="inline-flex items-center py-1">
              <span data-personal-title className="bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-500 bg-clip-text font-serif text-lg leading-none font-[450] tracking-tight text-transparent sm:text-xl">
                Ваше личное<br />пространство
              </span>
            </span>
          </div>
          {authenticated && (
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <ClientNotifications initialUnread={initialUnread} />
              {accessLink && (
                <button
                  type="button"
                  onClick={() => void copyKey()}
                  className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-2 py-3 text-left text-sm text-brand-600 hover:bg-brand-50"
                >
                  <CopyKeyIcon className="size-5 shrink-0" />
                  {copied ? "Ключ скопирован ✓" : "Скопировать ключ"}
                </button>
              )}
              <ClientProfilePhoto name={name} hasPhoto={hasPhoto} tier={tier} />
              <button
                type="button"
                disabled={busy}
                onClick={() => void logout()}
                className="min-h-11 shrink-0 rounded-xl border border-brand-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-brand-50 disabled:opacity-50"
              >
                {busy ? "Выходим…" : "Выйти"}
              </button>

            </div>
          )}
        </nav>
        <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
          {copied && (
            <p role="status" className="pb-4 text-sm text-brand-600">
              Ссылка скопирована. Сохраните её в надёжном месте и не передавайте
              другим людям.
            </p>
          )}
          {manualCopy && accessLink && (
            <div className="mb-4 max-w-2xl rounded-2xl border border-brand-100 bg-white p-4">
              <label
                htmlFor="private-access-link"
                className="text-sm font-medium"
              >
                Ваша персональная ссылка
              </label>
              <input
                ref={copyInput}
                id="private-access-link"
                readOnly
                autoComplete="off"
                value={accessLink}
                onFocus={(event) => event.target.select()}
                className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500"
              />
              <p className="mt-2 text-sm text-neutral-500">
                Браузер не разрешил автоматическое копирование. Скопируйте
                выделенную ссылку через меню или Ctrl+C / ⌘C.
              </p>
            </div>
          )}
        </div>
      </header>
      {!authenticated && (
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-brand-100 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-semibold">Ваша личная страница</h1>
          <p
            role="status"
            className="mt-7 text-base leading-relaxed text-neutral-600"
          >
            {busy
              ? "Открываем вашу страницу…"
              : "Для входа откройте персональную ссылку из письма «Ваш ключ от личной страницы». Сохраните это письмо — оно понадобится для входа с другого устройства."}
          </p>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="mx-auto my-4 max-w-400 px-6 text-base text-red-700 sm:px-10 lg:px-16 xl:px-20"
        >
          {error}
        </p>
      )}
    </>
  );
}

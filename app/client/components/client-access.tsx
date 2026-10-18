"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import { BrandLogo, CopyKeyIcon } from "@/app/components/svg";
import ClientNotifications from "./client-notifications";
import ClientProfilePhoto from "./client-profile-photo";
import MenuLanguages from "@/app/components/home/menu-languages";
import { useEffect, useRef, useState } from "react";

export default function ClientAccess({
  authenticated,
  accessLink,
  name = "Клиент",
  hasPhoto = false,
  tier,
  initialUnread = 0,
  email,
  paid,
  frozen,
  remainingHours,
  subject,
  country,
}: {
  authenticated: boolean;
  accessLink: string | null;
  name?: string;
  hasPhoto?: boolean;
  tier?: "START" | "PRO" | "VIP";
  initialUnread?: number;
  email?: string;
  paid?: boolean;
  frozen?: boolean;
  remainingHours?: number;
  subject?: string;
  country?: string;
}) {
  const t = useTranslations();
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
      <header className="relative z-30 border-b border-brand-100 bg-white/80 backdrop-blur-lg">
        <nav
          aria-label={t("client.clientAccess.message0053")}
          className="mx-auto flex max-w-400 flex-wrap items-center justify-between gap-3 px-6 py-2 sm:px-10 lg:px-16 xl:px-20"
        >
          <Link href="/" aria-label={t("client.clientAccess.message0054")} className={`shrink-0 ${authenticated ? "hidden sm:block" : ""}`}>
            <BrandLogo className="w-28" aria-hidden="true" />
          </Link>
          {authenticated && (
            <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto sm:gap-3">
              <ClientNotifications initialUnread={initialUnread} />
              {t.content(accessLink && (
                <button
                  type="button"
                  onClick={() => void copyKey()}
                  className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-2 py-3 text-left text-sm text-brand-600 hover:bg-brand-50"
                >
                  <CopyKeyIcon className="size-5 shrink-0" />
                  {t.content(copied ? "Ключ скопирован ✓" : "Ключ")}
                </button>
              ))}
              {/* On phones the profile photo takes the logo's place at the left edge. */}
              <div className="order-first mr-auto sm:order-none sm:mr-0">
                <ClientProfilePhoto name={name} hasPhoto={hasPhoto} tier={tier} email={email} paid={paid} frozen={frozen} remainingHours={remainingHours} subject={subject} country={country} />
              </div>
              <MenuLanguages pill interactive />
              <button
                type="button"
                disabled={busy}
                onClick={() => void logout()}
                className="min-h-11 shrink-0 rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm sm:px-5 font-medium text-neutral-600 hover:bg-brand-50 disabled:opacity-50"
              >
                {t.content(busy ? "Выходим…" : "Выйти")}
              </button>

            </div>
          )}
          {!authenticated && <MenuLanguages pill interactive />}
        </nav>
        <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
          {copied && (
            <p role="status" className="pb-4 text-sm text-brand-600">
              {t("client.clientAccess.message0059")}</p>
          )}
          {t.content(manualCopy && accessLink && (
            <div className="mb-4 max-w-2xl rounded-2xl border border-brand-100 bg-white p-4">
              <label
                htmlFor="private-access-link"
                className="text-sm font-medium"
              >
                {t("client.clientAccess.message0060")}</label>
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
                {t("client.clientAccess.message0061")}</p>
            </div>
          ))}
        </div>
      </header>
      {!authenticated && (
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-brand-100 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-semibold">{t("client.clientAccess.message0062")}</h1>
          <p
            role="status"
            className="mt-7 text-base leading-relaxed text-neutral-600"
          >
            {t.content(busy
              ? "Открываем вашу страницу…"
              : "Для входа откройте персональную ссылку из письма «Ваш ключ от личной страницы». Сохраните эту ссылку — это ваш ключ для входа с любого устройства.")}
          </p>
        </div>
      )}
      {t.content(error && (
        <p
          role="alert"
          className="mx-auto my-4 max-w-400 px-6 text-base text-red-700 sm:px-10 lg:px-16 xl:px-20"
        >
          {t.content(error)}
        </p>
      ))}
    </>
  );
}

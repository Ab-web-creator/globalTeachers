"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { EnvelopeIcon } from "@/app/components/svg";
import LocalTime from "../../components/local-time";
import CopyClientKeyButton from "./copy-client-key-button";
import ApplicationPaymentControl from "../../components/application-payment-control";
import CallClientButton from "./call-client-button";
import DeleteClientButton from "./delete-client-button";
import cardStyles from "../../components/application-card.module.css";
import type { PrivateClient } from "../../../../lib/client-area/types";

export default function ClientWorkspaceShell({ initial, children }: { initial: PrivateClient; children: ReactNode }) {
  const router = useRouter();
  const [selected, setSelected] = useState(initial);
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch(`/api/admin/clients?client=${initial.id}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const workspace = await response.json();
        setSelected(workspace.client);
      } catch { /* The workspace displays connection errors and retries separately. */ }
    }
    const timer = window.setInterval(() => void refresh(), 5000);
    const update = () => void refresh();
    window.addEventListener("client-payment-changed", update);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener("client-payment-changed", update); };
  }, [initial.id]);
  return (
        <article className="space-y-6">
          <div className="relative -mx-5 isolate grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 overflow-hidden border-y border-brand-200 bg-linear-to-r from-sky-200 via-violet-200 to-pink-200 px-5 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:p-6">
            <span aria-hidden="true" className={`${cardStyles.ornament} ${cardStyles.paidOrnament} ${cardStyles.profileOrnament}`} />
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <ClientAvatar key={selected.id} client={selected} />
                <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
              <h2 className="min-w-0 break-words text-[22px] font-semibold">
                {selected.name}
              </h2>
              <div className="hidden sm:block">
                <ApplicationPaymentControl key={`payment-${selected.id}-${selected.tier}-${selected.paid_at}`} clientId={selected.id} paid={Boolean(selected.paid_at)} initialTier={selected.tier} />
              </div>
              </div>
              <p className="mt-1 break-all text-sm text-neutral-500">
                {selected.email} · {selected.tier}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {selected.last_seen_at ? <>Последний визит: <LocalTime value={selected.last_seen_at} /></> : "Ещё не заходил на личную страницу"}
              </p>
                </div>
              </div>
            </div>
            <div className="order-3 flex max-w-full flex-wrap items-center gap-2 pl-15 sm:col-span-2 sm:pl-0 xl:order-none xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:justify-end">
              <div className="sm:hidden">
                <ApplicationPaymentControl roundedMobile key={`mobile-payment-${selected.id}-${selected.tier}-${selected.paid_at}`} clientId={selected.id} paid={Boolean(selected.paid_at)} initialTier={selected.tier} />
              </div>
              {selected.paid_at && <CopyClientKeyButton key={`key-${selected.id}`} clientId={selected.id} />}
              <CallClientButton key={selected.id} clientId={selected.id} />
              <Link href={`/admin/mail/new?${new URLSearchParams({ to: selected.email })}`} aria-label={`Написать сообщение: ${selected.name}`} title="Сообщение" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-neutral-700 sm:size-10 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"><EnvelopeIcon className="size-5" strokeWidth={1.3} /></Link>
              <DeleteClientButton clientId={selected.id} name={selected.name} onDeleted={() => router.replace("/admin/clients")} className="size-9 border border-brand-200 bg-white sm:size-10" />
            </div>
          </div>
          {children}
        </article>
  );
}

function ClientAvatar({ client }: { client: PrivateClient }) {
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 5000);
    const initial = window.setTimeout(update, 0);
    return () => { window.clearInterval(timer); window.clearTimeout(initial); };
  }, []);
  const online = client.active && now > 0 && Boolean(client.last_seen_at) && new Date(client.last_seen_at!).getTime() > now - 20_000;
  const status = online ? "В сети" : "Не в сети";
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-linear-to-br from-violet-200 via-pink-100 to-amber-100 text-brand-600 shadow-sm sm:size-16">
      <span className="absolute inset-0 overflow-hidden rounded-full">
      {client.has_profile_photo && !failed ? (
        <Image src={`/api/admin/clients/photo?client=${client.id}`} alt={`Фото ${client.name}`} fill sizes="(min-width: 640px) 64px, 48px" unoptimized onError={() => setFailed(true)} className="object-cover" />
      ) : <Image src="/images/client/default-male-avatar.png" alt="Аватар по умолчанию" fill sizes="(min-width: 640px) 64px, 48px" className="object-cover" />}
      </span>
      <span aria-label={status} className={`absolute bottom-0 right-0 size-4 rounded-full border-2 border-white shadow-sm ${online ? "bg-emerald-500" : "bg-neutral-300"}`} title={status} />
    </span>
  );
}


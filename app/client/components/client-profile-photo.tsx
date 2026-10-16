"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import {
  ProfilePhotoIcon,
  FormSelectChevronIcon,
} from "@/app/components/svg";

export default function ClientProfilePhoto({
  name,
  hasPhoto,
  tier,
}: {
  name: string;
  hasPhoto: boolean;
  tier?: "START" | "PRO" | "VIP";
}) {
  const [photo, setPhoto] = useState(
    hasPhoto ? "/api/client/profile-photo" : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 2 * 1024 * 1024) {
      setError("Выберите фото до 2 МБ.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/client/profile-photo", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setPhoto(`/api/client/profile-photo?v=${Date.now()}`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось загрузить фото.",
      );
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  return (
    <div className="relative shrink-0">
      <details
        className="group relative"
        onKeyDown={(event) => {
          if (event.key === "Escape") event.currentTarget.open = false;
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            event.currentTarget.open = false;
        }}
      >
        <summary
          aria-label="Профиль"
          className="flex cursor-pointer list-none items-center gap-2 rounded-full p-1 text-brand-700 hover:bg-brand-50 focus-visible:-outline-offset-2 [&::-webkit-details-marker]:hidden"
        >
          <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-full border border-brand-200 bg-brand-50">
            {photo ? (
              <Image
                src={photo}
                alt={`Фото ${name}`}
                fill
                sizes="44px"
                unoptimized
                className="object-cover"
                onError={() => setPhoto("")}
              />
            ) : (
              <Image src="/images/client/default-male-avatar.png" alt="Портрет мужчины" fill sizes="44px" className="object-cover" />
            )}
          </span>
          <FormSelectChevronIcon className="mr-1 size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute top-full right-0 z-40 mt-3 w-60 rounded-2xl border border-brand-100 bg-white p-3 shadow-lg">
          <div className="flex items-center gap-2 px-2 py-2">
            <p className="min-w-0 break-words text-sm font-semibold">{name}</p>
            {tier && <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600">{tier}</span>}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-3 text-left text-sm text-brand-600 hover:bg-brand-50 disabled:opacity-50"
          >
            <ProfilePhotoIcon className="size-5" />
            {busy ? "Загружаем…" : "Изменить фото"}
          </button>
        </div>
      </details>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void upload(event)}
        className="sr-only"
        tabIndex={-1}
      />
      {error && (
        <p
          role="alert"
          className="absolute top-full right-0 z-40 mt-3 w-56 rounded-xl bg-white p-2 text-center text-xs text-red-700 shadow-sm"
        >
          {error}
        </p>
      )}
    </div>
  );
}

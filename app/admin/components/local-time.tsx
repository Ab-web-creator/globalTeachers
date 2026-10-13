"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  adminTimeZoneCookie,
  dateInTimeZone,
  validTimeZone,
} from "../../../lib/admin/timezone";

function subscribe(listener: () => void) {
  window.addEventListener("focus", listener);
  document.addEventListener("visibilitychange", listener);
  return () => {
    window.removeEventListener("focus", listener);
    document.removeEventListener("visibilitychange", listener);
  };
}
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const serverZone = () => "UTC";

export function AdminTimeZoneSync({ serverTimeZone }: { serverTimeZone: string }) {
  const timeZone = useSyncExternalStore(subscribe, browserZone, serverZone);
  const router = useRouter();
  useEffect(() => {
    const detected = browserZone();
    const preference = `${adminTimeZoneCookie}=${encodeURIComponent(detected)}`;
    if (document.cookie.split("; ").includes(preference) && validTimeZone(serverTimeZone) === validTimeZone(detected)) return;
    document.cookie = `${preference}; Path=/admin; Max-Age=31536000; SameSite=Strict${location.protocol === "https:" ? "; Secure" : ""}`;
    if (document.cookie.split("; ").includes(preference)) router.refresh();
  }, [timeZone, serverTimeZone, router]);
  return null;
}

export default function LocalTime({
  value,
  className,
  compact = false,
  seconds = false,
}: {
  value: string;
  className?: string;
  compact?: boolean;
  seconds?: boolean;
}) {
  const timeZone = useSyncExternalStore(subscribe, browserZone, serverZone);
  const date = new Date(value);
  const today =
    dateInTimeZone(new Date(), timeZone) === dateInTimeZone(date, timeZone);
  const options: Intl.DateTimeFormatOptions = compact
    ? today
      ? { timeStyle: "short" }
      : { day: "numeric", month: "short" }
    : { dateStyle: "medium", timeStyle: seconds ? "medium" : "short" };
  return (
    <time dateTime={value} className={className} title={timeZone}>
      {new Intl.DateTimeFormat("ru-RU", { ...options, timeZone }).format(date)}
    </time>
  );
}

import { useEffect, useRef, useState } from "react";
import type { PaymentProfile } from "../../../lib/payment/profile";

type Identity = { id: string; token: string; revision: number };
export default function usePaymentCase(
  email: string,
  profile: PaymentProfile,
  tier: string,
) {
  const identities = useRef(new Map<string, Identity>());
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !profile.name.trim()) return;
    let stopped = false;
    async function save() {
      const storageKey = `tn-payment-case:${normalized}`;
      let identity = identities.current.get(normalized);
      if (!identity) {
        try {
          const stored = JSON.parse(
            sessionStorage.getItem(storageKey) ?? "null",
          );
          const uuid = /^[a-f0-9-]{36}$/i;
          if (
            stored &&
            uuid.test(stored.id) &&
            uuid.test(stored.token) &&
            Number.isSafeInteger(stored.revision)
          )
            identity = stored;
        } catch {}
        identity ??= {
          id: crypto.randomUUID(),
          token: crypto.randomUUID(),
          revision: 0,
        };
        identities.current.set(normalized, identity);
      }
      identity.revision += 1;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(identity));
      } catch {}
      try {
        const response = await fetch("/api/payment/case", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            email: normalized,
            tier,
            profile: { name: profile.name, subject: profile.subject, english: profile.english },
            draft: { id: identity.id, token: identity.token },
            revision: identity.revision,
          }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Не удалось сохранить заявку.");
        if (!stopped) setError("");
      } catch (cause) {
        if (!stopped)
          setError(
            cause instanceof Error
              ? cause.message
              : "Не удалось сохранить заявку.",
          );
      }
    }
    const timer = window.setTimeout(() => void save(), 600);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [email, profile, tier, retry]);
  return {
    error,
    retry: () => setRetry((value) => value + 1),
    getCaseId: (address: string) =>
      identities.current.get(address.trim().toLowerCase())?.id,
  };
}

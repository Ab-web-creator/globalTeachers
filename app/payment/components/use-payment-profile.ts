import { useEffect, useRef, useState } from "react";
import type { PaymentProfile } from "../../../lib/payment/profile";

const emptyProfile: PaymentProfile = {
  name: "",
  subject: "",
  education: "",
  english: "",
};

export default function usePaymentProfile() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [status, setStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const operationRef = useRef(0);
  const requestRef = useRef<AbortController | null>(null);
  const editsRef = useRef(new Set<keyof PaymentProfile>());
  const loadedRef = useRef(false);
  const checkedEmailRef = useRef("");
  const verificationDraftRef = useRef<string | undefined>(undefined);

  useEffect(() => () => requestRef.current?.abort(), []);

  function changeEmail(value: string) {
    if (value.trim().toLowerCase() === email.trim().toLowerCase()) {
      setEmail(value);
      return;
    }
    operationRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    checkedEmailRef.current = "";
    verificationDraftRef.current = undefined;
    if (loadedRef.current) {
      setProfile(
        (current) =>
          Object.fromEntries(
            Object.entries(current).map(([key, field]) => [
              key,
              editsRef.current.has(key as keyof PaymentProfile) ? field : "",
            ]),
          ) as PaymentProfile,
      );
      loadedRef.current = false;
    }
    setEmail(value);
    setStatus("");
    setChallenge("");
    setDialogOpen(false);
    setBusy(false);
    setError("");
  }

  function changeField(name: keyof PaymentProfile, value: string) {
    editsRef.current.add(name);
    setProfile((current) => ({ ...current, [name]: value }));
  }

  async function post(body: object) {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const response = await fetch("/api/payment/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json();
    if (controller.signal.aborted)
      throw new DOMException("Aborted", "AbortError");
    if (!response.ok)
      throw new Error(data.error || "Не удалось загрузить данные.");
    return data;
  }

  async function sendCode(address = email) {
    if (busy) return;
    const operation = ++operationRef.current;
    setBusy(true);
    setError("");
    setChallenge("");
    try {
      const data = await post({
        action: "request",
        email: address.trim().toLowerCase(),
      });
      if (data.exists === false) {
        setDialogOpen(false);
        setStatus("");
        return;
      }
      setChallenge(data.challenge);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError(
        cause instanceof Error ? cause.message : "Не удалось отправить код.",
      );
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  }

  async function lookup(address = email, excludeDraftId?: string) {
    const normalized = address.trim().toLowerCase();
    if (
      busy ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ||
      normalized === checkedEmailRef.current
    )
      return;
    const operation = ++operationRef.current;
    checkedEmailRef.current = normalized;
    verificationDraftRef.current = excludeDraftId;
    setBusy(true);
    setStatus("");
    try {
      const data = await post({
        action: "check",
        email: normalized,
        excludeDraftId,
      });
      if (operation !== operationRef.current) return;
      setStatus("");
      if (data.exists) {
        setDialogOpen(true);
        const invitation = await post({ action: "request", email: normalized, excludeDraftId });
        if (operation !== operationRef.current) return;
        if (invitation.exists === false) setDialogOpen(false);
        else setChallenge(invitation.challenge);
      } else {
        setDialogOpen(false);
        setStatus("");
      }
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      if (operation !== operationRef.current) return;
      checkedEmailRef.current = "";
      setError(cause instanceof Error ? cause.message : "Не удалось отправить код.");
      setStatus(
        cause instanceof Error
          ? cause.message
          : "Не удалось проверить email. Заполните поля вручную.",
      );
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  }

  function changeVerificationEmail(value: string) {
    changeEmail(value);
    void lookup(value);
  }

  function closeDialog() {
    operationRef.current += 1;
    requestRef.current?.abort();
    setBusy(false);
    setDialogOpen(false);
    setError("");
  }

  async function verify(code: string) {
    if (busy || !challenge) return;
    const operation = ++operationRef.current;
    setBusy(true);
    setError("");
    try {
      const data = await post({ action: "verify", challenge, code, excludeDraftId: verificationDraftRef.current });
      if (operation !== operationRef.current) return;
      if (data.profile) {
        const saved = data.profile as PaymentProfile;
        loadedRef.current = true;
        setProfile(
          (current) =>
            Object.fromEntries(
              Object.entries(saved).map(([key, value]) => [
                key,
                editsRef.current.has(key as keyof PaymentProfile) && current[key as keyof PaymentProfile].trim()
                  ? current[key as keyof PaymentProfile]
                  : value,
              ]),
            ) as PaymentProfile,
        );
        setStatus(
          "Email подтверждён. Ваше имя заполнено автоматически. Вы можете его изменить.",
        );
      } else setStatus("Email подтверждён.");
      setChallenge("");
      setDialogOpen(false);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError(
        cause instanceof Error ? cause.message : "Не удалось проверить код.",
      );
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  }

  return {
    email,
    profile,
    status,
    changeEmail,
    changeField,
    lookup,
    verification: {
      dialogOpen,
      email,
      busy,
      error,
      ready: Boolean(challenge),
      sendCode,
      verify,
      closeDialog,
      changeVerificationEmail,
    },
  };
}

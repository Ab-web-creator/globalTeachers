"use client";

import { createContext, createElement, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { Language } from "./translate";
import { isLanguage } from "./languages";

export type { Language } from "./translate";
export const languageCookie = "teachernavigator-language";
const changeEvent = "teachernavigator-language-change";
const InitialLanguage = createContext<Language>("ru");
let currentLanguage: Language | undefined;

export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  return createElement(InitialLanguage.Provider, { value: language }, children);
}

function snapshot(): Language | undefined {
  if (currentLanguage) return currentLanguage;
  const cookie = document.cookie.split("; ").find(value => value.startsWith(`${languageCookie}=`))?.split("=")[1];
  if (isLanguage(cookie)) return cookie;
  try {
    const saved = window.localStorage.getItem(languageCookie);
    if (isLanguage(saved)) return saved;
  } catch {
    // Language selection also works when browser storage is unavailable.
  }
}

function subscribe(notify: () => void) {
  const onStorage = () => { currentLanguage = undefined; notify(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, notify);
  };
}

function selectLanguage(language: Language) {
  currentLanguage = language;
  document.cookie = `${languageCookie}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  try {
    window.localStorage.setItem(languageCookie, language);
  } catch {
    // The cookie still remembers the selection.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useLanguage() {
  const initial = useContext(InitialLanguage);
  const language = useSyncExternalStore(subscribe, snapshot, () => initial) ?? initial;
  return { language, selectLanguage };
}

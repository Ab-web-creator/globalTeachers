import "server-only";
import { cookies } from "next/headers";
import { createTranslator, type Language } from "./translate";
import type { Metadata } from "next";
import { isLanguage } from "./languages";

export async function getLanguage(): Promise<Language> {
  const language = (await cookies()).get("teachernavigator-language")?.value;
  return isLanguage(language) ? language : "ru";
}

export async function getTranslations() {
  return createTranslator(await getLanguage());
}

export async function translateMetadata(metadata: Metadata): Promise<Metadata> {
  const t = await getTranslations();
  const title = typeof metadata.title === "string"
    ? metadata.title.replace(/^(.*?) — TeacherNavigator$/, (_, name: string) => `${t.content(name)} — TeacherNavigator`)
    : metadata.title;
  return {
    ...metadata,
    title: typeof title === "string" ? t.content(title) : title,
    description: metadata.description ? t.content(metadata.description) : metadata.description,
  };
}

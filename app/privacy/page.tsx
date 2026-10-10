import type { Metadata } from "next";
import LegalDocument from "../legal/components/legal-document";
import { privacyDocument } from "../legal/privacy-content";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — TeacherNavigator",
  description: privacyDocument.description,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalDocument document={privacyDocument} />;
}

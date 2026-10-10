import type { Metadata } from "next";
import LegalDocument from "../legal/components/legal-document";
import { termsDocument } from "../legal/terms-content";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — TeacherNavigator",
  description: termsDocument.description,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalDocument document={termsDocument} />;
}

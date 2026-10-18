import { translateMetadata } from "@/lib/i18n/server";
import LegalDocument from "../legal/components/legal-document";
import { termsDocument } from "../legal/terms-content";

export async function generateMetadata() {
  return translateMetadata({
    title: "Пользовательское соглашение — TeacherNavigator",
    description: termsDocument.description,
    robots: { index: false, follow: true },
  });
}

export default function TermsPage() {
  return <LegalDocument document={termsDocument} />;
}

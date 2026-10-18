import { translateMetadata } from "@/lib/i18n/server";
import LegalDocument from "../legal/components/legal-document";
import { privacyDocument } from "../legal/privacy-content";

export async function generateMetadata() {
  return translateMetadata({
    title: "Политика конфиденциальности — TeacherNavigator",
    description: privacyDocument.description,
    robots: { index: false, follow: true },
  });
}

export default function PrivacyPage() {
  return <LegalDocument document={privacyDocument} />;
}

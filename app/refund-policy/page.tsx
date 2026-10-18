import { translateMetadata } from "@/lib/i18n/server";
import LegalDocument from "../legal/components/legal-document";
import { refundDocument } from "../legal/refund-content";

export async function generateMetadata() {
  return translateMetadata({
    title: "Условия оказания услуг и политика возврата средств — TeacherNavigator",
    description: "Условия оказания услуг, отмены и возврата средств по пакетам TeacherNavigator.",
    robots: { index: false, follow: true },
  });
}

export default function RefundPolicyPage() {
  return <LegalDocument document={refundDocument} />;
}

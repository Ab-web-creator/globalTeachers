import { translateMetadata } from "@/lib/i18n/server";
import PageHeader from "../../components/page-header";
import ConfirmationResult from "./confirmation-result";

export async function generateMetadata() {
  return translateMetadata({
    title: "Подтверждение email — TeacherNavigator",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  });
}

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-brand-700 sm:bg-brand-50">
      <PageHeader inFlow />
      <main className="flex flex-1 items-center justify-center sm:px-6 sm:py-12">
        <ConfirmationResult />
      </main>
    </div>
  );
}

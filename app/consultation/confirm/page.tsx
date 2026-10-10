import type { Metadata } from "next";
import PageHeader from "../../components/page-header";
import ConfirmationResult from "./confirmation-result";

export const metadata: Metadata = {
  title: "Подтверждение email — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 text-brand-700">
      <PageHeader inFlow />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <ConfirmationResult />
      </main>
    </div>
  );
}

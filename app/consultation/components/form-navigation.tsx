import { consultationSteps } from "./consultation-steps";

type FormNavigationProps = {
  step: number;
  sending: boolean;
  onBack: () => void;
};

export default function FormNavigation({ step, sending, onBack }: FormNavigationProps) {
  return (
    <div className="flex shrink-0 gap-3 pt-6">
      {step > 0 && <button type="button" onClick={onBack} className="rounded-xl border border-brand-200 px-4 py-3 text-sm hover:bg-brand-50">Назад</button>}
      <button type="submit" className="action-gradient flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium text-white focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-brand-500">
        {sending ? "Отправляем…" : step < consultationSteps.length - 1 ? "Далее" : "Отправить заявку"}
      </button>
    </div>
  );
}

import { useEffect, useRef } from "react";

type Props = { email: string; onNew: () => void; onClose: () => void };

export default function SubmissionSuccess({ email, onNew, onClose }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div role="dialog" aria-labelledby="verification-heading" className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white px-4 py-8 lg:absolute lg:rounded-3xl lg:p-8 xl:p-10">
      <div className="my-auto py-8">
        <h2 ref={heading} tabIndex={-1} id="verification-heading" className="text-2xl font-semibold outline-none">Подтвердите ваш email</h2>
        <p className="mt-7 text-base leading-relaxed">Мы отправили письмо на <strong className="break-all">{email}</strong>. Откройте его и перейдите по ссылке, чтобы подтвердить email и завершить отправку заявки.</p>
        <p className="mt-6 text-sm leading-relaxed text-neutral-500">Если письма нет, проверьте папку «Спам». Ссылка действительна 24 часа.</p>
        <p className="mt-7 text-sm leading-relaxed text-neutral-600">Если вы неправильно указали свой email, вам нужно <button type="button" onClick={onNew} className="text-brand-600 underline underline-offset-4 hover:text-brand-800">заполнить анкету заново</button>.</p>
      </div>
      <button type="button" onClick={onClose} className="action-gradient mt-auto min-h-12 w-full shrink-0 rounded-xl px-4 py-3 font-medium text-white">Закрыть</button>
      <p className="flex items-start gap-2 pt-8 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ваши данные используются только для рассмотрения заявки и связи с вами.</p>
    </div>
  );
}

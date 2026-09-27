export default function EmailPending({ email, onEdit }: { email: string; onEdit: () => void }) {
  return (
    <div role="status" className="space-y-5 py-8">
      <h2 id="form-heading" className="text-2xl font-semibold">Подтвердите ваш email</h2>
      <p className="leading-relaxed">Мы отправили письмо на <strong className="break-all">{email}</strong>. Откройте его и перейдите по ссылке, чтобы подтвердить email и завершить отправку заявки.</p>
      <p className="text-sm leading-relaxed text-neutral-500">Если письма нет, проверьте папку «Спам». Ссылка действительна 24 часа.</p>
      <button type="button" onClick={onEdit} className="text-brand-600 underline">Изменить email или отправить письмо повторно</button>
    </div>
  );
}

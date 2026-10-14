export default function AdminLogin({ configured, failed, next }: { configured: boolean; failed: boolean; next: string | null }) {
  return (
    <section className="mx-auto mt-12 max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">TeacherNavigator / Администратор</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">Добро пожаловать</h1>
      <p className="mt-7 text-lg leading-relaxed text-neutral-500">Войдите, чтобы управлять заявками, читать почту и следить за посещаемостью сайта.</p>
      {!configured ? <p role="status" className="mt-6 text-lg">Для доступа задайте ADMIN_PASSWORD (не менее 16 символов) и ADMIN_SESSION_SECRET в настройках сервера.</p> : (
        <form action="/admin/login" method="post" className="mt-6 space-y-4">
          {next && <input type="hidden" name="next" value={next} />}
          <label className="block text-lg font-medium" htmlFor="admin-password">Пароль
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 text-base" />
          </label>
          {failed && <p role="alert" className="text-lg text-red-700">Неверный пароль. Попробуйте ещё раз.</p>}
          <button className="w-full rounded-xl bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">Войти</button>
        </form>
      )}
    </section>
  );
}

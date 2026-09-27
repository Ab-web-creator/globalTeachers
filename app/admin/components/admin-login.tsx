export default function AdminLogin({ configured, failed }: { configured: boolean; failed: boolean }) {
  return (
    <section className="mx-auto mt-12 max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Вход для администратора</h1>
      <p className="mt-3 text-sm text-neutral-500">Заявки доступны только администратору сайта.</p>
      {!configured ? <p role="status" className="mt-6 text-sm">Для доступа задайте ADMIN_PASSWORD (не менее 16 символов) и ADMIN_SESSION_SECRET в настройках сервера.</p> : (
        <form action="/admin/login" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium" htmlFor="admin-password">Пароль
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3" />
          </label>
          {failed && <p role="alert" className="text-sm text-red-700">Неверный пароль. Попробуйте ещё раз.</p>}
          <button className="w-full rounded-xl bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">Войти</button>
        </form>
      )}
    </section>
  );
}

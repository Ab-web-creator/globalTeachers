"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeleteApplicationIcon, FileUploadIcon, SearchIcon, StrokeIcon, programIconPaths } from "@/app/components/svg";
import NewFileFolderDialog from "./new-file-folder-dialog";
import styles from "./client-files.module.css";
import FormSelect from "../../consultation/components/form-select";
import LocalTime from "../../admin/components/local-time";

type SharedFile = { id: string; folder_id: string | null; author: "admin" | "client"; name: string; content_type: string; size: number; created_at: string };
type Folder = { id: string; name: string };

export default function ClientFiles({ clientId, admin, writable }: { clientId: string; admin: boolean; writable: boolean }) {
  const t = useTranslations();
  const [data, setData] = useState<{ files: SharedFile[]; folders: Folder[] }>({ files: [], folders: [] });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [uploader, setUploader] = useState("all");
  const [type, setType] = useState("all");
  const [newFolder, setNewFolder] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const refreshVersion = useRef(0);
  const base = `/api/client-files${admin ? `?client=${clientId}` : ""}`;
  const url = useCallback((params: Record<string, string>) => `${base}${base.includes("?") ? "&" : "?"}${new URLSearchParams(params)}`, [base]);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    const version = ++refreshVersion.current;
    const response = await fetch(base, { cache: "no-store", signal });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    if (version === refreshVersion.current) { setData(result); setLoaded(true); }
  }, [base]);
  useEffect(() => {
    const controller = new AbortController();
    const load = () => { if (document.visibilityState === "visible") void refresh(controller.signal).catch(cause => { if (!controller.signal.aborted) setError(cause.message); }); };
    load(); const timer = window.setInterval(load, 15000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [refresh]);

  async function mutate(action: string, body: object) {
    const response = await fetch(url({ action }), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    await refresh();
  }
  async function run(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError("");
    try { await task(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось выполнить действие."); }
    finally { setBusy(false); }
  }
  async function uploadFiles(files: FileList) {
    await run(async () => {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name}: размер файла — не более 10 МБ.`);
        const response = await fetch(url({ action: "upload", name: file.name, ...(tab !== "all" ? { folder: tab } : {}) }), { method: "POST", body: file });
        const result = await response.json();
        if (!response.ok) throw new Error(`${file.name}: ${result.error}`);
        refreshVersion.current += 1;
        setData(current => ({ ...current, files: [result.file, ...current.files.filter(item => item.id !== result.file.id)] }));
        setLoaded(true);
        setQuery("");
        setType("all");
        setUploader("all");
      }
    });
    if (upload.current) upload.current.value = "";
  }
  const files = data.files.filter(file => (tab === "all" || tab === file.folder_id) && (uploader === "all" || uploader === file.author) && file.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && (type === "all" || (type === "image" ? file.content_type.startsWith("image/") : type === "pdf" ? file.content_type === "application/pdf" : file.name.toLowerCase().endsWith(".doc") || file.name.toLowerCase().endsWith(".docx"))));
  const tabs = [{ id: "all", name: t("client.clientFiles.message0067") }, ...data.folders];
  return (
    <section aria-labelledby="client-files-title" className={`@container mt-8 min-w-0 border-brand-200 bg-white p-4 sm:p-6 ${admin ? "-mx-5 relative border-t-0 pt-12 before:absolute before:inset-x-0 before:top-0 before:h-2 before:bg-linear-to-r before:from-sky-200 before:via-violet-200 before:to-pink-200 sm:mx-0 sm:max-w-full sm:rounded-3xl sm:border sm:border-brand-100 sm:shadow-sm sm:before:hidden" : "max-w-full rounded-2xl border"}`}>
      <header className="relative flex flex-wrap items-start justify-between gap-4">
        <button type="button" aria-label={t("client.clientFiles.message0068")} title={t("client.clientFiles.message0068")} disabled={!writable || busy} onClick={() => upload.current?.click()} className="absolute right-0 top-2 flex size-9 items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300 disabled:opacity-50 sm:hidden"><FileUploadIcon /></button>
        <div className="min-w-0 flex-1 sm:flex-initial"><div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><h2 id="client-files-title" className="pr-11 text-xl font-semibold sm:pr-0">{t("client.clientFiles.message0069")}</h2>          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded text-xl font-semibold text-brand-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 [&::-webkit-details-marker]:hidden">
              {t.content(uploader === "all" ? "от админа и клиента" : uploader === "admin" ? "от админа" : "от клиента")}
            </summary>
            <div className="absolute left-0 top-full z-20 mt-2 min-w-36 rounded-xl border border-brand-200 bg-white p-1 shadow-lg">
              {[{ value: "all", label: "от админа и клиента" }, { value: "admin", label: "только от админа" }, { value: "client", label: "только от клиента" }].map(option => (
                <button key={option.value} type="button" aria-pressed={uploader === option.value} onClick={event => { setUploader(option.value); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-50 focus-visible:-outline-offset-2 ${uploader === option.value ? "bg-brand-50 text-brand-600" : "text-neutral-600"}`}>{t.content(option.label)}</button>
              ))}
            </div>
          </details></div><p className="mt-2 text-sm text-neutral-500">{t("client.clientFiles.message0075")}{" "}{t.content(admin ? "этого клиента" : "Admin")}.</p></div>
        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-3 xl:w-auto xl:flex-1">

        <div className="relative w-full min-w-0 lg:max-w-[350px] lg:flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" aria-label={t("client.clientFiles.message0077")} placeholder={t("client.clientFiles.message0078")} value={query} onChange={event => setQuery(event.target.value)} className="w-full min-w-0 rounded-full border border-brand-200 bg-white py-1.5 pl-10 pr-4 text-base text-neutral-700 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500 lg:text-sm" />
        </div>
        </div>
      </header>
      {admin && newFolder && <NewFileFolderDialog onCreate={name => mutate("folder", { name })} onClose={() => setNewFolder(false)} />}
      <nav aria-label={t("client.clientFiles.message0079")} className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-200 pt-4 pb-2">
        {tabs.map(folder => <button key={folder.id} type="button" aria-pressed={tab === folder.id} onClick={() => setTab(folder.id)} className={`inline-flex min-w-0 max-w-full items-center gap-2 border-b border-l pl-3 pr-0 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 ${tab === folder.id ? "border-brand-200 text-brand-500" : "border-neutral-200 text-neutral-600 hover:border-brand-300 hover:text-brand-600"}`}><StrokeIcon path={tab === folder.id ? programIconPaths.openFolder : programIconPaths.folder} className="size-6 shrink-0" /><span className="min-w-0 break-words">{folder.name}</span></button>)}
        <details className="group relative self-center border-l border-neutral-200 pl-4">
          <summary aria-label={t("client.clientFiles.message0080")} className="flex cursor-pointer list-none items-center rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 [&::-webkit-details-marker]:hidden">
            {t.content(type === "all" ? "Все типы" : type === "pdf" ? "PDF" : type === "word" ? "Word" : "Изображения")}
          </summary>
          <div className="absolute left-4 top-full z-20 mt-2 min-w-40 rounded-xl border border-brand-200 bg-white p-1 shadow-lg">
            {[{ value: "all", label: "Все типы" }, { value: "pdf", label: "PDF" }, { value: "word", label: "Word" }, { value: "image", label: "Изображения" }].map(option => (
              <button key={option.value} type="button" aria-pressed={type === option.value} onClick={event => { setType(option.value); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-50 focus-visible:-outline-offset-2 ${type === option.value ? "bg-brand-50 text-brand-600" : "text-neutral-600"}`}>{t.content(option.label)}</button>
            ))}
          </div>
        </details>
        <div className="ml-auto flex flex-wrap items-center gap-2 self-center">
          <button type="button" disabled={!writable || busy} onClick={() => upload.current?.click()} className="hidden h-10 items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 sm:inline-flex">{t.content(busy ? "Подождите…" : "Загрузить файлы")}</button>
          {admin && <button type="button" onClick={() => setNewFolder(true)} className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-200 px-4 text-sm font-medium hover:bg-brand-50"><span className="sm:hidden">{t("client.clientFiles.message0084")}</span><span className="hidden sm:inline">{t("client.clientFiles.message0085")}</span></button>}
        </div>
      </nav>
      <div>
        <input ref={upload} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={event => { if (event.target.files?.length) void uploadFiles(event.target.files); }} />
      </div>
      {t.content(error && <p role="alert" className="mt-3 text-sm text-red-600">{t.content(error)}</p>)}
      <div className={`${styles.fileList} mt-5 min-w-0 max-w-full overflow-hidden rounded-xl border border-brand-100`}>
        <table className={`${styles.table} text-left text-sm`}><thead className="bg-brand-50 text-neutral-500"><tr><th className="px-4 py-3 font-medium">{t("client.clientFiles.message0086")}</th><th className="px-4 py-3 font-medium">{t("client.clientFiles.message0087")}</th><th className="px-4 py-3 font-medium">{t("client.clientFiles.message0088")}</th><th className="px-4 py-3 font-medium">{t("client.clientFiles.message0089")}</th><th className="px-4 py-3 font-medium">{t("client.clientFiles.message0090")}</th><th className="px-4 py-3 font-medium"><span className="sr-only">{t("client.clientFiles.message0091")}</span></th></tr></thead>
          <tbody className="divide-y divide-brand-100">{files.map(file => <tr key={file.id}>
            <td data-label="Название" className="px-4 py-3"><div className="flex items-start gap-2"><StrokeIcon path={programIconPaths.document} className="mt-0.5 size-5 shrink-0 text-brand-500" /><div className="flex min-w-0 flex-1 items-start justify-between gap-2"><a href={url({ file: file.id, view: "1" })} target="_blank" rel="noreferrer" className="break-all font-medium text-brand-600 hover:underline">{file.name}</a><span className={`${styles.uploaderBadge} shrink-0 rounded-full px-2 py-1 text-xs font-medium ${file.author === "admin" ? "bg-violet-50 text-brand-600" : "bg-sky-50 text-sky-700"}`}>{t.content(file.author === "admin" ? "Admin" : "Клиент")}</span></div></div></td>
            <td data-label="Загрузил" className="px-4 py-3 text-neutral-600">{t.content(file.author === "admin" ? "Admin" : "Клиент")}</td>
            <td data-label="Дата" className="px-4 py-3 text-sm text-neutral-600"><LocalTime value={file.created_at} /></td>
            <td data-label="Размер" className="px-4 py-3 text-sm text-neutral-600">{t.content(file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} КБ` : `${(file.size / 1024 / 1024).toFixed(1)} МБ`)}</td>
            <td data-label="Папка" className="px-4 py-3">
              {admin ? (
                <FormSelect
                  wrapperClassName=""
                  aria-label={t.content(`Папка для ${file.name}`)}
                  disabled={busy}
                  value={file.folder_id ?? ""}
                  onChange={event => void run(() => mutate("move", { id: file.id, folder: event.target.value || null }))}
                  className="w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white py-1 pl-2 text-base leading-tight text-neutral-600 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500 lg:text-sm"
                >
                  <option value="">{t("client.clientFiles.message0095")}</option>
                  {data.folders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                </FormSelect>
              ) : <span className="text-neutral-500">{t.content(data.folders.find(folder => folder.id === file.folder_id)?.name ?? "Без папки")}</span>}
            </td>
            <td className="px-4 py-3"><div className="flex flex-wrap items-center justify-end gap-3"><a href={url({ file: file.id })} className="text-brand-600 hover:underline">{t("client.clientFiles.message0096")}</a>{(admin || file.author === "client") && writable && <button type="button" disabled={busy} aria-label={t.content(`Удалить ${file.name}`)} title={t("client.clientFiles.message0098")} onClick={() => { if (window.confirm(t.content(`Удалить файл «${file.name}» у вас и ${admin ? "клиента" : "Admin"}?`))) void run(() => mutate("delete", { id: file.id })); }} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600"><DeleteApplicationIcon className="size-4" /></button>}</div></td>
          </tr>)}{!files.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-neutral-500"><StrokeIcon path={programIconPaths.folder} className="mx-auto mb-3 size-7 text-brand-300" />{t.content(!loaded ? "Загружаем файлы…" : query || type !== "all" ? "По вашему запросу ничего не найдено." : "В этой папке пока нет файлов.")}</td></tr>}</tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs leading-relaxed text-neutral-500">
        <span className="shrink-0">{t("client.clientFiles.message0104")}{" "}{files.length} {" "}{t("client.clientFiles.message0105")}{" "}{data.files.length}</span>
        <p className="min-w-0 flex-1 basis-64">{t("client.clientFiles.message0106")}</p>
      </div>
    </section>
  );
}

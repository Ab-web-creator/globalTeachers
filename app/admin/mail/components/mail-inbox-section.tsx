import { getMessage, openMessage, type MailFolder, type listMessages } from "../../../../lib/mailbox/messages";
import MailList from "./mail-list";
import MessageView from "./message-view";

export default async function MailInboxSection({ folder, data, requestedMessage }: {
  folder: MailFolder; data: Awaited<ReturnType<typeof listMessages>> | null; requestedMessage?: string;
}) {
  const selected = data?.messages.find(message => message.id === requestedMessage) ?? data?.messages[0];
  // A default preview is read-only; explicitly selecting a message marks it read.
  const message = selected ? await (requestedMessage === selected.id ? openMessage(selected.id) : getMessage(selected.id)) : null;
  return (
    <div className="flex min-h-0 flex-1 flex-col xl:grid xl:grid-cols-[17rem_minmax(0,1fr)]">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col xl:border-r xl:border-brand-100">
        <MailList folder={folder} data={data} selectedId={selected?.id} />
      </div>
      <section aria-label="Выбранное письмо" className="hidden min-h-0 min-w-0 flex-col overflow-y-auto xl:flex">
        {message ? <MessageView key={message.id} message={message} readingPane /> : <p className="m-auto p-8 text-center text-neutral-500">Выберите письмо для просмотра.</p>}
      </section>
    </div>
  );
}

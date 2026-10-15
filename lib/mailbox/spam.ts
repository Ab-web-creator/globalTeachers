import { addressOf } from "./messages";

/**
 * Bot probes look like "#15597965-4da8a56e": a subject that is only a number and
 * a code, no words in the body and no attachments.
 */
const junkSubject = /^#?[0-9]+-[0-9a-f]{6,}$/i;
// Only spaces and punctuation; anything else, in any language, counts as a real body.
const emptyBody = /^[\s!-/:-@[-`{-~ «»–—]*$/;

export type SpamCheck = {
  subject?: string | null; text?: string | null; html?: string | null; attachments?: unknown[] | null;
  to?: string[]; cc?: string[];
};

export function isJunkEmail(email: SpamCheck) {
  const body = `${email.text ?? ""} ${(email.html ?? "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ")}`;
  return junkSubject.test((email.subject ?? "").trim()) && emptyBody.test(body) && !email.attachments?.length;
}

/** The domain accepts any name, so only email addressed to the mailbox itself is wanted. */
export function isForMailbox(email: SpamCheck, mailbox: string) {
  return [...(email.to ?? []), ...(email.cc ?? [])].some((address) => addressOf(address).toLowerCase() === mailbox.toLowerCase());
}

/** Spam is kept in its own folder instead of the inbox and is not forwarded. */
export function isSpam(email: SpamCheck, mailbox: string) {
  return isJunkEmail(email) || !isForMailbox(email, mailbox);
}

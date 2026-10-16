"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function MailMessageLink({ id, previewHref, selected, className, children }: {
  id: string; previewHref: string; selected: boolean; className: string; children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link href={`/admin/mail/${id}`} prefetch={false} aria-current={selected ? "true" : undefined} className={className}
      onClick={event => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !window.matchMedia("(min-width: 1280px)").matches) return;
        event.preventDefault();
        router.push(previewHref, { scroll: false });
      }}>
      {children}
    </Link>
  );
}

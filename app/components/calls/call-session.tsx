"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import CallRoom from "./call-room";

type Room = { id: string; token?: string; name: string; expires: string; returnPath?: string };
type Session = { room: Room; target: HTMLElement; path: string };
const CallSessionContext = createContext<((room: Room, target: HTMLElement) => void) | null>(null);

export function CallSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [host] = useState(() => typeof document === "undefined" ? null : document.createElement("div"));
  const pathname = usePathname();
  const router = useRouter();
  const minimized = !!session && pathname !== session.path;
  const open = useCallback((room: Room, target: HTMLElement) => {
    setSession((current) => current?.room.id === room.id ? { ...current, target } : { room, target, path: room.token ? `/call/${room.token}` : `/admin/calls/${room.id}` });
  }, []);

  useLayoutEffect(() => {
    if (!host || !session) return;
    (minimized ? document.body : session.target).appendChild(host);
    return () => { host.remove(); };
  }, [host, session, minimized]);

  return (
    <CallSessionContext.Provider value={open}>
      {children}
      {host && session && createPortal(
        <CallRoom key={session.room.id} {...session.room} minimized={minimized}
          onMinimize={() => router.push(session.room.token ? "/" : session.room.returnPath ?? "/admin")}
          onRestore={() => router.push(session.path)}
          onDismiss={() => setSession(null)} />,
        host,
      )}
    </CallSessionContext.Provider>
  );
}

export default function CallSession({ id, token, name, expires, returnPath }: Room) {
  const open = useContext(CallSessionContext);
  const attach = useCallback((target: HTMLDivElement | null) => {
    if (target) open?.({ id, token, name, expires, returnPath }, target);
  }, [open, id, token, name, expires, returnPath]); // Room identity is supplied by the server page.
  return <div ref={attach} />;
}

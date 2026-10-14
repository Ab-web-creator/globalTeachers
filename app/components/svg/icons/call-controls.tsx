import type { SVGProps } from "react";

type DeviceIconProps = SVGProps<SVGSVGElement> & { off?: boolean };

export function ChatSendIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="m3 3 19 9L3 21l2-8 10-1-10-1Z" /></svg>;
}

export function ScreenShareIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8m-4-4v4m0-8V7m-3 3 3-3 3 3" /></svg>;
}

export function CallChatIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5 3a2 2 0 0 0-2 2v16l5-5h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>;
}

export function VideoExpandIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5" /></svg>;
}

export function CallWindowCloseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function CallWindowMinimizeIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}><path d="M5 12h14" /></svg>;
}

export function CallWindowFullscreenIcon({ expanded = false, ...props }: SVGProps<SVGSVGElement> & { expanded?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d={expanded ? "M10 10 2 9l7-7ZM14 14l8 1-7 7Z" : "m5 5 8 1-7 7ZM19 19l-8-1 7-7Z"} /></svg>;
}

export function PhoneCallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function MicrophoneIcon({ off = false, ...props }: DeviceIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      {off ? (
        <>
          <path d="M9 9v3a3 3 0 0 0 5 2.24M9.6 4.2A3 3 0 0 1 15 6v4M5 10v2a7 7 0 0 0 12 4.9M19 10v2c0 .7-.1 1.4-.3 2" />
          <path d="m3 3 18 18" />
        </>
      ) : (
        <>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
        </>
      )}
      <path d="M12 19v3m-4 0h8" />
    </svg>
  );
}

export function CameraIcon({ off = false, ...props }: DeviceIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      {off ? (
        <>
          <path d="M3 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M7 5h6a2 2 0 0 1 2 2v4m0-2 6-3v12l-3-1.5" />
          <path d="m3 3 18 18" />
        </>
      ) : (
        <>
          <rect x="3" y="5" width="12" height="14" rx="2" />
          <path d="m15 9 6-3v12l-6-3" />
        </>
      )}
    </svg>
  );
}

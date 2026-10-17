import { StrokeIcon } from "./stroke-icon";

export function FileUploadIcon({ className = "size-5" }: { className?: string }) {
  return <StrokeIcon path="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" className={className} />;
}

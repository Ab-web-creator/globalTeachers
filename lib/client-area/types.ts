import type { Answers } from "../../app/consultation/components/form-fields";
export type ClientTier = "START" | "PRO" | "VIP";
export type PrivateClient = {
  id: string;
  email: string;
  name: string;
  tier: ClientTier;
  active: boolean;
  paid_at?: string | null;
  last_seen_at?: string | null;
  has_profile_photo?: boolean;
  allowance_hours: number;
  booked_hours: number;
  unread_count?: number;
  client_unread_count?: number;
  awaiting_reply?: boolean;
};
export type ChatMessage = {
  hidden_from_client?: boolean;
  client_edited_at?: string | null;
  client_deleted_at?: string | null;
  client_edit_history?: { body: string; changed_at: string }[];
  id: string;
  author: "admin" | "client";
  body: string;
  created_at: string;
};
export type AppointmentSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
  open: boolean;
  booked_by: string | null;
  client_name?: string;
};
export type ClientWorkspace = {
  profile: Answers;
  booking_time_zone: string;
  client: PrivateClient;
  messages: ChatMessage[];
  slots: AppointmentSlot[];
  bookings: AppointmentSlot[];
};
export type Invitation = {
  id: string;
  client_id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: "scheduled" | "draft" | "sending" | "sent";
  due_at: string;
  first_attempt_at: string | null;
};
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const clientTiers: ClientTier[] = ["START", "PRO", "VIP"];

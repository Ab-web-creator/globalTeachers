import { invitationAccessLink } from "./invitation-email";
import { emailConfig } from "../consultation/email";
import { database } from "../consultation/database";
import { createToken, hashToken } from "../consultation/token";

export const clientSessionCookie = "tn_client";
export const clientSessionLifetime = 30 * 24 * 60 * 60;

export async function exchangeClientKey(key: unknown) {
  let hash: string;
  try {
    hash = hashToken(key);
  } catch {
    return null;
  }
  const session = createToken();
  const result = await database().query(
    `INSERT INTO private_client_sessions(token_hash, client_id)
    SELECT $1, id FROM private_clients WHERE key_hash = $2 AND active RETURNING client_id`,
    [hashToken(session), hash],
  );
  return result.rowCount ? session : null;
}

export async function clientFromSession(token?: string) {
  let hash: string;
  try {
    hash = hashToken(token);
  } catch {
    return null;
  }
  const result = await database().query(
    `SELECT client.id FROM private_clients client
    JOIN private_client_sessions session ON session.client_id = client.id
    WHERE session.token_hash = $1 AND session.expires_at > now() AND client.active`,
    [hash],
  );
  return (result.rows[0]?.id as string | undefined) ?? null;
}

export async function endClientSession(token?: string) {
  let hash: string;
  try {
    hash = hashToken(token);
  } catch {
    return;
  }
  await database().query(
    "DELETE FROM private_client_sessions WHERE token_hash = $1",
    [hash],
  );
}

/** Only call after identifying the client from their authenticated session. */
export async function clientAccessLink(clientId: string) {
  const result = await database().query(
    `SELECT invite.body, client.key_hash FROM private_clients client
    JOIN client_invitations invite ON invite.client_id = client.id
    WHERE client.id = $1 AND client.active AND invite.status = 'sent'`,
    [clientId],
  );
  if (!result.rowCount) return null;
  return invitationAccessLink(
    result.rows[0].body,
    result.rows[0].key_hash,
    emailConfig().origin,
  );
}

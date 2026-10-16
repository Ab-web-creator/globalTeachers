import { invitationAccessLink, invitationEmailHtml, personalInvitationBody } from "./invitation-email";
import { database } from "../consultation/database";
import { createToken, hashToken } from "../consultation/token";

function clientSiteOrigin() {
  const url = new URL(process.env.SITE_URL ?? "");
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Invalid site URL");
  return url.origin;
}

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
    WHERE client.id = $1 AND client.active`,
    [clientId],
  );
  if (!result.rowCount) return null;
  return invitationAccessLink(
    result.rows[0].body,
    result.rows[0].key_hash,
    clientSiteOrigin(),
  );
}

/** Prepare a durable, shareable key without scheduling or sending an email. */
export async function ensurePaidClientAccess(clientId: string) {
  const db = database();
  const email = (await db.query("SELECT email FROM private_clients WHERE id=$1", [clientId])).rows[0]?.email;
  if (!email) throw new Error("Клиент не найден.");
  const connection = await db.connect();
  try {
    await connection.query("BEGIN");
    await connection.query("SELECT pg_advisory_xact_lock(hashtextextended($1,38))", [email]);
    const client = (await connection.query("SELECT id,name,key_hash,paid_at FROM private_clients WHERE id=$1 FOR UPDATE", [clientId])).rows[0];
    if (!client?.paid_at) { await connection.query("COMMIT"); return; }
    const invite = (await connection.query("SELECT body FROM client_invitations WHERE client_id=$1", [clientId])).rows[0];
    const origin = clientSiteOrigin();
    if (invite) {
      // Reuse the saved key, including a paused invitation; never invalidate a shared link.
      invitationAccessLink(invite.body, client.key_hash, origin);
    } else {
      const key = createToken();
      const hash = hashToken(key);
      const body = personalInvitationBody(client.name, `${origin}/client#${key}`);
      await connection.query("UPDATE private_clients SET key_hash=$2 WHERE id=$1", [clientId,hash]);
      await connection.query(
        "INSERT INTO client_invitations(client_id,subject,body,html_body,status) VALUES($1,'Ваш ключ от личной страницы — TeacherNavigator',$2,$3,'draft')",
        [clientId,body,invitationEmailHtml(body,hash,origin)],
      );
    }
    await connection.query("UPDATE private_clients SET active=true WHERE id=$1", [clientId]);
    await connection.query("COMMIT");
  } catch (error) { await connection.query("ROLLBACK"); throw error; }
  finally { connection.release(); }
}

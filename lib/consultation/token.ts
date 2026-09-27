import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";
import { parseAnswers } from "./answers";
import type { Answers } from "../../app/consultation/components/form-fields";

function key() {
  const secret = process.env.CONSULTATION_TOKEN_SECRET;
  if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) throw new Error("Missing confirmation secret");
  return Buffer.from(secret, "hex");
}

export function createToken(answers: Answers) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const payload = { answers, id: randomUUID(), expires: Date.now() + 24 * 60 * 60 * 1000 };
  const encrypted = Buffer.concat([cipher.update(deflateSync(JSON.stringify(payload))), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function readToken(token: string) {
  if (!token || token.length > 20000) throw new Error("Invalid link");
  const bytes = Buffer.from(token, "base64url");
  const decipher = createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28));
  const decrypted = Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]);
  const data = JSON.parse(inflateSync(decrypted, { maxOutputLength: 40000 }).toString());
  if (typeof data.expires !== "number" || data.expires <= Date.now() || typeof data.id !== "string") throw new Error("Expired link");
  return { answers: parseAnswers(data.answers), id: data.id };
}

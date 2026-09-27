import { createHash, randomBytes } from "node:crypto";

export function createToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: unknown) {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("Invalid link");
  return createHash("sha256").update(token).digest("hex");
}

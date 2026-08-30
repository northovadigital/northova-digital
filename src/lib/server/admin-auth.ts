import { cookies } from "next/headers";

import { getCloudflareContext } from "@opennextjs/cloudflare";

const SESSION_COOKIE = "fk_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24;

function getEnv() {
  return getCloudflareContext().env;
}

function toBase64Url(bytes: ArrayBuffer): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  return new Uint8Array(Buffer.from(base64, "base64"));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
}

export async function createAdminSession() {
  const secret = getEnv().ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = String(issuedAt);
  const signature = await sign(payload, secret);

  return `${payload}.${toBase64Url(signature)}`;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [issuedAtValue, signatureValue] = token.split(".");

  if (!issuedAtValue || !signatureValue) {
    return false;
  }

  const issuedAt = Number(issuedAtValue);

  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  if (Math.floor(Date.now() / 1000) - issuedAt > SESSION_MAX_AGE) {
    return false;
  }

  const secret = getEnv().ADMIN_SESSION_SECRET;

  if (!secret) {
    return false;
  }

  const expected = new Uint8Array(
    await sign(issuedAtValue, secret),
  );

  const actual = fromBase64Url(signatureValue);

  if (expected.length !== actual.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected[index] ^ actual[index];
  }

  return difference === 0;
}

export async function setAdminSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getAdminPassword() {
  const password = getEnv().ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  return password;
}

export { SESSION_COOKIE };

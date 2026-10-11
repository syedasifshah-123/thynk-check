// FAKE auth for building the UI before the backend exists. Everything lives in
// localStorage (passwords in plain text!), and every call waits a moment so loading
// states are visible. Replace these functions with real API calls later.

import { useMemo, useSyncExternalStore } from "react";

export type Session = { name: string; username: string; email: string };
type Account = Session & { password: string };

const ACCOUNTS_KEY = "thynk-accounts";
const PENDING_KEY = "thynk-pending-signup";
const SESSION_KEY = "thynk-session";
const SESSION_EVENT = "thynk-session-change";
const DELAY_MS = 1200;

const wait = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function setSession(session: Session | null) {
  write(SESSION_KEY, session);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

const findAccount = (email: string) =>
  read<Account[]>(ACCOUNTS_KEY, []).find((a) => a.email.toLowerCase() === email.toLowerCase());

function saveAccount(account: Account) {
  const others = read<Account[]>(ACCOUNTS_KEY, []).filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
  write(ACCOUNTS_KEY, [...others, account]);
}

const nameFromEmail = (email: string) => {
  const local = email.split("@")[0] || "Thynker";
  return local.charAt(0).toUpperCase() + local.slice(1);
};

/** Holds the new account until the email code is verified. */
export async function signUp(account: Account) {
  await wait();
  if (findAccount(account.email)) throw new Error("An account with this email already exists.");
  write(PENDING_KEY, account);
}

/** Any 6 digits are accepted. For signups this activates the account and logs in. */
export async function verifyCode(email: string, _code: string, purpose: "signup" | "reset") {
  await wait();
  if (purpose !== "signup") return;
  const pending = read<Account | null>(PENDING_KEY, null);
  const account = pending ?? { name: nameFromEmail(email), username: nameFromEmail(email).toLowerCase(), email, password: "" };
  saveAccount(account);
  write(PENDING_KEY, null);
  setSession({ name: account.name, username: account.username, email: account.email });
}

/** Known email → password must match. Unknown email → logged in anyway (it's fake). */
export async function logIn(email: string, password: string) {
  await wait();
  const account = findAccount(email);
  if (account && account.password && account.password !== password) throw new Error("Incorrect email or password.");
  const name = account?.name ?? nameFromEmail(email);
  setSession({ name, username: account?.username ?? name.toLowerCase(), email });
}

export async function socialLogIn(provider: "Google" | "Apple") {
  await wait();
  setSession({ name: `${provider} Thynker`, username: `${provider.toLowerCase()}_thynker`, email: `you@${provider.toLowerCase()}.com` });
}

export async function sendResetCode() {
  await wait();
}

export async function resendCode() {
  await wait(700);
}

export async function resetPassword(email: string, password: string) {
  await wait();
  const account = findAccount(email);
  if (account) saveAccount({ ...account, password });
}

export function logOut() {
  setSession(null);
}

function subscribeSession(onChange: () => void) {
  window.addEventListener(SESSION_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SESSION_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function sessionSnapshot() {
  try {
    return localStorage.getItem(SESSION_KEY) ?? "";
  } catch {
    return "";
  }
}

/** `undefined` while unknown (server render), `null` when logged out. */
export function useSession(): Session | null | undefined {
  const raw = useSyncExternalStore(subscribeSession, sessionSnapshot, () => null);
  return useMemo(() => (raw === null ? undefined : raw ? (JSON.parse(raw) as Session) : null), [raw]);
}

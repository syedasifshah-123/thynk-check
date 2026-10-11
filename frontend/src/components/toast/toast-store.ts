// Tiny global toast store. Call `toast.success("…")` from any client code;
// <Toaster /> in the root layout subscribes and renders the stack.

export type ToastType = "success" | "error" | "warning";
export type ToastItem = { id: number; type: ToastType; message: string; leaving: boolean };

const DURATION_MS = 4000;
const EXIT_MS = 200;
const MAX_VISIBLE = 3;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function setToasts(next: ToastItem[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getToasts = () => toasts;
const NO_TOASTS: ToastItem[] = [];
export const getServerToasts = () => NO_TOASTS;

/** Plays the exit animation, then removes the toast. */
export function dismiss(id: number) {
  if (!toasts.some((t) => t.id === id && !t.leaving)) return;
  setToasts(toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
  setTimeout(() => setToasts(toasts.filter((t) => t.id !== id)), EXIT_MS);
}

function show(type: ToastType, message: string) {
  const id = nextId++;
  setToasts([...toasts, { id, type, message, leaving: false }].slice(-MAX_VISIBLE));
  setTimeout(() => dismiss(id), DURATION_MS);
  return id;
}

export const toast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
  warning: (message: string) => show("warning", message),
};

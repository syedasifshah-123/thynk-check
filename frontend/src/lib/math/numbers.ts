// Parsing what learners type for numbers: integers, decimals, fractions, mixed numbers,
// negatives (with the typographic minus "−" too), thousands separators and a trailing %.

export type ParsedNumber =
  | { kind: "decimal"; value: number }
  | { kind: "fraction"; value: number; num: number; den: number }
  | { kind: "mixed"; value: number; whole: number; num: number; den: number };

/** Normalise typographic characters people paste or type on phones. */
export function normalise(text: string) {
  return text
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, " ");
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function parseNumber(raw: string, { allowPercent = true } = {}): ParsedNumber | null {
  let text = normalise(raw);
  if (allowPercent) text = text.replace(/\s*%$/, "");
  if (!text) return null;

  // 1,250 / 12,500,000 → digits only (only well-formed thousands groups)
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) text = text.replace(/,/g, "");

  let m = /^([-+]?)(\d+(?:\.\d+)?|\.\d+)$/.exec(text);
  if (m) {
    const value = Number(m[1] + m[2]);
    return Number.isFinite(value) ? { kind: "decimal", value } : null;
  }

  m = /^([-+]?)(\d+) ?\/ ?(\d+)$/.exec(text);
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const num = sign * Number(m[2]);
    const den = Number(m[3]);
    if (den === 0) return null;
    return { kind: "fraction", value: num / den, num, den };
  }

  m = /^([-+]?)(\d+) (\d+) ?\/ ?(\d+)$/.exec(text);
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const whole = Number(m[2]);
    const num = Number(m[3]);
    const den = Number(m[4]);
    if (den === 0) return null;
    return { kind: "mixed", value: sign * (whole + num / den), whole: sign * whole, num, den };
  }

  return null;
}

/** Equal within a tolerance that scales with the size of the numbers. */
export function nearlyEqual(a: number, b: number, tolerance?: number) {
  const tol = tolerance ?? Math.max(1e-9, Math.abs(b) * 1e-9);
  return Math.abs(a - b) <= tol;
}

/** Display helper: −3 instead of -3. */
export const fmt = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

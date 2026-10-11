const LEVELS = [
  { label: "Too weak", bar: "bg-red-500", text: "text-red-500" },
  { label: "Weak", bar: "bg-orange-500", text: "text-orange-500" },
  { label: "Fair", bar: "bg-amber-400", text: "text-amber-500" },
  { label: "Good", bar: "bg-lime-500", text: "text-lime-600 dark:text-lime-400" },
  { label: "Strong", bar: "bg-primary", text: "text-primary" },
] as const;

const RULES = [
  { test: (p: string) => p.length >= 8, hint: "8+ characters" },
  { test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p), hint: "upper & lowercase" },
  { test: (p: string) => /\d/.test(p), hint: "a number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), hint: "a symbol" },
];

/** 0–4: one point per rule met, capped at 1 while shorter than 8 characters. */
export function passwordScore(password: string) {
  if (!password) return 0;
  const met = RULES.filter((r) => r.test(password)).length;
  return password.length < 8 ? Math.min(met, 1) : met;
}

export function PasswordStrength({ password }: { password: string }) {
  const score = passwordScore(password);
  const level = LEVELS[score];
  const missing = RULES.filter((r) => !r.test(password)).map((r) => r.hint);

  return (
    <div className="px-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              password && i <= Math.max(score, 1) ? level.bar : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 flex justify-between gap-3 text-sm">
        <span className="text-muted">
          {!password
            ? "Use 8+ characters with a mix of letters, numbers & symbols."
            : missing.length
              ? `Add ${missing.join(", ")}`
              : "Nice — that's a strong password."}
        </span>
        {password && <span className={`shrink-0 font-cofo font-bold ${level.text}`}>{level.label}</span>}
      </p>
    </div>
  );
}

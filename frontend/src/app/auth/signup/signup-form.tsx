"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength, passwordScore } from "@/components/auth/password-strength";
import { SocialButtons } from "@/components/auth/social-buttons";
import { LoadingButton, usePending } from "@/components/loading-button";
import { toast } from "@/components/toast/toast-store";
import { signUp } from "@/lib/fake-auth";

const USERNAME_PATTERN = "[a-z0-9_.]{3,20}";
const MIN_SCORE = 3; // "Good" or better

/** Lowercase, keep only a–z, 0–9, "_" and ".", max 20 chars. */
function toUsername(value: string) {
  return value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.]/g, "").slice(0, 20);
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = usePending(false);

  function handleNameChange(value: string) {
    setName(value);
    // Suggest a username from the name until the user types their own.
    if (!usernameEdited) setUsername(toUsername(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordScore(password) < MIN_SCORE) {
      toast.warning("Please choose a stronger password.");
      return;
    }
    const email = String(new FormData(event.currentTarget).get("email"));
    setPending(true);
    try {
      await signUp({ name, username, email, password });
      toast.success(`Account created! We sent a code to ${email}.`);
      router.push(`/auth/verify?purpose=signup&email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create your account. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <SocialButtons disabled={pending} />

      <form onSubmit={handleSubmit}>
        <fieldset disabled={pending} className="flex min-w-0 flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Name"
              aria-label="Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="field"
            />
            <div className="relative">
              <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[1.0625rem] text-muted">@</span>
              <input
                name="username"
                required
                autoComplete="username"
                placeholder="username"
                aria-label="Username"
                pattern={USERNAME_PATTERN}
                title="3–20 characters: lowercase letters, numbers, _ or ."
                value={username}
                onChange={(e) => {
                  setUsernameEdited(true);
                  setUsername(toUsername(e.target.value));
                }}
                className="field pl-11"
              />
            </div>
          </div>

          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            aria-label="Email"
            className="field"
          />

          <PasswordInput
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />

          <LoadingButton
            type="submit"
            pending={pending}
            pendingText="Creating account…"
            className="btn btn-primary mt-1 h-[52px] w-full text-lg disabled:opacity-80"
          >
            Create account
          </LoadingButton>
        </fieldset>
      </form>
    </div>
  );
}

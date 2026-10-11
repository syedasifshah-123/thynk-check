"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength, passwordScore } from "@/components/auth/password-strength";
import { LoadingButton, usePending } from "@/components/loading-button";
import { toast } from "@/components/toast/toast-store";
import { resetPassword } from "@/lib/fake-auth";

const MIN_SCORE = 3; // "Good" or better, same rule as signup

export function ResetPasswordForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = usePending(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordScore(password) < MIN_SCORE) {
      toast.warning("Please choose a stronger password.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setPending(true);
    try {
      await resetPassword(email, password);
      toast.success("Password updated. Log in with your new password.");
      router.push("/auth/login");
    } catch {
      toast.error("Couldn't update your password. Try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-3">
        <PasswordInput
          name="password"
          required
          autoFocus
          minLength={8}
          autoComplete="new-password"
          placeholder="New password"
          aria-label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrength password={password} />

        <PasswordInput
          name="confirm"
          required
          autoComplete="new-password"
          placeholder="Confirm new password"
          aria-label="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <LoadingButton
          type="submit"
          pending={pending}
          pendingText="Saving…"
          className="btn btn-primary mt-1 h-[52px] w-full text-lg disabled:opacity-80"
        >
          Reset password
        </LoadingButton>
      </fieldset>
    </form>
  );
}

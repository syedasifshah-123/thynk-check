"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { LoadingButton, usePending } from "@/components/loading-button";
import { toast } from "@/components/toast/toast-store";
import { logIn } from "@/lib/fake-auth";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = usePending(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      await logIn(String(data.get("email")), String(data.get("password")));
      toast.success("Logged in successfully. Welcome back!");
      router.push("/home");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't log in. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <SocialButtons disabled={pending} />

      <form onSubmit={handleSubmit}>
        {/* disabled fieldset locks every input while logging in */}
        <fieldset disabled={pending} className="flex min-w-0 flex-col gap-3">
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
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
          />

          <Link href="/auth/forgot-password" className="-mt-1 self-end text-sm text-muted hover:text-foreground">
            Forgot password?
          </Link>

          <LoadingButton
            type="submit"
            pending={pending}
            pendingText="Logging in…"
            className="btn btn-primary mt-1 h-[52px] w-full text-lg disabled:opacity-80"
          >
            Log in
          </LoadingButton>
        </fieldset>
      </form>
    </div>
  );
}

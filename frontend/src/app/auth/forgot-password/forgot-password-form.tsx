"use client";

import { useRouter } from "next/navigation";
import { LoadingButton, usePending } from "@/components/loading-button";
import { toast } from "@/components/toast/toast-store";
import { sendResetCode } from "@/lib/fake-auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = usePending(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setPending(true);
    try {
      await sendResetCode();
      toast.success(`Code sent to ${email}.`);
      router.push(`/auth/verify?purpose=reset&email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Couldn't send the code. Try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          className="field"
        />
        <LoadingButton
          type="submit"
          pending={pending}
          pendingText="Sending code…"
          className="btn btn-primary mt-1 h-[52px] w-full text-lg disabled:opacity-80"
        >
          Send code
        </LoadingButton>
      </fieldset>
    </form>
  );
}

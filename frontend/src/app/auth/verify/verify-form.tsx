"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { OTP_LENGTH, OtpInput } from "@/components/auth/otp-input";
import { LoadingButton, Spinner, usePending } from "@/components/loading-button";
import { toast } from "@/components/toast/toast-store";
import { resendCode, verifyCode } from "@/lib/fake-auth";

const RESEND_SECONDS = 30;
const emptyDigits = () => Array<string>(OTP_LENGTH).fill("");

// One OTP screen for both flows: ?purpose=signup (verify new account) or ?purpose=reset (forgot password).
export function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const purpose = params.get("purpose") === "reset" ? "reset" : "signup";

  const [digits, setDigits] = useState(emptyDigits);
  const [error, setError] = useState("");
  const [pending, setPending] = usePending(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const boxesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function fail(message: string) {
    setError(message);
    boxesRef.current?.animate(
      [0, -10, 10, -7, 7, -3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
      { duration: 420, easing: "ease-out" },
    );
  }

  async function verify(code: string) {
    if (pending) return;
    if (code.length < OTP_LENGTH) {
      fail(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError("");
    setPending(true);
    try {
      // Fake: any 6 digits pass. A real backend rejects wrong/expired codes, which lands in the catch.
      await verifyCode(email, code, purpose);
      if (purpose === "reset") {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.success("Email verified. Welcome to Thynk!");
        router.push("/home");
      }
    } catch {
      setPending(false);
      setDigits(emptyDigits());
      fail("That code isn't right. Try again.");
    }
  }

  async function resend() {
    setResending(true);
    await resendCode();
    setResending(false);
    setDigits(emptyDigits());
    setError("");
    setSecondsLeft(RESEND_SECONDS);
    toast.success(email ? `New code sent to ${email}.` : "New code sent.");
  }

  return (
    <>
      <p className="mt-1.5 text-center text-muted">
        We sent a {OTP_LENGTH}-digit code to{" "}
        {email ? <span className="font-bold text-foreground">{email}</span> : "your email"}.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          verify(digits.join(""));
        }}
        className="mt-8"
      >
        <div ref={boxesRef}>
          <OtpInput
            digits={digits}
            onChange={(next) => {
              setDigits(next);
              setError("");
            }}
            onComplete={verify}
            invalid={Boolean(error)}
            disabled={pending}
          />
        </div>

        <p role="alert" className="mt-3 min-h-5 text-center text-sm font-bold text-red-500">
          {error}
        </p>

        <LoadingButton
          type="submit"
          pending={pending}
          pendingText="Verifying…"
          className="btn btn-primary mt-2 h-[52px] w-full text-lg disabled:opacity-80"
        >
          {purpose === "reset" ? "Continue" : "Verify email"}
        </LoadingButton>
      </form>

      <p className="mt-6 text-center text-muted">
        {secondsLeft > 0 ? (
          <>
            Didn&apos;t get it? Resend in <span className="font-cofo font-bold tabular-nums">0:{String(secondsLeft).padStart(2, "0")}</span>
          </>
        ) : (
          <>
            Didn&apos;t get it?{" "}
            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 align-bottom font-cofo font-bold text-primary hover:underline disabled:cursor-wait"
            >
              {resending ? (
                <>
                  <Spinner className="size-4" /> Sending…
                </>
              ) : (
                "Resend code"
              )}
            </button>
          </>
        )}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Wrong email?{" "}
        <Link
          href={purpose === "reset" ? "/auth/forgot-password" : "/auth/signup"}
          className="font-cofo font-bold text-foreground hover:underline"
        >
          Change it
        </Link>
      </p>
    </>
  );
}

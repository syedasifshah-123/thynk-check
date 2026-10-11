import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { OTP_LENGTH } from "@/components/auth/otp-input";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = {
  title: "Verify your email · Thynk",
};

export default function VerifyPage() {
  return (
    <AuthShell title="Check your email">
      {/* VerifyForm reads ?email and ?purpose, so it renders on the client inside Suspense */}
      <Suspense fallback={<VerifyFallback />}>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}

function VerifyFallback() {
  return (
    <>
      <p className="mt-1.5 text-center text-muted">We sent a {OTP_LENGTH}-digit code to your email.</p>
      <div className="mt-8 grid grid-cols-6 justify-items-center gap-2 sm:gap-3" aria-hidden="true">
        {Array.from({ length: OTP_LENGTH }, (_, i) => (
          <span key={i} className="otp-box" />
        ))}
      </div>
    </>
  );
}

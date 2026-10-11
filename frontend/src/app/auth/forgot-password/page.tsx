import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password · Thynk",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password?"
      subtitle="No worries. Enter your email and we'll send you a 6-digit code."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/auth/login" className="font-cofo font-bold text-primary hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

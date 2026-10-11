import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password · Thynk",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Make it strong. Your brain deserves it."
      footer={
        <Link href="/auth/login" className="font-cofo font-bold text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      {/* The form reads ?email, so it renders on the client inside Suspense */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

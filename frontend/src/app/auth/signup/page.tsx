import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up · Thynk",
};

export default function SignupPage() {
  return (
    <AuthShell
      compact
      title="Create your account"
      subtitle="Start training your brain in minutes a day."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-cofo font-bold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}

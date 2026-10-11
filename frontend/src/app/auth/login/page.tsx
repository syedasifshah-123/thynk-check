import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in · Thynk",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep your brain streak going."
      footer={
        <>
          New to Thynk?{" "}
          <Link href="/auth/signup" className="font-cofo font-bold text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}

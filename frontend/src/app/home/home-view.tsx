"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/loading-button";
import { Mascot } from "@/components/mascot";
import { toast } from "@/components/toast/toast-store";
import { logOut, useSession } from "@/lib/fake-auth";

// Logged-in landing page. Sends visitors without a (fake) session to the login page.
export function HomeView() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  if (!session) {
    return (
      <main className="flex flex-1 items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  const firstName = session.name.split(" ")[0];

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <Mascot className="pointer-events-none size-28 select-none" />
        <h1 className="mt-6 font-headline text-5xl leading-[1.05] tracking-[-0.02em] sm:text-6xl">Hey {firstName}, ready to thynk?</h1>
        <p className="mt-4 text-lg text-muted">
          You&apos;re logged in as <span className="font-bold text-foreground">@{session.username}</span>. Your first brain workout is coming soon.
        </p>
      </div>
    </main>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const session = useSession();

  if (!session) return null;

  return (
    <button
      type="button"
      onClick={() => {
        logOut();
        toast.success("Logged out. See you soon!");
        router.push("/auth/login");
      }}
      className="btn btn-secondary btn-sm h-10 px-5 text-base"
    >
      Log out
    </button>
  );
}

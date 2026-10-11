import Link from "next/link";
import { Mascot } from "./mascot";
import { ThemeToggle } from "./theme-toggle";

/** `actions` replaces the default "Sign in" button (e.g. a Log out button on /home). */
export function Navbar({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="px-4 pt-6 sm:px-8">
      <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between rounded-full border border-border bg-surface pl-7 pr-2.5 sm:pl-8">
        <Link href="/" className="relative font-headline text-[1.875rem] leading-none tracking-[-0.02em]">
          Thynk
          {/* Tiny mascot perched above the "k" */}
          <Mascot className="pointer-events-none absolute -top-[0.42em] left-full -ml-[0.12em] size-[0.72em] rotate-12 select-none" />
        </Link>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {actions ?? (
            <Link href="/auth/login" className="btn btn-secondary btn-sm h-10 px-5 text-base">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

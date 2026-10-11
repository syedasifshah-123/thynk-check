"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { Mascot } from "@/components/mascot";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/toast/toast-store";
import { logOut, type Session } from "@/lib/fake-auth";
import { streakDays, type Progress } from "@/lib/progress";
import { LEARN_ITEMS, YOU_ICON, YOU_ITEMS, type NavItem } from "./nav-items";

// App layout for logged-in pages:
// - desktop (lg+): floating sidebar
// - mobile: slim top bar (logo + streak + XP) + floating bottom nav; the "You" tab opens a bottom sheet
export function DashboardShell({
  session,
  progress,
  active,
  children,
}: {
  session: Session;
  progress: Progress;
  active: string;
  children: React.ReactNode;
}) {
  const [youOpen, setYouOpen] = useState(false);
  const streak = streakDays(progress);
  const xp = Object.values(progress).reduce((sum, r) => sum + r.bestXp, 0);

  return (
    // Solid background: covers the page-wide grid pattern, which is only for landing/auth pages.
    <div className="flex min-h-dvh flex-1 bg-background">
      {/* Desktop sidebar: floats 12px in from the edges */}
      <aside className="fixed bottom-3 left-3 top-3 z-30 hidden w-[272px] flex-col rounded-[28px] border-2 border-border bg-surface shadow-[0_4px_0_var(--border)] lg:flex">
        <div className="flex h-20 shrink-0 items-center px-6">
          <Logo />
        </div>

        {/* No overflow clipping, so the "You" flyout can extend past the sidebar */}
        <nav className="flex-1 px-4 pb-4" aria-label="Main">
          <p className="px-3 pb-2 font-cofo text-xs font-bold uppercase tracking-[0.14em] text-muted">Learn</p>
          <ul className="flex flex-col gap-1">
            {LEARN_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink item={item} active={item.id === active} />
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t-2 border-border pt-4">
            <YouFlyout />
          </div>
        </nav>

        <div className="shrink-0 p-3">
          <ProfileCard session={session} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-28 lg:pb-0 lg:pl-[296px]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b-2 border-border bg-background/85 px-4 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <StatChip label={`${streak} day streak`} value={streak} tone="text-orange-500">
              <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2.5 1.5-3.5 4-3.5 6-1-.5-2-2-2-3.5C6.5 9.5 5 12 5 15a7 7 0 0 0 7 7z" />
            </StatChip>
            <StatChip label={`${xp} XP`} value={xp} tone="text-primary">
              <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" />
            </StatChip>
          </div>
        </header>

        {children}
      </div>

      <BottomNav active={active} youOpen={youOpen} onYou={() => setYouOpen(true)} />
      <YouSheet session={session} open={youOpen} onClose={() => setYouOpen(false)} />
    </div>
  );
}

/* ───────────────────────── Mobile ───────────────────────── */

function StatChip({ label, value, tone, children }: { label: string; value: number; tone: string; children: React.ReactNode }) {
  return (
    <span
      aria-label={label}
      className="flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 font-cofo text-sm font-bold tabular-nums shadow-[0_2px_0_var(--border)]"
    >
      <svg className={`size-4 ${tone}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
      {value}
    </span>
  );
}

function BottomNav({ active, youOpen, onYou }: { active: string; youOpen: boolean; onYou: () => void }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 rounded-[26px] border-2 border-border bg-surface/95 px-1.5 py-1.5 shadow-[0_4px_0_var(--border),0_12px_32px_rgba(0,0,0,0.14)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-6">
        {LEARN_ITEMS.map((item) => (
          <li key={item.id}>
            <Tab item={item} active={item.id === active} />
          </li>
        ))}
        <li>
          <TabShell label="You" icon={YOU_ICON} active={youOpen} onClick={onYou} />
        </li>
      </ul>
    </nav>
  );
}

function Tab({ item, active }: { item: NavItem; active: boolean }) {
  const label = item.short ?? item.label;
  if (item.href) {
    return <TabShell label={label} icon={item.icon} active={active} href={item.href} dot={Boolean(item.badge)} />;
  }
  return (
    <TabShell label={label} icon={item.icon} active={active} dot={Boolean(item.badge)} onClick={() => toast.warning(`${item.label} is coming soon!`)} />
  );
}

function TabShell({
  label,
  icon,
  active,
  href,
  dot,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href?: string;
  dot?: boolean;
  onClick?: () => void;
}) {
  const className = `group flex w-full flex-col items-center gap-0.5 rounded-[18px] py-1.5 font-cofo text-[11px] font-bold transition-colors ${
    active ? "text-primary" : "text-muted hover:text-foreground"
  }`;
  const inner = (
    <>
      <span
        className={`relative grid h-8 w-12 place-items-center rounded-full transition-colors ${
          active ? "bg-primary/15" : "group-active:bg-foreground/5"
        }`}
      >
        {icon}
        {dot && <span className="absolute right-2 top-0.5 size-2 rounded-full bg-primary ring-2 ring-surface" aria-label="New" />}
      </span>
      <span className="max-w-full truncate px-0.5">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} aria-current={active ? "page" : undefined} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

function YouSheet({ session, open, onClose }: { session: Session; open: boolean; onClose: () => void }) {
  // Escape closes; the page behind doesn't scroll while the sheet is up.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  });
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="You"
        className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] border-t-2 border-border bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border-strong" aria-hidden="true" />
        <ProfileCard session={session} />
        <p className="px-3 pb-2 pt-5 font-cofo text-xs font-bold uppercase tracking-[0.14em] text-muted">You</p>
        <ul className="flex flex-col gap-1">
          {YOU_ITEMS.map((item) => (
            <li key={item.id}>
              <NavLink item={item} active={false} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Desktop ───────────────────────── */

// "You" pages behind one row, shown as a flyout on hover/focus/click.
function YouFlyout() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={`${navItemClass(false)} ${open ? "bg-foreground/5 text-foreground" : ""}`}
      >
        {YOU_ICON}
        <span className="flex-1">You</span>
        <svg
          className={`size-4 shrink-0 transition-transform duration-200 ${open ? "translate-x-0.5" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* pl-8 is an invisible bridge (it also clears the sidebar edge), so the pointer can travel from the row to the menu */}
      <div
        className={`absolute left-full top-1/2 z-50 -translate-y-1/2 pl-8 transition-[opacity,transform,visibility] duration-150 ${
          open ? "visible translate-x-0 opacity-100" : "invisible -translate-x-1 opacity-0"
        }`}
      >
        <div role="menu" aria-label="You" className="w-64 rounded-[22px] border-2 border-border bg-surface p-2 shadow-[0_4px_0_var(--border),0_18px_40px_rgba(0,0,0,0.18)]">
          <p className="px-3 pb-1.5 pt-2 font-cofo text-xs font-bold uppercase tracking-[0.14em] text-muted">You</p>
          <ul className="flex flex-col gap-1">
            {YOU_ITEMS.map((item) => (
              <li key={item.id} role="none">
                <NavLink item={item} active={false} role="menuitem" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Shared ───────────────────────── */

// Who's logged in, plus theme toggle and log out.
function ProfileCard({ session }: { session: Session }) {
  const router = useRouter();

  return (
    <div className="rounded-[20px] border-2 border-border bg-background p-3">
      <div className="flex items-center gap-3">
        <Avatar name={session.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-cofo text-[15px] font-bold leading-tight">{session.name}</p>
          <p className="truncate text-[13px] text-muted">@{session.username}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <ThemeToggle className="size-9" />
        <button
          type="button"
          onClick={() => {
            logOut();
            toast.success("Logged out. See you soon!");
            router.push("/auth/login");
          }}
          className="btn btn-secondary btn-sm h-9 flex-1 gap-2 text-sm text-muted hover:text-red-500"
        >
          <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
            <path d="M10 17l-5-5 5-5M5 12h11" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}

const navItemClass = (active: boolean) =>
  `flex h-11 w-full items-center gap-3 rounded-2xl border-2 px-3 text-left font-cofo text-[15px] font-bold transition-colors ${
    active
      ? "border-primary/40 bg-primary/10 text-primary shadow-[0_3px_0_color-mix(in_srgb,var(--primary)_35%,transparent)]"
      : "border-transparent text-muted hover:bg-foreground/5 hover:text-foreground"
  }`;

function NavLink({ item, active, role }: { item: NavItem; active: boolean; role?: string }) {
  const content = (
    <>
      {item.icon}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} role={role} aria-current={active ? "page" : undefined} className={navItemClass(active)}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" role={role} onClick={() => toast.warning(`${item.label} is coming soon!`)} className={navItemClass(active)}>
      {content}
    </button>
  );
}

function Logo() {
  return (
    <Link href="/home" className="relative font-headline text-[1.75rem] leading-none tracking-[-0.02em]">
      Thynk
      <Mascot className="pointer-events-none absolute -top-[0.42em] left-full -ml-[0.12em] size-[0.72em] rotate-12 select-none" />
    </Link>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-cofo text-sm font-bold text-primary-foreground shadow-[0_3px_0_var(--primary-shadow)]">
      {initials}
    </span>
  );
}

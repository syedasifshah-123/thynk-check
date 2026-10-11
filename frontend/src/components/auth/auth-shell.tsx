import { Mascot } from "@/components/mascot";

type AuthShellProps = {
  title: string;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  /** Smaller mascot for taller forms, so the page still fits a ~650px laptop viewport. */
  compact?: boolean;
  children: React.ReactNode;
};

// Shared layout for every /auth page: centered column, bouncing mascot, serif heading.
export function AuthShell({ title, subtitle, footer, compact = false, children }: AuthShellProps) {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center px-4 py-4">
      <div className="w-full max-w-[540px]">
        <Mascot className={`pointer-events-none mx-auto mb-3 block select-none ${compact ? "size-14" : "size-16"}`} />

        <h1 className="text-center font-headline text-4xl leading-none tracking-[-0.02em] sm:text-[2.5rem]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-center text-muted">{subtitle}</p>}

        {children}

        {footer && <p className="mt-6 text-center text-muted">{footer}</p>}
      </div>
    </main>
  );
}

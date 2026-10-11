"use client";

import { useEffect, useState } from "react";

/**
 * Loading flag for a submit. Resets when the component is hidden: the router keeps
 * visited pages alive in the background, so without this a form you navigated away
 * from would come back still spinning.
 */
export function usePending<T = boolean>(initial: T) {
  const [pending, setPending] = useState<T>(initial);
  useEffect(() => () => setPending(initial), [initial]);
  return [pending, setPending] as const;
}

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending: boolean;
  pendingText: string;
};

// A .btn that swaps its label for a spinner + pendingText while `pending`.
export function LoadingButton({ pending, pendingText, children, className = "", disabled, ...props }: LoadingButtonProps) {
  return (
    <button {...props} disabled={disabled || pending} aria-busy={pending} className={`${className} gap-2.5 disabled:cursor-wait`}>
      {pending ? (
        <>
          <Spinner />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Spinner({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0 animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

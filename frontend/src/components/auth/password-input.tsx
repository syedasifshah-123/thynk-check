"use client";

import { useState } from "react";

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

// Pill .field with a Show/Hide toggle.
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className="field pr-20" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-6 top-1/2 -translate-y-1/2 font-cofo text-sm font-bold text-muted hover:text-foreground"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

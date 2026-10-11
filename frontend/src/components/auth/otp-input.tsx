"use client";

import { useRef } from "react";

export const OTP_LENGTH = 6;

type OtpInputProps = {
  digits: string[];
  onChange: (digits: string[]) => void;
  /** Fires once every box is filled. */
  onComplete?: (code: string) => void;
  invalid?: boolean;
  disabled?: boolean;
};

// Six single-digit boxes: auto-advance, backspace/arrow navigation, and paste or
// SMS/email autofill of the whole code into any box.
export function OtpInput({ digits, onChange, onComplete, invalid = false, disabled = false }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function focusBox(index: number) {
    refs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();
  }

  // Write digits from `text` starting at `start`, then move focus past the last one written.
  function fill(start: number, text: string) {
    const incoming = text.replace(/\D/g, "");
    if (!incoming) return;

    const next = digits.slice();
    let index = start;
    for (const digit of incoming) {
      if (index >= OTP_LENGTH) break;
      next[index++] = digit;
    }
    onChange(next);
    focusBox(index);
    if (next.every(Boolean)) onComplete?.(next.join(""));
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = digits.slice();
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focusBox(index - 1);
      }
      onChange(next);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  return (
    <div className="grid grid-cols-6 justify-items-center gap-2 sm:gap-3" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid}
          data-filled={Boolean(digit)}
          disabled={disabled}
          value={digit}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => {
            e.preventDefault();
            fill(index, e.clipboardData.getData("text"));
          }}
          onChange={(e) => {
            // Typing over an existing digit leaves two characters; keep the new one.
            const raw = e.target.value;
            fill(index, digit && raw.length > 1 ? raw.replace(digit, "") : raw);
          }}
          className="otp-box"
        />
      ))}
    </div>
  );
}

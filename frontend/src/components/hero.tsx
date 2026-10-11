import Link from "next/link";
import { Mascot } from "./mascot";

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8 sm:py-28">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Below md the headline wraps unpredictably, so the mascot sits on its own above it */}
        <Mascot className="pointer-events-none mb-4 size-20 select-none sm:size-24 md:hidden" />

        <h1 className="isolate text-balance font-headline md:text-wrap text-[2.5rem] leading-[1.08] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Train your brain{" "}
          <span className="relative inline-block">
            {/* From md up "to" ends the first line, so the mascot peeks out from behind it */}
            <Mascot className="pointer-events-none absolute -right-[0.62em] -top-[0.5em] -z-10 hidden size-[0.95em] rotate-12 select-none md:block" />
            to
          </span>{" "}
          thynk sharper
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-8 sm:text-xl">
          Bite-sized puzzles, logic and math challenges that make you a faster,
          clearer thynker. Just a few minutes a day.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/learn" className="btn btn-primary h-14 w-full px-10 text-lg sm:h-[64px] sm:w-[300px] sm:text-xl">
            Start thynking
          </Link>
          <Link href="/auth/signup" className="btn btn-secondary h-14 w-full px-10 text-lg sm:h-[64px] sm:w-[300px] sm:text-xl">
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

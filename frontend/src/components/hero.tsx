import Link from "next/link";
import { Mascot } from "./mascot";

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="isolate font-headline text-5xl leading-[1.08] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]">
          Train your brain{" "}
          <span className="relative inline-block">
            {/* Mascot peeks out from behind "to" */}
            <Mascot className="pointer-events-none absolute -right-[0.62em] -top-[0.5em] -z-10 size-[0.95em] rotate-12 select-none" />
            to
          </span>{" "}
          thynk sharper
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          Bite-sized puzzles, logic and math challenges that make you a faster,
          clearer thynker. Just a few minutes a day.
        </p>

        <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Link href="/learn" className="btn btn-primary h-[64px] w-full px-10 text-xl sm:w-[300px]">
            Start thynking
          </Link>
          <Link href="/auth/signup" className="btn btn-secondary h-[64px] w-full px-10 text-xl sm:w-[300px]">
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { BranchSpec } from "./define";

export const NUMBER_THEORY: BranchSpec = {
  id: "number-theory",
  title: "Number Theory",
  subtitle: "Properties of Integers",
  description: "Divisibility, primes, remainders and the hidden patterns of whole numbers, from clever tricks to elegant proofs.",
  color: { main: "#f5b301", shadow: "#c98f00", ink: "#2a1f00" },
  tier: 0,
  levels: [
    {
      title: "Divisibility and Integer Properties",
      topics:
        "Divisibility: factors and multiples; divisibility rules for 2, 3, 4, 5, 9, 10 | Parity: odd and even; sums and products of parities | Division algorithm: quotient and remainder",
    },
    {
      title: "Prime Numbers and Prime Factorization",
      topics:
        "Primes: definition; sieve of Eratosthenes; infinitely many primes | Factorization: factor trees; prime factorization; uniqueness | Applications: counting divisors; perfect squares",
    },
    {
      title: "Greatest Common Divisor and Least Common Multiple",
      topics:
        "GCD: listing factors; using prime factorization | Euclidean algorithm: repeated division; Bézout's identity | LCM: from prime factors; GCD × LCM = a × b; word problems",
    },
    {
      title: "Modular Arithmetic and Congruences",
      topics:
        "Clock arithmetic: remainders; congruence notation | Operations: adding and multiplying mod n; modular inverses | Applications: last digits; check digits; divisibility proofs",
    },
    {
      title: "Diophantine Equations",
      topics:
        "Linear Diophantine equations: ax + by = c; existence of solutions | Finding solutions: particular and general solutions | Nonlinear cases: Pythagorean triples; sums of squares",
    },
    {
      title: "Prime Patterns and Number-Theoretic Functions",
      topics:
        "Arithmetic functions: number of divisors; sum of divisors; Euler's totient | Theorems: Fermat's little theorem; Euler's theorem | Prime patterns: twin primes; prime gaps; open problems",
    },
    {
      title: "Advanced Number Theory and Proofs",
      topics:
        "Proof techniques: induction; contradiction; infinite descent | Chinese remainder theorem: systems of congruences | Cryptography: RSA; primality testing",
    },
  ],
};

// A tiny, dependency-free expression parser for checking algebraic answers by value,
// not by spelling: "2(x+3)", "2x + 6" and "6 + x*2" are all equivalent.
//
// Grammar (lowest → highest precedence):
//   sum     := product (("+" | "-") product)*
//   product := unary (("*" | "/" | implicit) unary)*
//   unary   := ("-" | "+") unary | power
//   power   := atom ("^" unary)?            (right-associative)
//   atom    := number | variable | "(" sum ")"
// Implicit multiplication: 2x, 3(x+1), (x+1)(x-1), x y.

import { normalise } from "./numbers";

type Node =
  | { op: "num"; value: number }
  | { op: "var"; name: string }
  | { op: "neg"; arg: Node }
  | { op: "+" | "-" | "*" | "/" | "^"; left: Node; right: Node };

type Tok = { t: "num"; v: number } | { t: "var"; v: string } | { t: "op"; v: string };

function tokenize(source: string): Tok[] | null {
  const text = normalise(source).replace(/²/g, "^2").replace(/³/g, "^3");
  const toks: Tok[] = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === " ") {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const m = /^\d*\.?\d+|^\d+\.?/.exec(text.slice(i));
      if (!m) return null;
      toks.push({ t: "num", v: Number(m[0]) });
      i += m[0].length;
    } else if (/[a-zA-Z]/.test(c)) {
      toks.push({ t: "var", v: c }); // single-letter variables: "xy" = x·y
      i++;
    } else if ("+-*/^()".includes(c)) {
      toks.push({ t: "op", v: c });
      i++;
    } else {
      return null;
    }
  }
  return toks;
}

export function parseExpression(source: string): Node | null {
  const tokens = tokenize(source);
  if (!tokens || tokens.length === 0) return null;
  const toks = tokens;
  let pos = 0;
  const peek = () => toks[pos];
  const isOp = (v: string) => peek()?.t === "op" && peek().v === v;

  function sum(): Node | null {
    let left = product();
    while (left && (isOp("+") || isOp("-"))) {
      const op = toks[pos++].v as "+" | "-";
      const right = product();
      if (!right) return null;
      left = { op, left, right };
    }
    return left;
  }

  function startsAtom() {
    const t = peek();
    return t && (t.t === "num" || t.t === "var" || (t.t === "op" && t.v === "("));
  }

  function product(): Node | null {
    let left = unary();
    while (left) {
      if (isOp("*") || isOp("/")) {
        const op = toks[pos++].v as "*" | "/";
        const right = unary();
        if (!right) return null;
        left = { op, left, right };
      } else if (startsAtom()) {
        const right = power(); // implicit multiplication binds like "*"
        if (!right) return null;
        left = { op: "*", left, right };
      } else break;
    }
    return left;
  }

  function unary(): Node | null {
    if (isOp("-")) {
      pos++;
      const arg = unary();
      return arg && { op: "neg", arg };
    }
    if (isOp("+")) {
      pos++;
      return unary();
    }
    return power();
  }

  function power(): Node | null {
    const base = atom();
    if (base && isOp("^")) {
      pos++;
      const exp = unary();
      return exp && { op: "^", left: base, right: exp };
    }
    return base;
  }

  function atom(): Node | null {
    const t = peek();
    if (!t) return null;
    if (t.t === "num") {
      pos++;
      return { op: "num", value: t.v };
    }
    if (t.t === "var") {
      pos++;
      return { op: "var", name: t.v };
    }
    if (t.v === "(") {
      pos++;
      const inner = sum();
      if (!inner || !isOp(")")) return null;
      pos++;
      return inner;
    }
    return null;
  }

  const tree = sum();
  return tree && pos === toks.length ? tree : null;
}

export function evaluate(node: Node, vars: Record<string, number>): number {
  switch (node.op) {
    case "num":
      return node.value;
    case "var":
      return vars[node.name] ?? NaN;
    case "neg":
      return -evaluate(node.arg, vars);
    case "+":
      return evaluate(node.left, vars) + evaluate(node.right, vars);
    case "-":
      return evaluate(node.left, vars) - evaluate(node.right, vars);
    case "*":
      return evaluate(node.left, vars) * evaluate(node.right, vars);
    case "/":
      return evaluate(node.left, vars) / evaluate(node.right, vars);
    case "^":
      return Math.pow(evaluate(node.left, vars), evaluate(node.right, vars));
  }
}

/** Variable names used in an expression. */
export function variablesOf(node: Node, out = new Set<string>()): Set<string> {
  if (node.op === "var") out.add(node.name);
  else if (node.op === "neg") variablesOf(node.arg, out);
  else if (node.op !== "num") {
    variablesOf(node.left, out);
    variablesOf(node.right, out);
  }
  return out;
}

// Fixed, "awkward" sample points so coincidental matches are practically impossible,
// and results are deterministic (no Math.random).
const SAMPLES = [1.37, -2.41, 0.53, 3.19, -0.77, 2.03, 5.61];

/**
 * True when `answer` equals `expected` for every sample value of the variables.
 * Uses only the allowed variables: an answer that introduces a new letter is not equivalent.
 */
export function equivalent(answer: string, expected: string, variables: string[]): boolean | null {
  const a = parseExpression(answer);
  const e = parseExpression(expected);
  if (!a || !e) return null;
  for (const name of variablesOf(a)) if (!variables.includes(name)) return false;

  let compared = 0;
  for (let k = 0; k < SAMPLES.length; k++) {
    const vars = Object.fromEntries(variables.map((v, i) => [v, SAMPLES[(k + i * 2) % SAMPLES.length] + i * 0.11]));
    const want = evaluate(e, vars);
    if (!Number.isFinite(want)) continue; // e.g. division by zero at this point
    const got = evaluate(a, vars);
    if (!Number.isFinite(got) || Math.abs(got - want) > 1e-7 * Math.max(1, Math.abs(want))) return false;
    compared++;
  }
  return compared > 0;
}

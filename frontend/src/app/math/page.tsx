import type { Metadata } from "next";
import { MathView } from "./math-view";

export const metadata: Metadata = {
  title: "Math · Thynk",
};

export default function MathPage() {
  return <MathView />;
}

"use client";

import dynamic from "next/dynamic";

const NeuralBackground = dynamic(
  () => import("@/components/ui/neural-background"),
  { ssr: false }
);

export function NeuralWrapper() {
  return <NeuralBackground />;
}
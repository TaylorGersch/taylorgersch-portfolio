import type { Metadata } from "next";
import LockScreen from "./LockScreen";

export const metadata: Metadata = {
  title: "Taylor Gersch — Secure",
};

export default async function LockedPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <LockScreen from={from} />;
}

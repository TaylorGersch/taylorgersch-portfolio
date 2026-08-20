"use client";

import Image from "next/image";
import { useActionState } from "react";
import { unlock, type UnlockState } from "./actions";

const initialState: UnlockState = {};

export default function LockScreen({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(unlock, initialState);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <Image
        src="/images/lock-bg.webp"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="absolute top-6 left-6 z-10 sm:top-10 sm:left-10">
        <p className="text-sm font-semibold tracking-wide text-white">HI</p>
        <p className="text-sm text-white/60">Welcome in.</p>
      </div>

      <form action={formAction} className="relative z-10 w-[280px] sm:w-[336px]">
        <input type="hidden" name="from" value={from ?? ""} />
        <div className="flex items-center justify-between border border-white/50 px-4 py-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
          />
          <button
            type="submit"
            aria-label="Submit password"
            disabled={pending}
            className="ml-3 shrink-0 text-white/80 transition-colors hover:text-white disabled:opacity-40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2" y1="10" x2="17" y2="10" />
              <path d="M11 4l6 6-6 6" />
            </svg>
          </button>
        </div>
        {state.error && (
          <p className="mt-3 text-sm text-red-200">{state.error}</p>
        )}
      </form>
    </main>
  );
}

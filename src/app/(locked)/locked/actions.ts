"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOCK_COOKIE_MAX_AGE,
  LOCK_COOKIE_NAME,
  LOCK_COOKIE_VALUE,
  SITE_PASSWORD,
} from "@/lib/site-lock";

export type UnlockState = { error?: string };

export async function unlock(
  _prevState: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = formData.get("password");
  const from = formData.get("from");
  const destination =
    typeof from === "string" && from.startsWith("/") ? from : "/";

  if (typeof password !== "string" || password !== SITE_PASSWORD) {
    return { error: "That password didn't work — try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCK_COOKIE_NAME, LOCK_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LOCK_COOKIE_MAX_AGE,
  });

  redirect(destination);
}

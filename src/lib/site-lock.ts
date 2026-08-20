/**
 * Soft access gate for the site while it's in preview (before the real
 * domain is pointed at this deployment). Not meant to protect sensitive
 * data — just to keep the unfinished site from being casually stumbled on.
 *
 * The password defaults to "taylorworks" so this works immediately on a
 * fresh deploy. To change the password without touching code, set a
 * SITE_PASSWORD environment variable in the Vercel project settings.
 */
export const SITE_PASSWORD = process.env.SITE_PASSWORD || "taylorworks";

export const LOCK_COOKIE_NAME = "tg_site_access";

// Not a hash of the password — just a fixed token that proves the cookie
// was set by our own unlock action rather than guessed by a visitor typing
// "granted" into devtools by coincidence.
export const LOCK_COOKIE_VALUE = "tg-portfolio-2026-granted";

export const LOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

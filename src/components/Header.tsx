import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10 bg-white/90 backdrop-blur">
      <Link href="/" className="text-lg tracking-tight text-neutral-900">
        Taylor Gersch
      </Link>
      <Link
        href="/#contact"
        className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
      >
        Contact
      </Link>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WaxSeal from "@/app/components/WaxSeal";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/lib/site";

const vaultCtaClass =
  "ds-focus-ring inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-wax px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-px hover:brightness-[0.94] active:translate-y-0 active:brightness-[0.88] motion-reduce:transition-none";

const navLinkClass =
  "ds-focus-ring rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-ink-soft transition-colors hover:text-wax";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300 motion-reduce:transition-none",
        scrolled
          ? "border-ink/[0.08] bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container as="div" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="ds-focus-ring group inline-flex items-center gap-2.5 rounded-[var(--radius-sm)]"
        >
          <WaxSeal size="mark" className="transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100" />
          <span className="font-display text-lg tracking-tight text-ink">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <Link href="/app" className={cn(vaultCtaClass, "ml-2")}>
            Open your vault
          </Link>
        </nav>

        <button
          type="button"
          className="ds-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 bg-ink transition-transform duration-200 motion-reduce:transition-none",
                menuOpen ? "top-2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-2 block h-0.5 w-5 bg-ink transition-opacity duration-200 motion-reduce:transition-none",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 bg-ink transition-transform duration-200 motion-reduce:transition-none",
                menuOpen ? "top-2 -rotate-45" : "top-4",
              )}
            />
          </span>
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-ink/[0.08] bg-paper/95 backdrop-blur-md md:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile">
          <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(navLinkClass, "px-0 py-2.5")}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app"
            className={cn(vaultCtaClass, "mt-2 w-full")}
            onClick={() => setMenuOpen(false)}
          >
            Open your vault
          </Link>
          </Container>
        </nav>
      </div>
    </header>
  );
}

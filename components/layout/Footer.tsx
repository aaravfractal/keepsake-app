import Link from "next/link";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const linkClass =
  "text-sm text-ink-soft transition-colors hover:text-wax ds-focus-ring rounded-[var(--radius-sm)]";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Open your vault", href: "/app" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Plans", href: "/#plans" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Security", href: "/privacy#security" },
      { label: "Your ownership", href: "/privacy#ownership" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "Docs", href: "/docs" },
      { label: "GitHub", href: site.repoUrl, external: true },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X", href: site.xUrl, external: true },
      { label: "Email", href: `mailto:${site.contactEmail}`, external: true },
    ],
  },
] as const;

function FooterLink({
  label,
  href,
  external,
  placeholder,
}: {
  label: string;
  href: string;
  external?: boolean;
  placeholder?: boolean;
}) {
  const className = cn(
    linkClass,
    placeholder && "cursor-help opacity-75",
  );
  const title = placeholder
    ? `${label} — placeholder: replace ${href.replace(/^mailto:/, "")} in lib/site.ts`
    : undefined;

  if (placeholder) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        aria-label={`${label} (placeholder link)`}
      >
        {label}
      </a>
    );
  }

  if (external) {
    const isMailto = href.startsWith("mailto:");
    return (
      <a
        href={href}
        className={className}
        {...(!isMailto && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/[0.08] bg-paper-2/50">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-caption mb-4 uppercase">{column.title}</h2>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption">© 2026 Keepsake</p>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-3 py-1 text-caption uppercase">
            Built on 0G
          </span>

          <p className="font-display text-sm italic text-ink-soft sm:text-right">
            {site.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}

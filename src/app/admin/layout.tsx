import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Admin layout - no header/footer from main site.
// Defense in depth: proxy handles auth, this layout prevents rendering admin
// if proxy is absent/misconfigured or env flags are not explicitly enabled.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminEnabled = process.env.ADMIN_ENABLED === "true";
  const hasCredentials = Boolean(
    process.env.ADMIN_BASIC_USER && process.env.ADMIN_BASIC_PASSWORD,
  );

  if (!adminEnabled || !hasCredentials) {
    notFound();
  }

  return <>{children}</>;
}

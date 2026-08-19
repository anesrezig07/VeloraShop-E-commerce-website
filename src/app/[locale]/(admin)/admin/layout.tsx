import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { getAdminSession } from "@/lib/admin/session";
import { getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout(props: LayoutProps<"/[locale]/admin">) {
  const currentLocale = await getLocale();

  const session = await getAdminSession();
  if (!session) {
    redirect(`/${currentLocale}/admin/login`);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 lg:px-6">
          <Link
            href={`/${currentLocale}/admin`}
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
              V
            </span>
            <span className="hidden sm:inline">
              Velora<span className="text-primary">.</span>{" "}
              <span className="text-muted-foreground">Admin</span>
            </span>
          </Link>
          <div className="ms-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20">
            <AdminSidebarNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-10">{props.children}</main>
      </div>
    </div>
  );
}
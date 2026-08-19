import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/admin/session";
import { getDictionary, getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const session = await getAdminSession();
  if (session) {
    redirect(`/${currentLocale}/admin`);
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <Link
          href={`/${currentLocale}`}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            V
          </span>
          Velora<span className="text-primary">.</span>
        </Link>
        <h1 className="mt-6 font-heading text-xl font-bold">
          {dict.admin.loginTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dict.admin.loginSubtitle}
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSignIn } from "@/lib/actions/admin-auth";
import { useDictionary, useLocale } from "@/i18n/client";

export function AdminLoginForm() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotConfigured(false);

    startTransition(async () => {
      const result = await adminSignIn(email, password);
      if (result.ok) {
        router.push(`/${locale}/admin`);
        router.refresh();
      } else if (result.notConfigured) {
        setNotConfigured(true);
      } else if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {notConfigured ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          {dict.admin.notConfigured}
        </div>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive">
          {dict.admin[error as keyof typeof dict.admin] ?? dict.admin.invalidCredentials}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{dict.admin.email}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{dict.admin.password}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? dict.admin.signingIn : dict.admin.signIn}
      </Button>
    </form>
  );
}
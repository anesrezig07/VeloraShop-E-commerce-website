import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/i18n/server";

export default async function NotFound() {
  const dict = await getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-5xl font-black tracking-tight">404</p>
      <h1 className="text-2xl font-bold">
        {dict.confirmation.notFound}
      </h1>
      <p className="text-muted-foreground">
        {dict.confirmation.notFoundDescription}
      </p>
      <Link href="/" className={buttonVariants()}>
        {dict.common.back}
      </Link>
    </main>
  );
}
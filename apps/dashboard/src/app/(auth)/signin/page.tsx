import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ redirect: string }>;
}) {
  const { redirect } = await params;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-3xl flex-col gap-15">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium text-h2"
        >
          <div className="flex size-14 items-center justify-center rounded-md grow">
            <Image
              src={"/img/unipro_logo.webp"}
              width={120}
              height={120}
              alt="UniProjectのロゴ"
              className="size-14"
            />
          </div>
          UniProject 役員会サイト
        </Link>
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
}

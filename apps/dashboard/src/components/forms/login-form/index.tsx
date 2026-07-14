"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { signIn } from "@/libs/auth-client";
import { cn } from "@/libs/utils";

export function LoginForm({
  className,
  redirect,
  ...props
}: React.ComponentProps<"div"> & { redirect: string }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-h3">おかえりなさい！</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className={"font-medium"}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    await signIn.oauth2({
                      providerId: "unique",
                      callbackURL: `${window.location.origin}${redirect || ""}`,
                    });
                  }}
                >
                  <div className="flex size-10 items-center justify-center rounded-md">
                    <Image
                      src={"/img/unique.png"}
                      width={120}
                      height={120}
                      alt="UniQUEのロゴ"
                      className="size-10"
                    />
                  </div>
                  {isLoading ? "ロード中" : "UniQUEでログイン"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        クリックして続行すると <Link href="#">利用規約</Link> と{" "}
        <Link href="#">プライバシー・ポリシー</Link>{" "}
        に同意したものとみなします。
      </FieldDescription>
    </div>
  );
}

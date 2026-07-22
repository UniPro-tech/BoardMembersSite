"use client";

import type { ElectionDTO } from "@board/shared/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../../ui/input-group";
import { standAction } from "./server/action";
import { formSchema } from "./shared/schema";

export default function StandCandidateForm({
  election,
}: {
  election: ElectionDTO;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise(
      standAction({
        data,
        electionId: election.id,
      }),
      {
        loading: "送信中...",
        success: (data) => {
          router.push(data);
          return "立候補を受付ました！";
        },
        error: (e: Error) => {
          if (e.message === "ログインしてください。") {
            router.push("/signin");
            return {
              message: "エラーが発生しました",
              description: e.message,
            };
          }
          return {
            message: "エラーが発生しました",
            description: e.message,
          };
        },
      },
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldTitle>立候補届出</FieldTitle>
            <FieldDescription>
              下記項目を入力して立候補の届出を行います。
            </FieldDescription>
            <FieldGroup>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">説明</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="description"
                        placeholder={`例) エンジニアのゆにぷろ太郎です。これまで私は〜...私が当選した際には〜...`}
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                        required
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length} 文字 (制限なし)
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit" size={"sm"}>
              作成
            </Button>
            <Button variant="outline" type="button">
              キャンセル
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

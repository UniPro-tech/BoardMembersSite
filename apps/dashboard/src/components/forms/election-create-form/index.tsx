"use client";

import type { Election } from "@board/shared/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { createElectionAction } from "./server/action";
import { formSchema } from "./shared/schema";

export function ElectionCreateForm({
  isRunoff,
  parentElection,
  defaultCapacity,
}: {
  isRunoff?: boolean;
  parentElection?: Election;
  defaultCapacity?: number;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: defaultCapacity,
      standDeadline: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise(
      createElectionAction({
        data,
        isRunoff,
        parentElectionId: parentElection?.id,
      }),
      {
        loading: "送信中...",
        success: (data) => {
          router.push(data);
          return "選挙を作成しました！";
        },
        error: (e: Error) => {
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
            <FieldTitle>選挙の作成</FieldTitle>
            <FieldDescription>
              下記項目を入力して新規選挙イベントを作成します。
            </FieldDescription>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">選挙名</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      aria-invalid={fieldState.invalid}
                      placeholder="例) 第3回 UniProject 役員選挙"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
                        placeholder={`例) さて、UniProjectの3年目です。 欠員なし、3回目の役員総選挙です。\n## 募集人数\n今回は、代表役員、顧問を合わせて合計7人の役員会を...`}
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
                    <FieldDescription>
                      Markdownを許容しています。
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name={"capacity"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="capacity">定員</FieldLabel>
                    <Input
                      {...field}
                      id="capacity"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type={"number"}
                      required
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name={"startAt"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="startAt">開始時刻</FieldLabel>
                    <Input
                      {...field}
                      id="startAt"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type={"datetime-local"}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {!isRunoff && (
                <Controller
                  name={"standDeadline"}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="standDeadline">
                        立候補締切日
                      </FieldLabel>
                      <Input
                        {...field}
                        id="startAt"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        type={"datetime-local"}
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
              <Controller
                name={"endAt"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endAt">終了日時</FieldLabel>
                    <Input
                      {...field}
                      id="endAt"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type={"datetime-local"}
                      required
                    />
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

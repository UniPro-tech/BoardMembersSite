"use client";

import type { Election } from "@board/shared/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "タイトルは5文字以上で入力してください。")
      .max(256, "タイトルは256文字以内で入力してください。"),
    description: z
      .string()
      .min(20, "ユーザービリティのため20文字以上は入力してください。"),
    capacity: z.number().min(1, "定員は1名以上である必要があります。"),
    startAt: z.iso.datetime(),
    standDeadline: z.string(),
    endAt: z.iso.datetime(),
  })
  .refine((data) => {
    const now = new Date();
    const startAt = new Date(data.startAt);
    const standDeadline =
      data.standDeadline !== "" && new Date(data.standDeadline);
    const endAt = new Date(data.endAt);
    const errors = {
      startAt: undefined,
      standDeadline: undefined,
      endAt: undefined,
    } as {
      startAt?: string;
      standDeadline?: string;
      endAt?: string;
    };
    if (now > startAt) {
      errors.startAt = "現在時刻よりも早い時間を指定することはできません。";
    }
    if (standDeadline) {
      if (startAt > standDeadline) {
        errors.standDeadline =
          "開始時刻よりも早い時刻を設定することはできません。";
      }
      if (standDeadline > endAt) {
        errors.endAt =
          "立候補締め切り時刻よりも早い時刻を設定することはできません。";
      }
    } else {
      if (startAt > endAt) {
        errors.standDeadline =
          "開始時刻よりも早い時刻を設定することはできません。";
      }
    }
    return errors;
  });

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

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("これらの内容で送信しました:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <Card className="w-full sm:max-w-4xl">
      <CardHeader>
        <CardTitle>選挙の作成</CardTitle>
        <CardDescription>
          下記項目を入力して新規選挙イベントを作成します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
                    defaultValue={0}
                    autoComplete="off"
                    type={"number"}
                    required
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
                    defaultValue={0}
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
            <input
              type="hidden"
              name="isRunoff"
              value={isRunoff ? "true" : "false"}
            />
            {isRunoff ? (
              <input
                type="hidden"
                name="parentElectionId"
                value={parentElection ? parentElection.id : ""}
              />
            ) : (
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
                      defaultValue={0}
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
                    defaultValue={0}
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
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button type="submit" form="form-rhf-demo">
            送信
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

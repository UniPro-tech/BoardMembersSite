import * as z from "zod";

export const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "タイトルは5文字以上で入力してください。")
      .max(256, "タイトルは256文字以内で入力してください。"),
    description: z
      .string()
      .min(20, "ユーザービリティのため20文字以上は入力してください。"),
    capacity: z.number().int().min(1, "定員は1名以上である必要があります。"),
    startAt: z.string(),
    standDeadline: z.string(),
    endAt: z.string(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const startAt = new Date(data.startAt);
    const standDeadline =
      data.standDeadline !== "" && new Date(data.standDeadline);
    const endAt = new Date(data.endAt);
    if (now > startAt) {
      ctx.addIssue({
        path: ["startAt"],
        code: "custom",
        message: "現在時刻よりも早い時間を指定することはできません。",
      });
    }
    if (standDeadline) {
      if (startAt > standDeadline) {
        ctx.addIssue({
          path: ["standDeadline"],
          code: "custom",
          message: "開始時刻よりも早い時刻を設定することはできません。",
        });
      }
      if (standDeadline > endAt) {
        ctx.addIssue({
          path: ["endAt"],
          code: "custom",
          message:
            "立候補締め切り時刻よりも早い時刻を設定することはできません。",
        });
      }
    } else {
      if (startAt > endAt) {
        ctx.addIssue({
          path: ["endAt"],
          code: "custom",
          message: "開始時刻よりも早い時刻を設定することはできません。",
        });
      }
    }
  });

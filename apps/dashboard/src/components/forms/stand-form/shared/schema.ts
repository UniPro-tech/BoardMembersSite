import * as z from "zod";

export const formSchema = z.object({
  description: z.string().min(1, "一言を入力してください。"),
});

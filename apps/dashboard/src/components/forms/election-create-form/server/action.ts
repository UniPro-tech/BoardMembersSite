"use server";
import "server-only";

import { Election } from "@board/shared/classes";
import type * as z from "zod";
import { formSchema } from "../shared/schema";

export const createElectionAction = async (params: {
  data: z.infer<typeof formSchema>;
  isRunoff?: boolean;
  parentElectionId?: string;
}): Promise<string> => {
  const { data, isRunoff, parentElectionId } = params;
  const validationResult = formSchema.safeParse(data);
  if (!validationResult.success) {
    console.error("Validation Error:", validationResult.error);
    throw new Error("不正な入力です。");
  }
  const parentElection =
    isRunoff && parentElectionId
      ? await Election.findById(parentElectionId)
      : null;

  if (isRunoff && !parentElection) {
    throw new Error("親選挙が見つかりません");
  }

  const { title, description, capacity, startAt, standDeadline, endAt } = data;

  const response = isRunoff
    ? // biome-ignore lint/style/noNonNullAssertion: 親選挙の存在は上でチェックしているため、ここでは非nullアサーションを使用する
      await parentElection!.createRunoffElection(
        title,
        description,
        capacity,
        new Date(startAt),
        null,
        new Date(endAt),
      )
    : await Election.create(
        title,
        description,
        capacity,
        false,
        parentElectionId,
        new Date(startAt),
        new Date(standDeadline),
        new Date(endAt),
      );

  return response.id;
};

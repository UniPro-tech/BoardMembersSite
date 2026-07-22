"use server";
import "server-only";

import { Candidate, Election } from "@board/shared/classes";
import { headers } from "next/headers";
import type * as z from "zod";
import { auth } from "@/libs/auth";
import { formSchema } from "../shared/schema";

export const standAction = async (params: {
  data: z.infer<typeof formSchema>;
  electionId: string;
}): Promise<string> => {
  const { data, electionId } = params;
  const validationResult = formSchema.safeParse(data);
  if (!validationResult.success) {
    console.error("Validation Error:", validationResult.error);
    throw new Error("不正な入力です。");
  }

  const election = await Election.findById(electionId);
  if (!election) throw new Error("不正な入力です。");
  if (!election.canStand) throw new Error("立候補可能な投票ではありません。");

  const { description } = data;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("ログインしてください。");

  const response = await Candidate.create(
    session.user.id,
    electionId,
    description,
  );

  return `/elections/${electionId}#${response.id}`;
};

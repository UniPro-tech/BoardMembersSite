"use server";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Election } from "@/classes/Election";
import { auth } from "@/libs/auth";

export const standAction = async (formData: FormData) => {
  const electionId = formData.get("electionId") as string;
  const description = formData.get("description") as string | undefined;

  if (!electionId) {
    throw new Error("選挙IDが必要です");
  }

  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error("選挙が見つかりません");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  if (!election.canStand) {
    throw new Error("立候補受付期間外です");
  }

  await election.addCandidate(session?.user.id, description);

  redirect(`/elections/${election.id}?standSuccess=true`);
};

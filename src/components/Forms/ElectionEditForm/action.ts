"use server";

import { redirect } from "next/navigation";
import { Election } from "@/classes/Election";
import { parseDatetimeLocalAsJST } from "@/libs/date";

export const updateElectionAction = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | undefined;
  const startAt = parseDatetimeLocalAsJST(formData.get("startAt") as string);
  const standDeadline = formData.get("standDeadline")
    ? parseDatetimeLocalAsJST(formData.get("standDeadline") as string)
    : null;
  const endAt = parseDatetimeLocalAsJST(formData.get("endAt") as string);
  const id = formData.get("electionId") as string;
  const capacity = formData.get("capacity") as string | undefined;
  const parentElectionId = formData.get("parentElectionId") as
    | string
    | undefined;
  const isRunoff = formData.get("isRunoff") === "true";

  if (!id) {
    throw new Error("選挙IDが不足しています");
  }

  if (!title || !startAt || !standDeadline || !endAt) {
    throw new Error("必要なフィールドが不足しています");
  }

  if (
    Number.isNaN(startAt.getTime()) ||
    Number.isNaN(standDeadline.getTime()) ||
    Number.isNaN(endAt.getTime())
  ) {
    throw new Error("日付の形式が正しくありません");
  }

  if (startAt >= endAt) {
    throw new Error("開始日時は終了日時より前でなければなりません");
  }

  if (standDeadline >= endAt) {
    throw new Error("立候補締切日時は終了日時より前でなければなりません");
  }

  const response = await Election.updateById(
    id,
    title,
    description,
    capacity ? parseInt(capacity, 10) : undefined,
    parentElectionId,
    isRunoff,
    startAt,
    standDeadline,
    endAt,
  );

  redirect(`/elections/${response.id}`);
};

export const deleteElectionAction = async (formData: FormData) => {
  const id = formData.get("electionId") as string;

  if (!id) {
    throw new Error("選挙IDが不足しています");
  }

  const election = await Election.findById(id);
  if (!election) {
    throw new Error("選挙が見つかりません");
  }

  await election.delete();

  redirect("/elections");
};

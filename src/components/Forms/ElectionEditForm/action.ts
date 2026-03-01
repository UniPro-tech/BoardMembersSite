"use server";

import { redirect } from "next/navigation";
import { Election } from "@/classes/Election";

export const updateElectionAction = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | undefined;
  const startAt = new Date(formData.get("startAt") as string);
  const standDeadline = new Date(formData.get("standDeadline") as string);
  const endAt = new Date(formData.get("endAt") as string);
  const id = formData.get("electionId") as string;

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
    startAt,
    standDeadline,
    endAt,
  );

  redirect(`/elections/${response.id}`);
};

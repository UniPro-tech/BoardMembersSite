"use server";

import { redirect } from "next/navigation";
import { Election } from "@/classes/Election";
import { parseDatetimeLocalAsJST } from "@/libs/date";

export const createElectionAction = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | undefined;
  const startAt = parseDatetimeLocalAsJST(formData.get("startAt") as string);
  const standDeadline = formData.get("standDeadline")
    ? parseDatetimeLocalAsJST(formData.get("standDeadline") as string)
    : null;
  const endAt = parseDatetimeLocalAsJST(formData.get("endAt") as string);
  const capacityValue = formData.get("capacity");
  const capacity = formData.get("capacity") ? Number(capacityValue) : undefined;
  const isRunoff = formData.get("isRunoff") === "true";
  const parentElectionId = formData.get("parentElectionId") as
    | string
    | undefined;

  if (!title || !startAt || !endAt) {
    throw new Error("必要なフィールドが不足しています");
  }

  if (
    Number.isNaN(startAt.getTime()) ||
    (standDeadline && Number.isNaN(standDeadline.getTime())) ||
    Number.isNaN(endAt.getTime())
  ) {
    throw new Error("日付の形式が正しくありません");
  }

  if (startAt >= endAt) {
    throw new Error("開始日時は終了日時より前でなければなりません");
  }

  if (standDeadline && standDeadline >= endAt) {
    throw new Error("立候補締切日時は終了日時より前でなければなりません");
  }

  const parentElection =
    isRunoff && parentElectionId
      ? await Election.findById(parentElectionId)
      : null;

  if (isRunoff && !parentElection) {
    throw new Error("親選挙が見つかりません");
  }

  const response = isRunoff
    ? await parentElection!.createRunoffElection(
        title,
        description,
        capacity,
        startAt,
        null,
        endAt,
      )
    : await Election.create(
        title,
        description,
        capacity,
        isRunoff,
        parentElectionId,
        startAt,
        standDeadline,
        endAt,
      );

  redirect(`/elections/${response.id}`);
};

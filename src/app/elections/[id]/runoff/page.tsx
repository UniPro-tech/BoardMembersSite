import { Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import { Election } from "@/classes/Election";
import ElectionCreateForm from "@/components/Forms/ElectionCreateForm";
import { auth } from "@/libs/auth";

export const dynamic = "force-dynamic";

export default async function VotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesssion = await auth.api.getSession({ headers: await headers() });
  if (!sesssion) {
    unauthorized();
  }
  if (sesssion.user.role !== "admin") {
    forbidden();
  }
  const { id } = await params;
  const parentElection = await Election.findById(id);
  if (!parentElection) {
    throw new Error("親選挙が見つかりません");
  }
  if (!parentElection.needRunoffElection()) {
    throw new Error("この選挙ではリタイア投票は不要です");
  }
  if (parentElection.endAt > new Date()) {
    throw new Error("親選挙がまだ終了していません");
  }
  const winnersCount = (await parentElection.getWinnerCandidates()).length;
  const defaultCapacity = parentElection.capacity
    ? parentElection.capacity - winnersCount
    : undefined;
  return (
    <Stack>
      <Typography variant="h4" component="h1" className="font-bold">
        選挙作成
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        新しい選挙を作成します。作成後、候補者を追加できます。
      </Typography>
      <ElectionCreateForm
        isRunoff
        parentElection={parentElection}
        defaultCapacity={defaultCapacity}
      />
    </Stack>
  );
}

import { Election } from "@board/shared/classes";
import { Stack } from "@mui/material";
import { notFound } from "next/navigation";
import CandidateList from "@/components/CandidateList";
import { ElectionCard } from "@/components/item/election-card";

export const dynamic = "force-dynamic";

export default async function ElectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const election = await Election.findById(id);
  if (!election) {
    notFound();
  }
  return (
    <Stack maxWidth={"1200px"} p={2} gap={2} mx="auto">
      <ElectionCard />
      <CandidateList
        candidates={await election.getCandidates()}
        election={election}
      />
    </Stack>
  );
}

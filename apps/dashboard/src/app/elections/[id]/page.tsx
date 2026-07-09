import { Stack } from "@mui/material";
import { notFound } from "next/navigation";
import { Election } from "@/classes/Election";
import CandidateList from "@/components/CandidateList";
import ElectctionCard from "@/components/ElectionCard";

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
      <ElectctionCard election={election} />
      <CandidateList
        candidates={await election.getCandidates()}
        election={election}
      />
    </Stack>
  );
}

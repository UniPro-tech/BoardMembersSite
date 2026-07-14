import { Election } from "@board/shared/classes";
import { notFound } from "next/navigation";
import CandidateList from "@/components/CandidateList";
import ElectionDetailsCard from "@/components/cards/election-details";

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
    <div className="max-w-4xl flex flex-col gap-4 p-4">
      <ElectionDetailsCard election={election} />
      <CandidateList
        candidates={await election.getCandidates()}
        election={election}
      />
    </div>
  );
}

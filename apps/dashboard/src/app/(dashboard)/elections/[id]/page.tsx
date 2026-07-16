import { Election } from "@board/shared/classes";
import { notFound } from "next/navigation";
import ElectionDetailsCard from "@/components/cards/election-details";
import { CandidateList } from "@/components/lists/candidate-list";

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
  const candidates = await election.getCandidates();
  const candidatesJson = await Promise.all(candidates.map((c) => c.toJson()));
  return (
    <div className="max-w-4xl flex flex-col gap-4 p-4">
      <ElectionDetailsCard election={election} />
      <CandidateList
        defaultCandidates={candidatesJson}
        election={election.toJson()}
      />
    </div>
  );
}

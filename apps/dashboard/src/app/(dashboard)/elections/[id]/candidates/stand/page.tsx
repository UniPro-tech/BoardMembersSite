import { Election } from "@board/shared/classes";
import { notFound } from "next/navigation";
import StandCandidateForm from "@/components/forms/stand-form";

export const dynamic = "force-dynamic";

export default async function ElectionStandPage({
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
    <main className="flex items-center justify-center p-6">
      <StandCandidateForm election={election.toJson()} />
    </main>
  );
}

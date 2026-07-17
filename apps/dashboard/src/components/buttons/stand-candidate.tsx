"use client";

import { ElectionDTO } from "@board/shared/classes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function StandCandidateButton({
  election,
}: {
  election: ElectionDTO;
}) {
  const router = useRouter();
  return (
    <Button
      size={"sm"}
      className={"px-6"}
      disabled={!election.canStand}
      onClick={() => {
        router.push(`/elections/${election.id}/stand`);
      }}
    >
      {election.canStand ? "立候補する" : "立候補期間外"}
    </Button>
  );
}

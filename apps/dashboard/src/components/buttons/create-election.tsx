"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function CreateElectionButton() {
  const router = useRouter();
  return (
    <Button
      size={"sm"}
      className={"px-6"}
      onClick={() => router.push(`/elections/new`)}
    >
      投票を作成する
    </Button>
  );
}

"use client";

import type { Prisma } from "@board/prisma";
import type { CandidateDTO, ElectionDTO, VoteDTO } from "@board/shared/classes";
import { UserRoundPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CandidateItem } from "@/components/items/candidate-item";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";
import { Card, CardContent } from "../../ui/card";
import SearchHeader from "./search-header";
import { searchCandidate } from "./server/searchAction";

export function CandidateList({
  defaultCandidates,
  election,
  defaultExistingVote,
}: {
  defaultCandidates: CandidateDTO[];
  election: ElectionDTO;
  defaultExistingVote?: VoteDTO;
}) {
  const [andSearchQuery, setAndSearchQuery] = useState<
    Prisma.CandidateWhereInput[]
  >([]);
  const [orSearchQuery, setOrSearchQuery] = useState<
    Prisma.CandidateWhereInput[]
  >([]);
  const [candidates, setCandidates] =
    useState<CandidateDTO[]>(defaultCandidates);
  const [existingVote, setExistingVote] = useState<VoteDTO | undefined>(
    defaultExistingVote,
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await searchCandidate(
        election.id,
        andSearchQuery,
        orSearchQuery,
      );
      setCandidates(res);
    };
    fetchData();
  }, [andSearchQuery, orSearchQuery, election.id]);

  const router = useRouter();

  return (
    <Card className="mt-10 max-w-6xl">
      <SearchHeader
        setAndSearchQuery={setAndSearchQuery}
        setOrSearchQuery={setOrSearchQuery}
      />
      <CardContent>
        {candidates.length > 0 ? (
          <ItemGroup className="w-full">
            {candidates.map((candidate) => (
              <CandidateItem
                candidate={candidate}
                key={candidate.id}
                canVote={election.isActive && !election.canStand}
                existingVote={existingVote}
                setExistingVote={setExistingVote}
              />
            ))}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRoundPlusIcon size={20} className="size-8" />
              </EmptyMedia>
              <EmptyTitle>該当の立候補者が見つかりません。</EmptyTitle>
              <EmptyDescription>
                この選挙の立候補者または検索結果に当てはまる立候補者が見つかりませんでした。
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
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
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

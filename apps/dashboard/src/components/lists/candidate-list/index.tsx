"use client";

import type { Prisma } from "@board/prisma";
import type { CandidateDTO } from "@board/shared/classes";
import { useEffect, useState } from "react";
import { ItemGroup } from "@/components/ui/item";
import { Card, CardContent } from "../../ui/card";
import SearchHeader from "./search-header";
import { searchCandidate } from "./server/searchAction";
import { CandidateItem } from "@/components/items/candidate-item";

export function CandidateList({
  defaultCandidates,
}: {
  defaultCandidates: CandidateDTO[];
}) {
  const [andSearchQuery, setAndSearchQuery] = useState<
    Prisma.CandidateWhereInput[]
  >([]);
  const [orSearchQuery, setOrSearchQuery] = useState<
    Prisma.CandidateWhereInput[]
  >([]);
  const [candidates, setCandidates] =
    useState<CandidateDTO[]>(defaultCandidates);

  useEffect(() => {
    const fetchData = async () => {
      const res = await searchCandidate(andSearchQuery, orSearchQuery);
      setCandidates(res);
    };
    fetchData();
  }, [andSearchQuery, orSearchQuery]);

  return (
    <Card className="mt-10 max-w-6xl">
      <SearchHeader
        setAndSearchQuery={setAndSearchQuery}
        setOrSearchQuery={setOrSearchQuery}
      />
      <CardContent>
        <ItemGroup className="w-full">
          {candidates.map((candidate) => (
            <CandidateItem candidate={candidate} key={candidate.id} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

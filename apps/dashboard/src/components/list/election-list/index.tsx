"use client";

import type { Prisma } from "@board/prisma";
import type { ElectionDTO } from "@board/shared/classes";
import { useEffect, useState } from "react";
import { ItemGroup } from "@/components/ui/item";
import { ElectionItem } from "../../items/election-item";
import { Card, CardContent } from "../../ui/card";
import SearchHeader from "./search-header";
import { searchElection } from "./server/searchAction";

export function ElectionList({
  defaultElections,
}: {
  defaultElections: ElectionDTO[];
}) {
  const [andSearchQuery, setAndSearchQuery] = useState<
    Prisma.ElectionWhereInput[]
  >([]);
  const [orSearchQuery, setOrSearchQuery] = useState<
    Prisma.ElectionWhereInput[]
  >([]);
  const [elections, setElections] = useState<ElectionDTO[]>(defaultElections);

  useEffect(() => {
    const fetchData = async () => {
      const res = await searchElection(andSearchQuery, orSearchQuery);
      setElections(res);
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
          {elections.map((election) => (
            <ElectionItem election={election} key={election.id} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

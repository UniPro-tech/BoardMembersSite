"use client";

import type { Prisma } from "@board/prisma";
import type { ElectionDTO } from "@board/shared/classes";
import { UserRoundPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useSession } from "@/libs/auth-client";
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

  const { data: session } = useSession();

  return (
    <Card className="mt-10 max-w-6xl">
      <SearchHeader
        setAndSearchQuery={setAndSearchQuery}
        setOrSearchQuery={setOrSearchQuery}
      />
      <CardContent>
        {elections.length > 0 ? (
          <ItemGroup className="w-full">
            {elections.map((election) => (
              <ElectionItem election={election} key={election.id} />
            ))}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRoundPlusIcon size={20} className="size-8" />
              </EmptyMedia>
              <EmptyTitle>該当の選挙が見つかりません。</EmptyTitle>
              <EmptyDescription>
                検索結果に当てはまる選挙が見つかりませんでした。
              </EmptyDescription>
            </EmptyHeader>
            {session?.user.role === "admin" && (
              <EmptyContent className="flex-row justify-center gap-2">
                <Button size={"sm"} className={"px-6"}>
                  選挙を作成
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

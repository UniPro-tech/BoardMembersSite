"use client";

import type { ElectionDTO } from "@board/shared/classes";
import { string } from "better-auth";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { ItemGroup } from "@/components/ui/item";
import { ElectionCard } from "../../item/election-card";
import { Card, CardContent, CardHeader } from "../../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";

export function ElectionList({ elections }: { elections: ElectionDTO[] }) {
  const [setSearchQuery, searchQuery] = useState({ word: "", type: 0 });
  return (
    <Card className="mt-10 max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="検索" />
          </InputGroup>
          <ToggleGroup>
            {["立候補受付中", "投票期間中", "開票済み"].map((label) => (
              <ToggleGroupItem key="label" variant={"outline"}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="w-full">
          {elections.map((election) => (
            <ElectionCard election={election} key={election.id} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

import type { ElectionDTO } from "@board/shared/classes";
import { VoteIcon } from "lucide-react";
import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import ElectionStatusTip from "../badges/election-status";

export function ElectionItem({ election }: { election: ElectionDTO }) {
  return (
    <Link href={`/elections/${election.id}`}>
      <Item variant={"outline"}>
        <ItemMedia variant="icon">
          <VoteIcon size={8} className="size-8" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="flex flex-row w-full">
            <div className="grow">{election.title}</div>
            <ElectionStatusTip election={election} />
          </ItemTitle>
          <ItemDescription>{election.description}</ItemDescription>
        </ItemContent>
      </Item>
    </Link>
  );
}

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

export function ElectionItem({ election }: { election: ElectionDTO }) {
  return (
    <Link href={`/election/${election.id}`}>
      <Item variant={"outline"}>
        <ItemMedia variant="icon">
          <VoteIcon size={8} className="size-8" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{election.title}</ItemTitle>
          <ItemDescription>{election.description}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>{election.isActive}</ItemDescription>
        </ItemContent>
      </Item>
    </Link>
  );
}

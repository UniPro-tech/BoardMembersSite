import type { CandidateDTO } from "@board/shared/classes";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CandidateItem({ candidate }: { candidate: CandidateDTO }) {
  return (
    <Item variant={"outline"}>
      <ItemMedia variant="icon">
        <Avatar>
          <AvatarImage src={candidate.user.image || undefined} />
          <AvatarFallback>{candidate.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{candidate.user.name}</ItemTitle>
        <ItemDescription>{candidate.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

import type { CandidateDTO, VoteDTO } from "@board/shared/classes";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { voteAction } from "./server/vote-Action";

export function CandidateItem({
  candidate,
  canVote,
  existingVote,
  setExistingVote,
}: {
  candidate: CandidateDTO;
  canVote: boolean;
  existingVote?: VoteDTO;
  setExistingVote: Dispatch<SetStateAction<VoteDTO | undefined>>;
}) {
  const router = useRouter();
  return (
    <Item variant={"outline"} id={candidate.id}>
      <ItemMedia variant="icon">
        <Avatar className={"size-16"}>
          <AvatarImage src={candidate.user.image || undefined} />
          <AvatarFallback>{candidate.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{candidate.user.name}</ItemTitle>
        <ItemDescription>{candidate.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant={"outline"}
          onClick={async () => {
            if (existingVote && existingVote.candidateId === candidate.id) {
              toast.promise(voteAction(candidate.id, "unvote"), {
                success: (data) => {
                  setExistingVote(data.vote);
                  return "投票を取り消しました。";
                },
                error: (error: Error) => {
                  if (error.message === "ログインしてください") {
                    router.push("/signin");
                  }
                  return error.message;
                },
              });
            } else {
              toast.promise(voteAction(candidate.id, "unvote"), {
                success: (data) => {
                  setExistingVote(data.vote);
                  return "投票が完了しました。";
                },
                error: (error: Error) => {
                  if (error.message === "ログインしてください") {
                    router.push("/signin");
                  }
                  return error.message;
                },
              });
            }
          }}
          cursor={`${
            !canVote ||
            (existingVote && existingVote.candidateId !== candidate.id)
              ? "prohibit"
              : "pointer"
          }`}
          disabled={
            !canVote ||
            (existingVote && existingVote.candidateId !== candidate.id)
          }
        >
          {!canVote ||
          (existingVote && existingVote.candidateId !== candidate.id)
            ? "投票不可"
            : existingVote && existingVote.candidateId === candidate.id
              ? "投票を取り消す"
              : "投票する"}
        </Button>
      </ItemActions>
    </Item>
  );
}

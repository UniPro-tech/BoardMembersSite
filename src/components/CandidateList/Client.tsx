"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useState } from "react";
import type { CandidateJSON } from "@/classes/Candidate";
import type { VoteJSON } from "@/classes/Vote";
import type { Account, User } from "../../generated/prisma/client";
import { toggleVote } from "./action";

export default function Client({
  data,
  existingVote,
  canVote,
}: {
  data: {
    candidate: CandidateJSON;
    user: User | undefined;
    account: Account | undefined;
  }[];
  existingVote: VoteJSON | null;
  canVote: boolean;
}) {
  const onVote = async (candidateId: string) => {
    try {
      const res = await toggleVote(candidateId);
      enqueueSnackbar(res.message, { variant: "success" });
      const updatedVote = existingVoteState
        ? null
        : {
            id: "temp-id",
            userId: "temp-user-id",
            candidateId,
            electionId: "temp-election-id",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
      setExistingVote(updatedVote);
    } catch {
      enqueueSnackbar("投票に失敗しました。", { variant: "error" });
    }
  };
  const [existingVoteState, setExistingVote] = useState(existingVote);
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Stack mt={2} gap={2}>
        {data.length === 0 ? (
          <Typography variant="body1">立候補者はいません。</Typography>
        ) : (
          data.map((item, index) => (
            <>
              <Card key={item.candidate.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6">{item.user?.name}</Typography>
                  {item.candidate.description && (
                    <Typography variant="body2">
                      {item.candidate.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color={"primary"}
                    href={`https://unique.uniproject.jp/dashboard/members/${item.account?.accountId}`}
                    target="_blank"
                  >
                    詳細
                  </Button>
                  <Button
                    variant="outlined"
                    color={
                      existingVoteState
                        ? existingVoteState.candidateId === item.candidate.id
                          ? "error"
                          : "secondary"
                        : "secondary"
                    }
                    onClick={() => onVote(item.candidate.id)}
                    disabled={
                      existingVoteState
                        ? existingVoteState.candidateId !== item.candidate.id
                        : !canVote
                    }
                  >
                    {canVote
                      ? existingVoteState
                        ? existingVoteState.candidateId === item.candidate.id
                          ? "投票を取り消す"
                          : "投票済み"
                        : "投票する"
                      : "投票不可"}
                  </Button>
                </CardActions>
              </Card>
              {index < data.length - 1 && <Divider />}
            </>
          ))
        )}
      </Stack>
    </SnackbarProvider>
  );
}

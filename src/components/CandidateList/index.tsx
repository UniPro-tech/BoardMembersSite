import { Alert, Button, Card, CardContent, Typography } from "@mui/material";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import type { Candidate } from "@/classes/Candidate";
import type { Election } from "@/classes/Election";
import { Vote } from "@/classes/Vote";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import Client from "./Client";

export default async function CandidateList({
  candidates,
  election,
}: {
  candidates: Candidate[];
  election: Election;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  const users = await Promise.all(
    candidates.map(async (candidate) => await candidate.getUser()),
  );
  const filteredUsers = users.filter(
    (user): user is NonNullable<typeof user> => user !== null,
  );
  const accounts = await prisma.account.findMany({
    where: {
      userId: { in: filteredUsers.map((user) => user.id) },
      providerId: "unique",
    },
  });
  const data = await Promise.all(
    candidates.map(async (candidate) => ({
      candidate: {
        ...candidate.toJSON(),
        voteCount: await Vote.countVotesByCandidateId(candidate.id),
      },
      user: filteredUsers.find((user) => user.id === candidate.userId),
      account: accounts.find((account) => account.userId === candidate.userId),
    })),
  );
  const existingVote =
    (
      await Vote.findByUserIdAndElectionId(session.user.id, election.id)
    )?.toJSON() || null;
  const isEnded = election.endAt < new Date();
  const winner = await election.getWinnerCandidates();
  const winnerData = await Promise.all(
    winner.map(async (candidate) => {
      const user = await candidate.getUser();
      const account = user
        ? await prisma.account.findFirst({
            where: {
              userId: user.id,
              providerId: "unique",
            },
          })
        : null;
      return {
        candidate: {
          ...candidate.toJSON(),
          voteCount: await Vote.countVotesByCandidateId(candidate.id),
        },
        user: user || undefined,
        account: account || undefined,
      };
    }),
  );
  const runoffElection = isEnded && (await election.getRunoffElection());
  return (
    <Card id="candidate-list">
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isEnded && (
          <>
            <Alert severity="warning" className="mb-4">
              この選挙は終了しています。投票はできません。
            </Alert>
            <Typography
              variant="h6"
              component="h3"
              className="font-bold"
              color={"primary"}
            >
              当選者(確実者)
            </Typography>
            {winner.length > 0 ? (
              <Client
                data={winnerData}
                isAdmin={session.user.role === "admin"}
                isWinner={true}
              />
            ) : (
              <Typography variant="body1">当選者はいません。</Typography>
            )}
          </>
        )}
        {isEnded &&
          session.user.role === "admin" &&
          (await election.needRunoffElection()) && (
            <>
              <Alert severity="info" className="mb-4">
                この選挙は定員を超える候補者がいるため、決選投票が必要です。
              </Alert>
              <Button
                variant="contained"
                color="primary"
                href={`/elections/${election.id}/runoff`}
              >
                決選投票を作成
              </Button>
            </>
          )}
        {isEnded && runoffElection && (
          <>
            <Alert severity="info" className="mb-4">
              決選投票が作成されています。
            </Alert>
            <Button
              variant="contained"
              color="primary"
              href={`/elections/${runoffElection.id}`}
            >
              決選投票を見る
            </Button>
          </>
        )}
        <Typography variant="h5" component="h2" className="font-bold">
          立候補者一覧
        </Typography>
        <Client
          data={data}
          existingVote={existingVote}
          canVote={election.isActive && !election.canStand}
          userId={session.user.id}
          canStand={election.canStand}
          isAdmin={session.user.role === "admin"}
        />
      </CardContent>
    </Card>
  );
}

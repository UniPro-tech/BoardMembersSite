import { Card, CardContent, Typography } from "@mui/material";
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
  return (
    <Card id="candidate-list">
      <CardContent>
        <Typography variant="h5" component="h2" className="font-bold">
          立候補者一覧
        </Typography>
        <Client
          data={data}
          existingVote={existingVote}
          canVote={election.isActive && !election.canStand}
          userId={session.user.id}
          canStand={election.canStand}
        />
      </CardContent>
    </Card>
  );
}

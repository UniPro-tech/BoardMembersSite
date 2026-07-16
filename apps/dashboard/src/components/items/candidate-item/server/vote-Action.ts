"use server";
import { Candidate, Vote, type VoteDTO } from "@board/shared/classes";
import { headers } from "next/headers";
import { auth } from "@/libs/auth";
import "server-only";

export const voteAction = async (
  candidateId: string,
  action: "vote" | "unvote",
): Promise<{
  ok: boolean;
  vote?: VoteDTO;
}> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("ログインしてください。");
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) throw new Error("候補者が見つかりません。");
  const election = await candidate?.getElection();
  if (!election) throw new Error("投票が見つかりません。");
  if (!(election.isActive && !election.canStand)) {
    throw new Error("この選挙は投票可能ではありません。");
  }
  const existingVote = await Vote.findByUserIdAndElectionId(
    session.user.id,
    election.id,
  );
  if (action === "vote") {
    if (existingVote) {
      throw new Error("既に誰かに投票済みです。");
    } else {
      const res = await Vote.create(session.user.id, candidateId, election.id);
      return { ok: true, vote: res.toJson() };
    }
  } else {
    if (existingVote?.candidateId === candidateId) {
      await existingVote.delete();
      return { ok: true };
    } else {
      throw new Error("この候補者に投票していないため、投票を取り消せません。");
    }
  }
};

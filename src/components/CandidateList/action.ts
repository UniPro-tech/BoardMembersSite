"use server";

import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { Candidate } from "@/classes/Candidate";
import { Election } from "@/classes/Election";
import { Vote } from "@/classes/Vote";
import { auth } from "@/libs/auth";

export const toggleVote = async (candidateId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new Error("Candidate not found");
  }
  const election = await Election.findById(candidate.electionId);
  if (!election) {
    throw new Error("Election not found");
  }
  if (!(election.isActive && !election.canStand)) {
    throw new Error("この選挙は現在投票できません。");
  }
  const existingVote = await Vote.findByUserIdAndElectionId(
    session.user.id,
    election.id,
  );
  if (existingVote) {
    if (existingVote.candidateId === candidateId) {
      await existingVote.delete();
      return { message: "投票を取り消しました。" };
    } else {
      throw new Error(
        "既に別の候補者に投票しています。投票を変更するには、まず現在の投票を取り消してください。",
      );
    }
  }
  await Vote.create(session.user.id, candidateId, election.id);
  return { message: "投票しました。" };
};

export const deleteCandidateAction = async (candidateId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new Error("Candidate not found");
  }
  if (candidate.userId !== session.user.id || session.user.role !== "admin") {
    throw new Error("この候補者を削除する権限がありません。");
  }
  await candidate.delete();
};

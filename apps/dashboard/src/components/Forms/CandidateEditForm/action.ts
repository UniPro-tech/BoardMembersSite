"use server";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Candidate } from "@/classes/Candidate";
import { Election } from "@/classes/Election";
import { auth } from "@/libs/auth";

export const editCandidateAction = async (formData: FormData) => {
  const electionId = formData.get("electionId") as string;
  const candidateId = formData.get("candidateId") as string;
  const description = formData.get("description") as string | undefined;

  if (!electionId) {
    throw new Error("選挙IDが必要です");
  }

  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error("選挙が見つかりません");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  if (!election.canStand) {
    throw new Error("立候補受付期間外です");
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new Error("候補者が見つかりません");
  }
  if (candidate.electionId !== election.id) {
    throw new Error("この候補者はこの選挙に属していません");
  }

  candidate.description = description;
  await candidate.save();

  redirect(`/elections/${election.id}?editSuccess=true`);
};

export const makeIneligible = async (formData: FormData) => {
  const electionId = formData.get("electionId") as string;
  const candidateId = formData.get("candidateId") as string;

  if (!electionId) {
    throw new Error("選挙IDが必要です");
  }

  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error("選挙が見つかりません");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new Error("候補者が見つかりません");
  }
  if (candidate.electionId !== election.id) {
    throw new Error("この候補者はこの選挙に属していません");
  }

  if (candidate.isIneligible) {
    candidate.isIneligible = false;
  } else {
    candidate.isIneligible = true;
  }
  await candidate.save();

  redirect(`/elections/${election.id}?editSuccess=true`);
};

import prisma from "@/libs/prisma";
import type { Vote as PrismaVote } from "../generated/prisma/client";
import { Election } from "./Election";

export class Vote {
  id: string;
  userId: string;
  candidateId: string;
  electionId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    candidateId: string,
    electionId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.candidateId = candidateId;
    this.electionId = electionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPrisma(prismaVote: PrismaVote): Vote {
    return new Vote(
      prismaVote.id,
      prismaVote.userId,
      prismaVote.candidateId,
      prismaVote.electionId,
      prismaVote.createdAt,
      prismaVote.updatedAt,
    );
  }

  static async create(
    userId: string,
    candidateId: string,
    electionId: string,
  ): Promise<Vote> {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error("Election not found");
    }
    if (!election.isActive) {
      throw new Error("Cannot vote in this election at this time");
    }
    const createdVote = await prisma.vote.create({
      data: {
        userId,
        candidateId,
        electionId,
      },
    });

    return Vote.fromPrisma(createdVote);
  }

  static async deleteById(voteId: string): Promise<void> {
    await prisma.vote.delete({
      where: {
        id: voteId,
      },
    });
  }

  static async findByElectionId(electionId: string): Promise<Vote[]> {
    const prismaVotes = await prisma.vote.findMany({
      where: { electionId },
    });
    return prismaVotes.map(Vote.fromPrisma);
  }

  static async findByUserIdAndElectionId(
    userId: string,
    electionId: string,
  ): Promise<Vote | null> {
    const prismaVote = await prisma.vote.findFirst({
      where: { userId, electionId },
    });
    return prismaVote ? Vote.fromPrisma(prismaVote) : null;
  }

  static async countVotesByCandidateId(candidateId: string): Promise<number> {
    const count = await prisma.vote.count({
      where: { candidateId },
    });
    return count;
  }

  async delete(): Promise<void> {
    await prisma.vote.delete({
      where: {
        id: this.id,
      },
    });
  }

  toJSON(): VoteJSON {
    return {
      id: this.id,
      userId: this.userId,
      candidateId: this.candidateId,
      electionId: this.electionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface VoteJSON {
  id: string;
  userId: string;
  candidateId: string;
  electionId: string;
  createdAt: Date;
  updatedAt: Date;
}

import prisma from "@/libs/prisma";
import type {
  Candidate as PrismaCandidate,
  User,
} from "../generated/prisma/client";
import { Election } from "./Election";

export class Candidate {
  id: string;
  userId: string;
  electionId: string;
  description?: string;
  isIneligible: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    electionId: string,
    description: string | undefined,
    isIneligible: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.electionId = electionId;
    this.description = description;
    this.isIneligible = isIneligible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPrisma(prismaCandidate: PrismaCandidate): Candidate {
    return new Candidate(
      prismaCandidate.id,
      prismaCandidate.userId,
      prismaCandidate.electionId,
      prismaCandidate.description ? prismaCandidate.description : undefined,
      prismaCandidate.isIneligible,
      prismaCandidate.createdAt,
      prismaCandidate.updatedAt,
    );
  }

  static async create(
    userId: string,
    electionId: string,
    description?: string,
  ): Promise<Candidate> {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error("Election not found");
    }
    if (!election.canStand) {
      throw new Error("Cannot stand for this election at this time");
    }
    const createdCandidate = await prisma.candidate.create({
      data: {
        userId,
        electionId,
        description,
      },
    });

    return Candidate.fromPrisma(createdCandidate);
  }

  static async deleteById(candidateId: string): Promise<void> {
    await prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });
  }

  static async findByElectionId(electionId: string): Promise<Candidate[]> {
    const candidates = await prisma.candidate.findMany({
      where: {
        electionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return candidates.map(Candidate.fromPrisma);
  }

  static async findById(candidateId: string): Promise<Candidate | null> {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

    return candidate ? Candidate.fromPrisma(candidate) : null;
  }

  static async updateById(
    candidateId: string,
    description: string | undefined,
  ): Promise<Candidate> {
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        description,
      },
    });

    return Candidate.fromPrisma(updatedCandidate);
  }

  async save(): Promise<void> {
    await prisma.candidate.update({
      where: { id: this.id },
      data: {
        description: this.description,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.candidate.delete({
      where: { id: this.id },
    });
  }

  async getUser(): Promise<User | null> {
    const candidateWithUser = await prisma.user.findUnique({
      where: { id: this.userId },
    });
    return candidateWithUser ? candidateWithUser : null;
  }

  toJSON(): CandidateJSON {
    return {
      id: this.id,
      userId: this.userId,
      electionId: this.electionId,
      description: this.description,
      isIneligible: this.isIneligible,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CandidateJSON {
  id: string;
  userId: string;
  electionId: string;
  description?: string;
  isIneligible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

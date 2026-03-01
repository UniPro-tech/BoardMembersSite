import { nowUTC } from "@/libs/date";
import prisma from "@/libs/prisma";
import type { Election as PrismaElection } from "../generated/prisma/client";
import { Candidate } from "./Candidate";

export class Election {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  standDeadline: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;

  get isActive(): boolean {
    const now = nowUTC();
    return this.startAt <= now && now <= this.endAt;
  }

  get canStand(): boolean {
    const now = nowUTC();
    return this.startAt <= now && now <= this.standDeadline;
  }

  constructor(
    id: string,
    title: string,
    description: string | undefined,
    startAt: Date,
    standDeadline: Date,
    endAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startAt = startAt;
    this.standDeadline = standDeadline;
    this.endAt = endAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPrisma(prismaElection: PrismaElection): Election {
    return new Election(
      prismaElection.id,
      prismaElection.name,
      prismaElection.description ? prismaElection.description : undefined,
      prismaElection.startDate,
      prismaElection.standDeadline,
      prismaElection.endDate,
      prismaElection.createdAt,
      prismaElection.updatedAt,
    );
  }

  static async create(
    title: string,
    description: string | undefined,
    startAt: Date,
    standDeadline: Date,
    endAt: Date,
  ): Promise<Election> {
    const createdElection = await prisma.election.create({
      data: {
        name: title,
        description,
        standDeadline,
        startDate: startAt,
        endDate: endAt,
      },
    });
    return Election.fromPrisma(createdElection);
  }

  static async findById(id: string): Promise<Election | null> {
    const prismaElection = await prisma.election.findUnique({
      where: { id },
    });
    return prismaElection ? Election.fromPrisma(prismaElection) : null;
  }

  static async findAll(): Promise<Election[]> {
    const prismaElections = await prisma.election.findMany();
    return prismaElections.map(Election.fromPrisma);
  }

  static async deleteById(id: string): Promise<void> {
    await prisma.election.delete({
      where: { id },
    });
  }

  static async updateById(
    id: string,
    title: string,
    description: string | undefined,
    startAt: Date,
    standDeadline: Date,
    endAt: Date,
  ): Promise<Election> {
    const updatedElection = await prisma.election.update({
      where: { id },
      data: {
        name: title,
        description,
        startDate: startAt,
        standDeadline,
        endDate: endAt,
      },
    });
    return Election.fromPrisma(updatedElection);
  }

  async save(): Promise<void> {
    await prisma.election.update({
      where: { id: this.id },
      data: {
        name: this.title,
        description: this.description,
        startDate: this.startAt,
        endDate: this.endAt,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.election.delete({
      where: { id: this.id },
    });
  }

  async getCandidates(): Promise<Candidate[]> {
    const candidates = await Candidate.findByElectionId(this.id);
    return candidates;
  }

  async addCandidate(userId: string, description?: string): Promise<Candidate> {
    const candidate = await Candidate.create(userId, this.id, description);
    return candidate;
  }
}

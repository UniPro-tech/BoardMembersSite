import { nowUTC } from "@/libs/date";
import prisma from "@/libs/prisma";
import type { Election as PrismaElection } from "../generated/prisma/client";
import { Candidate } from "./Candidate";

export class Election {
  id: string;
  title: string;
  description?: string;
  capacity?: number;
  parentElectionId?: string;
  isRunoff: boolean;
  startAt: Date;
  standDeadline: Date | null;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;

  get isActive(): boolean {
    const now = nowUTC();
    return this.startAt <= now && now <= this.endAt;
  }

  get canStand(): boolean {
    const now = nowUTC();
    return this.standDeadline
      ? this.startAt <= now && now <= this.standDeadline
      : false;
  }

  constructor(
    id: string,
    title: string,
    description: string | undefined,
    capacity: number | undefined,
    parentElectionId: string | undefined,
    isRunoff: boolean,
    startAt: Date,
    standDeadline: Date | null,
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
    this.capacity = capacity;
    this.parentElectionId = parentElectionId;
    this.isRunoff = isRunoff;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPrisma(prismaElection: PrismaElection): Election {
    return new Election(
      prismaElection.id,
      prismaElection.name,
      prismaElection.description ? prismaElection.description : undefined,
      prismaElection.capacity ? prismaElection.capacity : undefined,
      prismaElection.parentElectionId
        ? prismaElection.parentElectionId
        : undefined,
      prismaElection.isRunoff,
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
    capacity: number | undefined,
    isRunoff: boolean,
    parentElectionId: string | undefined,
    startAt: Date,
    standDeadline: Date | null,
    endAt: Date,
  ): Promise<Election> {
    const createdElection = await prisma.election.create({
      data: {
        name: title,
        description,
        standDeadline,
        startDate: startAt,
        endDate: endAt,
        capacity,
        isRunoff,
        parentElectionId,
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
    capacity: number | undefined,
    parentElectionId: string | undefined,
    isRunoff: boolean,
    startAt: Date,
    standDeadline: Date | null,
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
        capacity,
        parentElectionId,
        isRunoff,
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
        capacity: this.capacity,
        isRunoff: this.isRunoff,
        parentElectionId: this.parentElectionId,
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

  async getWinnerCandidates(): Promise<Candidate[]> {
    const capacity = this.capacity;
    if (!capacity) {
      return [];
    }
    const candidates = await this.getCandidates();
    // Fetch all votes counts in parallel
    const votesCounts = await Promise.all(
      candidates.map((c) => c.getVotesCount()),
    );
    // Pair candidates with their votes count
    const candidatesWithVotes = candidates.map((candidate, idx) => ({
      candidate,
      votes: votesCounts[idx],
    }));
    // 得票数でソート
    candidatesWithVotes.sort((a, b) => b.votes - a.votes);
    // 定員以上の候補者がいる場合、定員に入る最後の候補者と同数の票を得ている候補者がいるか確認
    if (capacity < candidatesWithVotes.length) {
      const lastWinnerVotes = candidatesWithVotes[capacity - 1].votes;
      // 定員に入る最後の候補者と同数の票を得ている候補者がいる場合、同数の票を得ている候補者は全員落選とする
      const hasTie = candidatesWithVotes
        .slice(capacity)
        .some((item) => item.votes === lastWinnerVotes);
      if (hasTie) {
        // 定員に入る最後の候補者と同数の票を得ている候補者がいる場合、同数の票を得ている候補者は全員落選とする
        const cutoffIndex = candidatesWithVotes.findIndex(
          (item, idx) => idx >= capacity - 1 && item.votes < lastWinnerVotes,
        );
        return candidatesWithVotes
          .slice(0, cutoffIndex === -1 ? capacity - 1 : cutoffIndex)
          .map((item) => item.candidate);
      }
    }
    // Take top N
    return candidatesWithVotes.slice(0, capacity).map((item) => item.candidate);
  }

  async getRunoffElection(): Promise<Election | null> {
    const runoffElection = await prisma.election.findFirst({
      where: { parentElectionId: this.id },
    });
    return runoffElection ? Election.fromPrisma(runoffElection) : null;
  }

  async createRunoffElection(
    title: string,
    description: string | undefined,
    capacity: number | undefined,
    startAt: Date,
    standDeadline: Date | null,
    endAt: Date,
  ): Promise<Election> {
    const runoffElection = await Election.create(
      title,
      description,
      capacity,
      true,
      this.id,
      startAt,
      standDeadline,
      endAt,
    );
    const winnerCandidates = await this.getWinnerCandidates();
    // タイブレークの候補者を取得する
    // 定員の人数だけ得票数の多い候補者を取得し、その最後の候補者と同数の票を得ている候補者を全て取得する
    const allCandidates = await this.getCandidates();
    const candidatesWithVotes = await Promise.all(
      allCandidates.map(async (candidate) => ({
        candidate,
        votes: await candidate.getVotesCount(),
      })),
    );
    candidatesWithVotes.sort((a, b) => b.votes - a.votes);
    const cutoffVotes =
      candidatesWithVotes[
        Math.min(winnerCandidates.length, candidatesWithVotes.length) - 1
      ]?.votes ?? 0;
    const runoffCandidates = candidatesWithVotes
      .filter((item) => item.votes === cutoffVotes)
      .map((item) => item.candidate);

    // タイブレークの候補者をランオフ選挙に追加する
    await Promise.all(
      runoffCandidates.map((candidate) =>
        runoffElection.addCandidate(candidate.userId, candidate.description),
      ),
    );
    return runoffElection;
  }

  async needRunoffElection(): Promise<boolean> {
    if (this.capacity === undefined) {
      return false;
    }
    const candidates = await this.getCandidates();
    if (candidates.length <= this.capacity) {
      return false;
    }
    const votesCounts = await Promise.all(
      candidates.map((c) => c.getVotesCount()),
    );
    const candidatesWithVotes = candidates.map((candidate, idx) => ({
      candidate,
      votes: votesCounts[idx],
    }));
    candidatesWithVotes.sort((a, b) => b.votes - a.votes);
    const cutoffVotes =
      candidatesWithVotes[this.capacity - 1]?.votes ?? Number.MAX_SAFE_INTEGER;
    return candidatesWithVotes.some((item) => item.votes === cutoffVotes);
  }
}

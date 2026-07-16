"use server";

import "server-only";
import { type Prisma, prisma } from "@board/prisma";
import { Candidate, type CandidateDTO } from "@board/shared/classes";

export const searchCandidate = async (
  and: Prisma.CandidateWhereInput[],
  or: Prisma.CandidateWhereInput[],
): Promise<CandidateDTO[]> => {
  const dbRes = await prisma.candidate.findMany({
    where: {
      AND: and,
      OR: or.length === 0 ? undefined : or,
    },
  });
  console.log(dbRes);
  const res = await Promise.all(
    dbRes.map(async (data) => Candidate.fromPrisma(data).toJson()),
  );

  return res;
};

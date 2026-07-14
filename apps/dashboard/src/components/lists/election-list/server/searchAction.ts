"use server";

import "server-only";
import { type Prisma, prisma } from "@board/prisma";
import { Election } from "@board/shared/classes";

export const searchElection = async (
  and: Prisma.ElectionWhereInput[],
  or: Prisma.ElectionWhereInput[],
) => {
  const dbRes = await prisma.election.findMany({
    where: {
      AND: and,
      OR: or.length === 0 ? undefined : or,
    },
  });
  console.log(dbRes);
  const res = dbRes.map((data) => Election.fromPrisma(data).toJson());
  return res;
};

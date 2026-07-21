import type { Prisma } from "@board/prisma";
import type { ElectionDTO } from "@board/shared/classes";
import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import StandCandidateButton from "@/components/buttons/stand-candidate";
import { CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchHeader({
  election,
  setAndSearchQuery,
  setOrSearchQuery,
}: {
  election: ElectionDTO;
  setAndSearchQuery: Dispatch<SetStateAction<Prisma.CandidateWhereInput[]>>;
  setOrSearchQuery: Dispatch<SetStateAction<Prisma.CandidateWhereInput[]>>;
}) {
  return (
    <CardHeader>
      <div className="mb-4 flex flex-row w-full align-center items-center">
        <h4 className="grow">立候補者一覧</h4>
        <StandCandidateButton election={election} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="検索"
            onChange={(e) => {
              setOrSearchQuery([
                {
                  user: {
                    name: {
                      contains: e.target.value,
                    },
                  },
                  description: {
                    contains: e.target.value,
                  },
                },
              ]);
            }}
          />
        </InputGroup>
      </div>
    </CardHeader>
  );
}

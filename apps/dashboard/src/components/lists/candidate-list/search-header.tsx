import type { Prisma } from "@board/prisma";
import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchHeader({
  setAndSearchQuery,
  setOrSearchQuery,
}: {
  setAndSearchQuery: Dispatch<SetStateAction<Prisma.CandidateWhereInput[]>>;
  setOrSearchQuery: Dispatch<SetStateAction<Prisma.CandidateWhereInput[]>>;
}) {
  return (
    <CardHeader>
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

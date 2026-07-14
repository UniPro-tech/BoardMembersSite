import type { Prisma } from "@board/prisma";
import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function SearchHeader({
  setAndSearchQuery,
  setOrSearchQuery,
}: {
  setAndSearchQuery: Dispatch<SetStateAction<Prisma.ElectionWhereInput[]>>;
  setOrSearchQuery: Dispatch<SetStateAction<Prisma.ElectionWhereInput[]>>;
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
                  name: {
                    contains: e.target.value,
                  },
                  description: {
                    contains: e.target.value,
                  },
                },
              ]);
            }}
          />
        </InputGroup>
        <ToggleGroup
          multiple={false}
          onValueChange={(data) => {
            if (data.length === 0) {
              setAndSearchQuery([]);
            } else {
              switch (data[0]) {
                case "canStand":
                  setAndSearchQuery([
                    {
                      startDate: {
                        lte: new Date(),
                      },
                      standDeadline: {
                        gte: new Date(),
                      },
                    },
                  ]);
                  break;
                case "canVote":
                  setAndSearchQuery([
                    {
                      startDate: {
                        lte: new Date(),
                      },
                      standDeadline: {
                        lte: new Date(),
                      },
                      endDate: {
                        gte: new Date(),
                      },
                    },
                  ]);
                  break;
                case "ended":
                  setAndSearchQuery([
                    {
                      endDate: {
                        lt: new Date(),
                      },
                    },
                  ]);
                  break;
                default:
                  setAndSearchQuery([]);
                  break;
              }
            }
          }}
        >
          {[
            { label: "立候補受付中", value: "canStand" },
            { label: "投票期間中", value: "canVote" },
            { label: "開票済み", value: "ended" },
          ].map((data) => (
            <ToggleGroupItem
              key={data.value}
              variant={"outline"}
              value={data.value}
            >
              {data.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </CardHeader>
  );
}

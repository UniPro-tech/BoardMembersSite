import type { ElectionDTO } from "@board/shared/classes";
import { CalendarIcon } from "lucide-react";
import Markdown from "react-markdown";
import ElectionStatusTip from "@/components/badges/election-status";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const flexPriorityRowClassName =
  "flex flex-col md:flex-row align-center items-center w-full";

export default function ElectionDetailsCard({
  election,
}: {
  election: ElectionDTO;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className={`${flexPriorityRowClassName}`}>
          <h3 className="grow">{election.title}</h3>
          <ElectionStatusTip election={election} />
        </div>
        <ul className="w-full gap-2 flex flex-col">
          <li className={`${flexPriorityRowClassName}`}>
            <strong className="grow flex-row flex gap-2 items-center align-center">
              <CalendarIcon size={20} />
              公示日
            </strong>
            <span>{election.createdAt.toLocaleString()}</span>
          </li>
          <li className={`${flexPriorityRowClassName}`}>
            <strong className="grow flex-row flex gap-2 items-center align-center">
              <CalendarIcon size={20} />
              開始日時
            </strong>
            <span>{election.startAt.toLocaleString()}</span>
          </li>
          {election.standDeadline && (
            <li className={`${flexPriorityRowClassName}`}>
              <strong className="grow flex-row flex gap-2 items-center align-center">
                <CalendarIcon size={20} />
                立候補締切日
              </strong>
              <span>{election.standDeadline.toLocaleString()}</span>
            </li>
          )}
          <li className={`${flexPriorityRowClassName}`}>
            <strong className="grow flex-row flex gap-2 items-center align-center">
              <CalendarIcon size={20} />
              投票締切日時
            </strong>
            <span>{election.endAt.toLocaleString()}</span>
          </li>
        </ul>
      </CardHeader>
      <CardContent>
        <div className="text-normal markdown">
          <Markdown>{election.description}</Markdown>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs">
          最終更新: {election.updatedAt.toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}

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
        <dl className="space-y-3 w-full">
          <div className="flex justify-between items-center border-b pb-2">
            <dt className="flex items-center gap-2 font-medium text-muted-foreground">
              <CalendarIcon size={18} />
              公示日
            </dt>
            <dd>{election.createdAt.toLocaleString()}</dd>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <dt className="flex items-center gap-2 font-medium text-muted-foreground">
              <CalendarIcon size={18} />
              開始日時
            </dt>
            <dd>{election.startAt.toLocaleString()}</dd>
          </div>

          {election.standDeadline && (
            <div className="flex justify-between items-center border-b pb-2">
              <dt className="flex items-center gap-2 font-medium text-muted-foreground">
                <CalendarIcon size={18} />
                立候補締切
              </dt>
              <dd>{election.standDeadline.toLocaleString()}</dd>
            </div>
          )}

          <div className="flex justify-between items-center">
            <dt className="flex items-center gap-2 font-medium text-muted-foreground">
              <CalendarIcon size={18} />
              投票締切
            </dt>
            <dd>{election.endAt.toLocaleString()}</dd>
          </div>
        </dl>
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

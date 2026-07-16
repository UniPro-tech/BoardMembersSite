import type { ElectionDTO } from "@board/shared/classes";
import Markdown from "react-markdown";
import ElectionStatusTip from "@/components/badges/election-status";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ElectionDetailsCard({
  election,
}: {
  election: ElectionDTO;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row align-center items-center">
        <h3 className="grow">{election.title}</h3>
        <ElectionStatusTip election={election} />
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

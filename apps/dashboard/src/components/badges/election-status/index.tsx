import type { ElectionDTO } from "@board/shared/classes";
import { Badge } from "@/components/ui/badge";

export default function ElectionStatusTip({
  election,
}: {
  election: ElectionDTO;
}) {
  if (election.isActive) {
    if (election.canStand) {
      return (
        <Badge size={"sm"} className="min-w-30" variant={"destructive"}>
          立候補受付中
        </Badge>
      );
    } else {
      return (
        <Badge size={"sm"} className="min-w-30" variant={"default"}>
          投票受付中
        </Badge>
      );
    }
  } else if (election.endAt <= new Date()) {
    return (
      <Badge size={"sm"} className="min-w-30" variant={"secondary"}>
        終了
      </Badge>
    );
  } else
    return (
      <Badge
        size={"sm"}
        className="min-w-30 text-red-600 border-red-600"
        variant={"outline"}
      >
        開始前
      </Badge>
    );
}

import { Button, Stack, TextField } from "@mui/material";
import type { Election } from "@/classes/Election";
import { createElectionAction } from "./action";

export default function ElectionCreateForm({
  isRunoff,
  parentElection,
  defaultCapacity,
}: {
  isRunoff?: boolean;
  parentElection?: Election;
  defaultCapacity?: number;
}) {
  return (
    <Stack component={"form"} spacing={2} action={createElectionAction}>
      <TextField
        label="選挙タイトル"
        name="title"
        required
        fullWidth
        defaultValue={
          isRunoff && parentElection
            ? `【決選投票】${parentElection.title}`
            : null
        }
      />
      <TextField
        label="選挙説明"
        name="description"
        multiline
        rows={8}
        fullWidth
      />
      <TextField
        label="定員"
        name="capacity"
        type="number"
        fullWidth
        defaultValue={defaultCapacity}
      />
      <input
        type="hidden"
        name="isRunoff"
        value={isRunoff ? "true" : "false"}
      />
      {isRunoff && (
        <input
          type="hidden"
          name="parentElectionId"
          value={parentElection ? parentElection.id : ""}
        />
      )}
      <TextField
        label="開始日時"
        name="startAt"
        type="datetime-local"
        required
        fullWidth
      />
      <TextField
        label="立候補締切日時"
        name="standDeadline"
        type="datetime-local"
        fullWidth
      />
      <TextField
        label="終了日時"
        name="endAt"
        type="datetime-local"
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        作成
      </Button>
    </Stack>
  );
}

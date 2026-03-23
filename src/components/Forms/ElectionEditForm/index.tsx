import { Button, Stack, TextField } from "@mui/material";
import type { Election } from "@/classes/Election";
import { formatToDatetimeLocalJST } from "@/libs/date";
import { updateElectionAction } from "./action";

export default function ElectionEditForm({
  election,
  isRunoff,
}: {
  election: Election;
  isRunoff?: boolean;
}) {
  return (
    <Stack component={"form"} spacing={2} action={updateElectionAction}>
      <input type="hidden" name="electionId" value={election.id} />
      <TextField
        label="選挙タイトル"
        name="title"
        required
        fullWidth
        defaultValue={election.title}
      />
      <TextField
        label="選挙説明"
        name="description"
        multiline
        rows={8}
        fullWidth
        defaultValue={election.description}
      />
      <TextField
        label="定員"
        name="capacity"
        type="number"
        fullWidth
        defaultValue={election.capacity}
      />
      <TextField
        label="開始日時"
        name="startAt"
        type="datetime-local"
        required
        fullWidth
        defaultValue={formatToDatetimeLocalJST(election.startAt)}
      />
      {isRunoff && (
        <>
          <input
            type="hidden"
            name="isRunoff"
            value={election.isRunoff ? "true" : "false"}
          />
          <input
            type="hidden"
            name="parentElectionId"
            value={election.parentElectionId}
          />
        </>
      )}
      <TextField
        label="立候補締切日時"
        name="standDeadline"
        type="datetime-local"
        fullWidth
        defaultValue={
          election.standDeadline
            ? formatToDatetimeLocalJST(election.standDeadline)
            : null
        }
      />
      <TextField
        label="終了日時"
        name="endAt"
        type="datetime-local"
        required
        fullWidth
        defaultValue={formatToDatetimeLocalJST(election.endAt)}
      />
      <Button type="submit" variant="contained" color="primary">
        編集
      </Button>
    </Stack>
  );
}

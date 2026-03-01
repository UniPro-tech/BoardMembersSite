import { Button, Stack, TextField } from "@mui/material";
import { createElectionAction } from "./action";

export default function ElectionCreateForm() {
  return (
    <Stack component={"form"} spacing={2} action={createElectionAction}>
      <TextField label="選挙タイトル" name="title" required fullWidth />
      <TextField
        label="選挙説明"
        name="description"
        multiline
        rows={8}
        fullWidth
      />
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
        required
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

import { Button, Stack, TextField } from "@mui/material";
import { editCandidateAction } from "./action";

export default function CandidateEditForm({
  electionId,
  candidateId,
}: {
  electionId: string;
  candidateId: string;
}) {
  return (
    <Stack component={"form"} spacing={2} action={editCandidateAction}>
      <input type="hidden" name="electionId" value={electionId} />
      <input type="hidden" name="candidateId" value={candidateId} />
      <TextField label="一言" name="description" multiline rows={4} fullWidth />
      <Button type="submit" variant="contained" color="primary">
        編集する
      </Button>
    </Stack>
  );
}

import { Button, Stack, TextField } from "@mui/material";
import { standAction } from "./action";

export default function StandForm({ electionId }: { electionId: string }) {
  return (
    <Stack component={"form"} spacing={2} action={standAction}>
      <input type="hidden" name="electionId" value={electionId} />
      <TextField label="一言" name="description" multiline rows={4} fullWidth />
      <Button type="submit" variant="contained" color="primary">
        立候補
      </Button>
    </Stack>
  );
}

import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import type { CandidateJSON } from "@/classes/Candidate";
import { editCandidateAction, makeIneligible } from "./action";

export default function CandidateEditForm({
  electionId,
  candidate,
  isAdmin = false,
}: {
  electionId: string;
  candidate: CandidateJSON;
  isAdmin?: boolean;
}) {
  return (
    <Stack direction={"column"}>
      <Stack
        component={"form"}
        spacing={2}
        action={editCandidateAction}
        direction={"column"}
      >
        <input type="hidden" name="electionId" value={electionId} />
        <input type="hidden" name="candidateId" value={candidate.id} />
        <TextField
          label="一言"
          name="description"
          multiline
          rows={4}
          fullWidth
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            保存
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={`/elections/${electionId}`}
          >
            キャンセル
          </Button>
        </Stack>
      </Stack>
      {isAdmin && (
        <>
          <Divider sx={{ my: 4 }} />
          <Stack
            component={"form"}
            direction={"column"}
            spacing={2}
            action={makeIneligible}
          >
            <Typography variant="h6" gutterBottom>
              失格処分
            </Typography>
            <input type="hidden" name="electionId" value={electionId} />
            <input type="hidden" name="candidateId" value={candidate.id} />
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              失格処分にすると、その候補者は選挙から除外されます。
            </Typography>
            <Button type="submit" variant="contained" color="error">
              {candidate.isIneligible ? "失格処分を解除" : "失格処分にする"}
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}

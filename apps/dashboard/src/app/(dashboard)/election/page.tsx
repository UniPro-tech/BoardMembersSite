import { Election } from "@board/shared/classes";
import { Stack, Typography } from "@mui/material";
import ElectionCard from "@/components/ElectionCard";

export const dynamic = "force-dynamic";

export default async function ElectionPage() {
  const elections = await Election.findAll();
  return (
    <Stack spacing={2} p={2}>
      <Typography variant="h4" component="h1" className="font-bold">
        選挙
      </Typography>
      <Stack spacing={2} maxWidth={"800px"}>
        {elections
          .sort(
            (a, b) =>
              b.createdAt.getUTCMilliseconds() -
              a.createdAt.getUTCMilliseconds(),
          )
          .map((e) => (
            <ElectionCard key={e.id} election={e} isSimple />
          ))}
      </Stack>
    </Stack>
  );
}

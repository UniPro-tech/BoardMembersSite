import { Stack, Typography } from "@mui/material";
import { Election } from "@/classes/Election";
import ElectionCard from "@/components/ElectionCard";

export default async function ElectionsPage() {
  const elections = await Election.findAll();
  return (
    <Stack spacing={2} p={2}>
      <Typography variant="h4" component="h1" className="font-bold">
        選挙一覧
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

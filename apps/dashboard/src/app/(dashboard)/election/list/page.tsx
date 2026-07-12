import { Election } from "@board/shared/classes";
import { Stack } from "@mui/material";
import { ElectionCard } from "@/components/item/election-card";

export const dynamic = "force-dynamic";

export default async function ElectionPage() {
  const elections = await Election.findAll();
  return (
    <main className="flex flex-col items-center justify-center p-6">
      <h3 className="w-full">選挙一覧</h3>
      <Stack spacing={2} maxWidth={"800px"}>
        {elections
          .sort(
            (a, b) =>
              b.createdAt.getUTCMilliseconds() -
              a.createdAt.getUTCMilliseconds(),
          )
          .map((e) => (
            <ElectionCard election={e} key={e.id} />
          ))}
      </Stack>
    </main>
  );
}

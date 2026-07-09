import { Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { Election } from "@/classes/Election";
import ElectionEditForm from "@/components/Forms/ElectionEditForm";
import { auth } from "@/libs/auth";

export const dynamic = "force-dynamic";

export default async function ElectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) {
    unauthorized();
  }
  if (user.role !== "admin") {
    forbidden();
  }
  const { id } = await params;
  const election = await Election.findById(id);
  if (!election) {
    notFound();
  }
  return (
    <Stack p={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        {election.title} を編集する
      </Typography>
      <ElectionEditForm election={election} />
    </Stack>
  );
}

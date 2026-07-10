import { Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import ElectionCreateForm from "@/components/Forms/ElectionCreateForm";
import { auth } from "@/libs/auth";

export const dynamic = "force-dynamic";

export default async function VotePage() {
  const sesssion = await auth.api.getSession({ headers: await headers() });
  if (!sesssion) {
    unauthorized();
  }
  if (sesssion.user.role !== "admin") {
    forbidden();
  }
  return (
    <Stack>
      <Typography variant="h4" component="h1" className="font-bold">
        選挙作成
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        新しい選挙を作成します。作成後、候補者を追加できます。
      </Typography>
      <ElectionCreateForm />
    </Stack>
  );
}

import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import { ElectionCreateForm } from "@/components/forms/election-create-form";
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
    <main className="flex items-center justify-center p-6">
      <ElectionCreateForm />
    </main>
  );
}

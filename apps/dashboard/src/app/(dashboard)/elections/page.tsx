import { Election } from "@board/shared/classes";
import CreateElectionButton from "@/components/buttons/create-election";
import { ElectionList } from "@/components/lists/election-list";

export const dynamic = "force-dynamic";

export default async function ElectionPage() {
  const elections = await Election.findAll();
  return (
    <main className="flex flex-col items-left justify-center p-6">
      <div className="flex flex-row max-w-6xl w-full">
        <div className="grow">
          <h3 className="w-full">選挙一覧</h3>
          <p className="mt-8">実施中もしくは既に終了した選挙の一覧です。</p>
        </div>
        <CreateElectionButton />
      </div>
      <ElectionList defaultElections={elections.map((e) => e.toJson())} />
    </main>
  );
}

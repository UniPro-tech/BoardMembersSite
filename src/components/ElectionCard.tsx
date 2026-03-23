import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Election } from "@/classes/Election";
import { auth } from "@/libs/auth";
import { formatToLocaleStringJST } from "@/libs/date";

export default async function ElectionCard({
  election,
  isSimple,
}: {
  election: Election;
  isSimple?: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    unauthorized();
  }
  const isAdmin = session.user.role === "admin";

  const tags = [];
  if (election.isActive) {
    tags.push(
      <Chip key="active" label="期間中" color="success" size="small" />,
    );
  }
  if (election.canStand) {
    tags.push(
      <Chip
        key="can-stand"
        label="立候補受付中"
        color="primary"
        size="small"
      />,
    );
  }
  if (!election.canStand && election.isActive) {
    tags.push(
      <Chip key="can-stand" label="投票受付中" color="warning" size="small" />,
    );
  }
  if (!election.isActive && new Date() < election.startAt) {
    tags.push(<Chip key="upcoming" label="未開始" color="info" size="small" />);
  }
  if (!election.isActive && new Date() > election.endAt) {
    tags.push(<Chip key="ended" label="終了" color="default" size="small" />);
  }
  if (election.isRunoff) {
    tags.push(
      <Chip key="runoff" label="決選投票" color="secondary" size="small" />,
    );
  }
  const parentElection = election.isRunoff
    ? await election.getParentElection()
    : null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" className="markdown">
          {election.title}
        </Typography>
        <Stack direction="row" spacing={2} className="my-2">
          {tags}
        </Stack>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          className="mb-2"
        >
          <Typography variant="body2" color="textSecondary">
            開始日時: {formatToLocaleStringJST(election.startAt)}
          </Typography>
          {election.standDeadline && (
            <Typography variant="body2" color="textSecondary">
              立候補締切: {formatToLocaleStringJST(election.standDeadline)}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary">
            終了日時: {formatToLocaleStringJST(election.endAt)}
          </Typography>
          {election.capacity && (
            <Typography variant="body2" color="textSecondary">
              定員: {election.capacity}人
            </Typography>
          )}
        </Stack>
        {parentElection && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              flexDirection: "column",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            この選挙は「{parentElection.title}」の決選投票です。
            <Button
              size="small"
              color="primary"
              href={`/elections/${parentElection.id}`}
              variant="text"
            >
              親選挙を見る
            </Button>
          </Alert>
        )}
        <Typography variant="body1">
          {election.description ? (
            isSimple ? (
              election.description.length > 60 ? (
                `${election.description.substring(0, 60)}...`
              ) : (
                election.description
              )
            ) : (
              <div className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {election.description}
                </ReactMarkdown>
              </div>
            )
          ) : (
            "説明なし"
          )}
        </Typography>
      </CardContent>
      <CardActions>
        {isAdmin && (
          <Button
            size="small"
            color="primary"
            href={`/elections/${election.id}/edit`}
            variant="outlined"
          >
            編集
          </Button>
        )}
        {isSimple && (
          <Button
            size="small"
            color="primary"
            href={`/elections/${election.id}`}
            variant="outlined"
          >
            詳細を見る
          </Button>
        )}
        {election.canStand && (
          <Button
            size="small"
            color="secondary"
            href={`/elections/${election.id}/stand`}
            variant="outlined"
          >
            立候補する
          </Button>
        )}
        {!election.canStand && election.isActive && (
          <Button
            size="small"
            color="secondary"
            href={`/elections/${election.id}#candidate-list`}
            variant="outlined"
          >
            投票する
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

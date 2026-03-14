import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { headers } from "next/headers";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { Candidate } from "@/classes/Candidate";
import { Election } from "@/classes/Election";
import CandidateEditForm from "@/components/Forms/CandidateEditForm";
import { auth } from "@/libs/auth";
import { formatToLocaleStringJST } from "@/libs/date";

export const dynamic = "force-dynamic";

export default async function ElectionEditPage({
  params,
}: {
  params: Promise<{ id: string; cid: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) {
    unauthorized();
  }
  const { id, cid } = await params;
  const election = await Election.findById(id);
  if (!election) {
    notFound();
  }
  if (!election.canStand && user.role !== "admin") {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            py: 4,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              p: 4,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: "error.main",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              立候補受付期間外です。
            </Typography>

            <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
              立候補の受付期間は
              {formatToLocaleStringJST(election.startAt)} から{" "}
              {formatToLocaleStringJST(election.standDeadline)} までです。
            </Typography>

            <Alert severity="info" sx={{ my: 3, textAlign: "left" }}>
              <Typography variant="caption">
                <strong>これが間違いと思われる場合：</strong>
              </Typography>
              <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                役員会にお問い合わせください。
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                fullWidth
                startIcon={<HomeIcon />}
              >
                ダッシュボードに戻る
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    );
  }
  const candidate = await Candidate.findById(cid);
  if (!candidate || candidate.electionId !== election.id) {
    notFound();
  }
  if (candidate.userId !== user.id) {
    forbidden();
  }
  return (
    <Stack p={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        立候補情報を編集する
      </Typography>
      <CandidateEditForm
        electionId={election.id}
        candidate={candidate.toJSON()}
        isAdmin={user.role === "admin"}
      />
    </Stack>
  );
}

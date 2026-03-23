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

export default function ErrorPage({ error }: { error: Error }) {
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
            エラーが発生しました。
          </Typography>
          {process.env.NODE_ENV === "development" && (
            <Alert severity="error" sx={{ my: 3, textAlign: "left" }}>
              <Typography variant="body2" color="textSecondary">
                {error.message}
              </Typography>
            </Alert>
          )}
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

export function GenerateErrorPage({ error }: { error: Error }) {
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
            エラーが発生しました。
          </Typography>
          <Alert severity="error" sx={{ my: 3, textAlign: "left" }}>
            <Typography variant="body2" color="textSecondary">
              {error.message}
            </Typography>
          </Alert>
        </Card>
      </Box>
    </Container>
  );
}

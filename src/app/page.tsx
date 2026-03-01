import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Stack component={"main"}>
      <Typography variant="h4" component="h1" className="font-bold">
        ダッシュボード
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        ようこそ、選挙管理システムへ！サイドバーから操作を選択してください。
      </Typography>
    </Stack>
  );
}

"use client";
import { Breadcrumbs, Link as MUILink, Typography } from "@mui/material";
import Link from "next/link";

export default function CustomBreadcrumbs() {
  const crumbs = [
    { href: "/", label: "ダッシュボード" },
    { href: "/elections", label: "選挙一覧" },
  ];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {crumbs.map((c, i) =>
        i < crumbs.length - 1 ? (
          <MUILink
            key={c.href}
            component={Link}
            href={c.href}
            underline="hover"
            color="inherit"
          >
            {c.label}
          </MUILink>
        ) : (
          <Typography key={c.href} sx={{ color: "text.primary" }}>
            {c.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}

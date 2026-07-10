"use client";

import { usePathname } from "next/navigation";

const PAGE_MAP = {
  ".": "ホーム",
  elections: {
    ".": "選挙一覧",
  },
} as const;

export type PageNode = string | { readonly [key: string]: PageNode };

type Breadcrumb = {
  path: string;
  label: string;
};

export const useBreadcrumbArray = (): Breadcrumb[] => {
  const pathname = usePathname();

  const data: Breadcrumb[] = [];

  const pathArray = pathname.split("/").filter((path) => path !== "");

  let current: PageNode = PAGE_MAP;
  let currentPath = "";

  // ホーム
  if (typeof current === "object" && "." in current) {
    data.push({
      path: "/",
      label: current["."] as string,
    });
  }

  for (const path of pathArray) {
    if (typeof current !== "object") {
      break;
    }

    const next: PageNode = current[path];

    if (!next) {
      break;
    }

    current = next;
    currentPath += `/${path}`;

    if (typeof current === "string") {
      data.push({
        path: currentPath,
        label: current,
      });
    } else if ("." in current && typeof current["."] === "string") {
      data.push({
        path: currentPath,
        label: current["."] as string,
      });
    }
  }

  return data;
};

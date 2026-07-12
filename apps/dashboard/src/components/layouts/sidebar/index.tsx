"use client";

import { LifeBuoyIcon, ScaleIcon, SendIcon, VoteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/libs/auth-client";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "議事録",
      url: "/council",
      icon: <ScaleIcon />,
      isActive: true,
      items: [
        {
          title: "最近の議事録",
          url: "/council/recent",
        },
        {
          title: "議事録一覧",
          url: "/council/minutes",
        },
        {
          title: "パブリックコメント",
          url: "/council/public_comment",
        },
      ],
    },
    {
      title: "選挙",
      url: "/election",
      icon: <VoteIcon />,
      items: [
        {
          title: "選挙一覧",
          url: "/election/list",
        },
        {
          title: "立候補可能な選挙",
          url: "/election/can_stand",
        },
        {
          title: "投票可能な選挙",
          url: "/election/can_vote",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: session,
    isPending: sessionIsPending,
    isRefetching: sessionIsRefetching,
  } = authClient.useSession();
  if (!session && !sessionIsPending && !sessionIsRefetching)
    redirect("/signin");
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="2xl" render={<Link href="#" />}>
              <div className="flex aspect-square size-16 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Image
                  src={"/img/unipro_logo.webp"}
                  width={120}
                  height={120}
                  alt="UniProのロゴ"
                  className="size-16"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight gap-2 mb-2">
                <span className="truncate text-xs ml-1">UniProject</span>
                <span className="truncate font-medium text-h3">役員会</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

import type React from "react";
import MiniDrawer from "@/components/Sidebar";
import CustomBreadcrumbs from "@/components/Sidebar/CustomBreadcrumbs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MiniDrawer>
      <CustomBreadcrumbs />
      {children}
    </MiniDrawer>
  );
}

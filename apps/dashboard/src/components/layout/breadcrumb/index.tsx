"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbArray } from "@/libs/path";

export default function Breadcrumb() {
  const breadcrumbItemData = useBreadcrumbArray();
  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {breadcrumbItemData.map((data, index) => (
          <>
            <BreadcrumbItem className="hidden md:block" key={data.path}>
              {index + 1 < breadcrumbItemData.length ? (
                <BreadcrumbLink href={data.path}>{data.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{data.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index + 1 < breadcrumbItemData.length && (
              <BreadcrumbSeparator
                className="hidden md:block"
                key={data.path}
              />
            )}
          </>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

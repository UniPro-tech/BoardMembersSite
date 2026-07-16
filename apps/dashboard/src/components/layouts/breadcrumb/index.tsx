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
            <BreadcrumbItem
              className="hidden md:block"
              key={`${data.path}-bc_item`}
            >
              {index + 1 < breadcrumbItemData.length ? (
                <BreadcrumbLink href={data.path} key={`${data.path}-bc_link`}>
                  {data.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage key={`${data.path}-bc_label`}>
                  {data.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index + 1 < breadcrumbItemData.length && (
              <BreadcrumbSeparator
                className="hidden md:block"
                key={`${data.path}-bc_sep`}
              />
            )}
          </>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

type Crumb = { label: string; href?: string };

function crumbsFor(pathname: string): Crumb[] {
  const [section, id] = pathname.split("/").filter(Boolean);
  const item = NAV_ITEMS.find((nav) => nav.href === `/${section}`);
  if (!item) return [];
  if (!id) return [{ label: item.title }];
  return [{ label: item.title, href: item.href }, { label: "Details" }];
}

function PageBreadcrumb() {
  const crumbs = crumbsFor(usePathname());
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Topbar() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      {/* usePathname needs a Suspense boundary under cacheComponents. */}
      <Suspense fallback={<Skeleton className="h-4 w-24" />}>
        <PageBreadcrumb />
      </Suspense>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}

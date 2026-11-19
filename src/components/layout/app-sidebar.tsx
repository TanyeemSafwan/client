"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { NAV_ITEMS, isActive } from "./nav-items";
import { UserMenu } from "./user-menu";

function NavLinks() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {NAV_ITEMS.map(({ title, href, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton asChild isActive={isActive(pathname, href)} tooltip={title}>
            <Link href={href} onClick={() => isMobile && setOpenMobile(false)}>
              <Icon />
              <span>{title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function NavLinksSkeleton() {
  return (
    <SidebarMenu>
      {NAV_ITEMS.map(({ href }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" aria-label="Doctor Tracker home">
                <Logo className="[&>span]:shrink-0" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* usePathname needs a Suspense boundary under cacheComponents. */}
            <Suspense fallback={<NavLinksSkeleton />}>
              <NavLinks />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

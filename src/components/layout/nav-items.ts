import { LayoutDashboard, Stethoscope, UsersRound, type LucideIcon } from "lucide-react";

export type NavItem = { title: string; href: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Doctors", href: "/doctors", icon: Stethoscope },
  { title: "Patients", href: "/patients", icon: UsersRound },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

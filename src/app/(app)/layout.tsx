import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/** Shell for every signed-in page. proxy.ts has already checked the session. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      {/* Keyboard users can jump past the navigation. */}
      <a
        href="#main-content"
        className="bg-background focus:ring-ring sr-only z-50 rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2"
      >
        Skip to content
      </a>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 outline-none md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

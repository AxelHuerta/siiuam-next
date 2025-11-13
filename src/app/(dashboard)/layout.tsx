import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <div className="bg-neutral-100 rounded-2xl p-2">
          <SidebarTrigger />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

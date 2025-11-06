import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Inbox } from "lucide-react";

const items = [
  {
    title: "Información General",
    url: "/",
    icon: Home,
  },
  {
    title: "Kardex",
    url: "/kardex",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-bold p-4">SIIUAM-Next</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

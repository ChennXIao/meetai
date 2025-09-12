import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/agents/ui/component/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
interface Props {
    children: React.ReactNode;
} 


const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      {/* The main content area where children components will be rendered */}
      <main className="flex flex-col h-screen">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;

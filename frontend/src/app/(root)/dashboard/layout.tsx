import { DashboardHeader } from "@/widgets/dashboard-navigaion/dashboard-header";
import { DashboardMobileNavigation } from "@/widgets/dashboard-navigaion/dashboard-mobile-navigation";
import { DashboardSidebar } from "@/widgets/dashboard-navigaion/dashboard-sidebar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <DashboardMobileNavigation />
    </div>
  );
}

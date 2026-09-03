"use client";

import { DashboardGreeting } from "@/features/dashboard/components/dahsboard-greeting";
import { StorageUsage } from "@/features/dashboard/components/storage-usage";

export function DashboardPage() {
  return (
    <section>
      <div className="container">
        <DashboardGreeting />
        <StorageUsage />
      </div>
    </section>
  );
}

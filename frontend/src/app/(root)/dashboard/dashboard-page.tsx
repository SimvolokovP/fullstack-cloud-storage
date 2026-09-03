"use client";

import { DashboardGreeting } from "@/features/dashboard/components/dahsboard-greeting";
import { StorageUsage } from "@/features/dashboard/components/storage-usage";
import { FileManager } from "@/features/files/components/file-manager/file-manager";

export function DashboardPage() {
  return (
    <section>
      <div className="container">
        <DashboardGreeting />
        <StorageUsage />
        <FileManager />
      </div>
    </section>
  );
}

import { Metadata } from "next";
import { DashboardPage } from "./dashboard-page";

export const metadata: Metadata = {
  title: "Панель управления",
};

export default function Page() {
  return <DashboardPage />;
}

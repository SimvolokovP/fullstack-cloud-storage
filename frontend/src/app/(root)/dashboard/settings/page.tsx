import { Metadata } from "next";
import { SettingsPage } from "./settings-page";

export const metadata: Metadata = {
  title: "Настройки",
};

export default function Page() {
  return <SettingsPage />;
}

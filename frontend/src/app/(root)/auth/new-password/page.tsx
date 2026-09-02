import { Metadata } from "next";
import { ROBOTS_POLICIES } from "@/shared/constants/seo.constants";
import { NewPasswordPage } from "./new-password-page";

export const metadata: Metadata = {
  title: "Новый пароль",
  robots: ROBOTS_POLICIES.NO_INDEX,
};

export default function Home() {
  return <NewPasswordPage />;
}

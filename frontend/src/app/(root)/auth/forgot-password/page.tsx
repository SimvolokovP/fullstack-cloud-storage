import { Metadata } from "next";
import { ROBOTS_POLICIES } from "@/shared/constants/seo.constants";
import { ForgotPasswordPage } from "./forgot-password-page";

export const metadata: Metadata = {
  title: "Сброс пароля",
  robots: ROBOTS_POLICIES.NO_INDEX,
};

export default function Home() {
  return <ForgotPasswordPage />;
}

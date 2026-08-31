import { Metadata } from "next";
import { ROBOTS_POLICIES } from "@/shared/constants/seo.constants";
import { LoginPage } from "./login-page";

export const metadata: Metadata = {
  title: "Войти",
  robots: ROBOTS_POLICIES.NO_INDEX,
};

export default function Home() {
  return <LoginPage />;
}
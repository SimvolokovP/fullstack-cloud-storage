import { Metadata } from "next";
import { ROBOTS_POLICIES } from "@/shared/constants/seo.constants";
import { RegisterPage } from "./register-page";

export const metadata: Metadata = {
  title: "Регистрация",
  robots: ROBOTS_POLICIES.NO_INDEX,
};

export default function Home() {
  return <RegisterPage />;
}
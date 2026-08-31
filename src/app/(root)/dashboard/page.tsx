import { Metadata } from "next";
import { MainPage } from "../(with-header)/main-page";

export const metadata: Metadata = {
  title: "Главная",
};

export default function Page() {
  return <MainPage />;
}

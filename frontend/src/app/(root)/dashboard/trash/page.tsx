import { Metadata } from "next";
import { TrashPage } from "./trash-page";

export const metadata: Metadata = {
  title: "Корзина",
};

export default function Page() {
  return <TrashPage />;
}

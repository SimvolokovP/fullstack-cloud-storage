import { PAGES } from "@/shared/config/pages-url.config";
import { Clock3, Files, Settings, Trash2 } from "lucide-react";

export const NAVIGATION = [
  {
    title: "Мои файлы",
    href: PAGES.DASHBOARD,
    icon: Files,
  },

  {
    title: "Недавние",
    href: PAGES.DASHBOARD_RECENT,
    icon: Clock3,
  },

  {
    title: "Корзина",
    href: PAGES.DASHBOARD_TRASH,
    icon: Trash2,
  },
];

export const MOBILE_NAVIGATION = [
  {
    title: "Мои файлы",
    href: PAGES.DASHBOARD,
    icon: Files,
  },

  {
    title: "Недавние",
    href: PAGES.DASHBOARD_RECENT,
    icon: Clock3,
  },

  {
    title: "Корзина",
    href: PAGES.DASHBOARD_TRASH,
    icon: Trash2,
  },

  {
    title: "Настройки",
    href: PAGES.DASHBOARD_SETTINGS,
    icon: Settings,
  },
];

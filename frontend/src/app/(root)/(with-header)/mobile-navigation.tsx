// "use client";

// import Link from "next/link";
// import { Files, Home, Star, User } from "lucide-react";
// import { usePathname } from "next/navigation";

// import { cn } from "@/shared/lib/utils";
// import { PAGES } from "@/shared/config/pages-url.config";

// const navigation = [
//   {
//     title: "Главная",
//     href: PAGES.MAIN,
//     icon: Home,
//   },
//   {
//     title: "Файлы",
//     href: "/files",
//     icon: Files,
//   },
//   {
//     title: "Избранное",
//     href: "/favorites",
//     icon: Star,
//   },
//   {
//     title: "Профиль",
//     href: "/profile",
//     icon: User,
//   },
// ];

// export function MobileNavigation() {
//   const pathname = usePathname();

//   return (
//     <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
//       <div className="container">
//         <div className="grid h-16 grid-cols-4">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
//                   "hover:text-foreground",
//                   isActive && "text-foreground",
//                 )}
//               >
//                 <Icon className={cn("", isActive && "stroke-[2]")} />

//                 <span className="text-[10px] font-medium">{item.title}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </nav>
//   );
// }

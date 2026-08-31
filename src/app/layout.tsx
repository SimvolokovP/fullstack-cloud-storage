import type { Metadata } from "next";
import { Manrope, Unbounded, Geist } from "next/font/google";
import "./styles/globals.css";
import {
  OPEN_GRAPH_DEFAULT,
  ROBOTS_POLICIES,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_PUBLISHER,
  SITE_URL,
} from "@/shared/constants/seo.constants";
import { Providers } from "@/shared/providers/providers";
import { cn } from "@/shared/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  publisher: SITE_PUBLISHER,
  robots: ROBOTS_POLICIES.INDEX,
  openGraph: OPEN_GRAPH_DEFAULT,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn(manrope.variable, unbounded.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>{/* meta */}</head>
      <body className="font-manrope antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

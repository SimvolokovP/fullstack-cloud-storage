export const SITE_NAME = "Cloud Box";

export const SITE_NAME_SHORT = "CBOX";

export const SITE_PUBLISHER = "";

export const SITE_DESCRIPTION = "";

export const SITE_KEYWORDS: string[] = ["", ""];

export const SITE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const SEO_REGION = "RU";

export const SEO_CURRENCY = "RUB";

export const ROBOTS_POLICIES = {
  INDEX: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  NO_INDEX: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const OPEN_GRAPH_DEFAULT = {
  type: "website",
  siteName: SITE_NAME,
  locale: "ru_RU",
  images: [
    {
      url: `${SITE_URL}/images/og-default.png`,
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ],
};

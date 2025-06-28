export const SITE = {
  website: "https://tdots.pages.dev/",
  author: "tnoer",
  profile: "https://tnoer.pages.dev/",
  desc: "A generalist’s playground for tinkering with code, hardware, and chaos.",
  title: "tdots",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/toufiqnuur/tdots/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "id",
  timezone: "Asia/Jakarta", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

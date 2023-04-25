/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import NextPWA from "next-pwa";
const withPWA = NextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = withPWA({
  reactStrictMode: false,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

export default config;

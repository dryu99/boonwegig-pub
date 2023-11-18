const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({
        enabled: true,
        openAnalyzer: false,
      })
    : (config) => config;

const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));

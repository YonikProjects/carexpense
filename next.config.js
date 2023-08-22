/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// async rewrites() {
//   return [
//     {
//       source: "/api/:path*",
//       destination: "http://localhost:5789/api/:path*", // Proxy to Backend
//     },
//   ];
// },
// };

// module.exports = nextConfig;

// if (process.env.NODE_ENV === "production") {
//   const withPWA = require("next-pwa");
//   module.exports = withPWA({
//     pwa: {
//       dest: "public",
//     },
//   });
// }

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});
module.exports = nextConfig;

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

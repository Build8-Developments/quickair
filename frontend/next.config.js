/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.co"],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;

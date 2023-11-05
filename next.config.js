/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["szevents-bucket.s3.eu-west-3.amazonaws.com", "liel2c.deta.dev"],
  },
};

module.exports = nextConfig;

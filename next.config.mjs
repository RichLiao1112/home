/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALLOW_UPLOAD_IMAGE: process.env.ALLOW_UPLOAD_IMAGE,
  },
};

export default nextConfig;

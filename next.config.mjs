/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  transpilePackages: ["next-themes"],
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

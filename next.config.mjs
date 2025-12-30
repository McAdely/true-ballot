/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow Supabase images
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Allow Clerk avatar images
      },
    ],
  },
};

module.exports = nextConfig;
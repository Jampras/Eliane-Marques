/** @type {import('next').NextConfig} */
const supabaseHost = process.env.SUPABASE_URL
  ? (() => {
      try {
        return new URL(process.env.SUPABASE_URL).hostname;
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(supabaseHost
        ? [
            {
              protocol: 'https',
              hostname: supabaseHost,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;

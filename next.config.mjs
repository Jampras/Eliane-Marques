/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const supabaseHost = process.env.SUPABASE_URL
  ? (() => {
      try {
        return new URL(process.env.SUPABASE_URL).hostname;
      } catch {
        return null;
      }
    })()
  : null;

const imageSrcHosts = ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'];
if (supabaseHost) {
  imageSrcHosts.push(`https://${supabaseHost}`);
}

const connectSrc = isProduction
  ? "connect-src 'self' https://vitals.vercel-insights.com"
  : "connect-src 'self' ws: http: https:";

const upgradeInsecureRequests = isProduction ? ['upgrade-insecure-requests'] : [];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src ${imageSrcHosts.join(' ')}`,
  connectSrc,
  "frame-src 'none'",
  ...upgradeInsecureRequests,
].join('; ');

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
        ],
      },
    ];
  },
};

export default nextConfig;

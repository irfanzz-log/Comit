/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Wajib di production: paksa HTTPS untuk kunjungan berikutnya
            // dan subdomain. Tanpa ini cookie sesi bisa ter-capture lewat
            // downgrade HTTP pertama (SSL stripping).
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

        ],
      },
    ];
  },
};

export default nextConfig;

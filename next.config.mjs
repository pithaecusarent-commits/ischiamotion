const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.supabase.co",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "frame-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/it",
        permanent: true,
      },
      {
        source: "/it/results",
        destination: "/it/risultati",
        permanent: true,
      },
      {
        source: "/en/risultati",
        destination: "/en/results",
        permanent: true,
      },
      {
        source: "/it/barca-con-skipper-ischia",
        destination: "/it/noleggio-barche-ischia",
        statusCode: 301,
      },
      {
        source: "/it/noleggio-barca-con-skipper-ischia",
        destination: "/it/noleggio-barche-ischia",
        statusCode: 301,
      },
      {
        source: "/en/boat-with-skipper-ischia",
        destination: "/en/boat-rental-ischia",
        statusCode: 301,
      },
      {
        source: "/en/boat-rental-with-skipper-ischia",
        destination: "/en/boat-rental-ischia",
        statusCode: 301,
      },
      {
        source: "/en/ischia-scooter-rental",
        destination: "/en/scooter-rental-ischia",
        permanent: true,
      },
      {
        source: "/en/ischia-car-rental",
        destination: "/en/car-rental-ischia",
        permanent: true,
      },
      {
        source: "/en/ischia-boat-rental",
        destination: "/en/boat-rental-ischia",
        permanent: true,
      },
      // Trailing-slash variants of renamed URLs → direct to final destination (prevents 2-hop chain)
      {
        source: "/en/ischia-scooter-rental/",
        destination: "/en/scooter-rental-ischia",
        permanent: true,
      },
      {
        source: "/en/ischia-car-rental/",
        destination: "/en/car-rental-ischia",
        permanent: true,
      },
      {
        source: "/en/ischia-boat-rental/",
        destination: "/en/boat-rental-ischia",
        permanent: true,
      },
      {
        source: "/it/barca-con-skipper-ischia/",
        destination: "/it/noleggio-barche-ischia",
        statusCode: 301,
      },
      {
        source: "/it/noleggio-barca-con-skipper-ischia/",
        destination: "/it/noleggio-barche-ischia",
        statusCode: 301,
      },
      {
        source: "/en/boat-with-skipper-ischia/",
        destination: "/en/boat-rental-ischia",
        statusCode: 301,
      },
      {
        source: "/en/boat-rental-with-skipper-ischia/",
        destination: "/en/boat-rental-ischia",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
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
        destination: "/it/beach-club-ischia",
        permanent: true,
      },
      {
        source: "/it/noleggio-barca-con-skipper-ischia",
        destination: "/it/beach-club-ischia",
        permanent: true,
      },
      {
        source: "/en/boat-with-skipper-ischia",
        destination: "/en/ischia-beach-club",
        permanent: true,
      },
      {
        source: "/en/boat-rental-with-skipper-ischia",
        destination: "/en/ischia-beach-club",
        permanent: true,
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
        destination: "/it/beach-club-ischia",
        permanent: true,
      },
      {
        source: "/it/noleggio-barca-con-skipper-ischia/",
        destination: "/it/beach-club-ischia",
        permanent: true,
      },
      {
        source: "/en/boat-with-skipper-ischia/",
        destination: "/en/ischia-beach-club",
        permanent: true,
      },
      {
        source: "/en/boat-rental-with-skipper-ischia/",
        destination: "/en/ischia-beach-club",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

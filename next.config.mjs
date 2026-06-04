/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/it",
        permanent: false,
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
    ];
  },
};

export default nextConfig;

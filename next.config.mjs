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
    ];
  },
};

export default nextConfig;

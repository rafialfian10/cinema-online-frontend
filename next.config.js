/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    // remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 's3.amazonaws.com',
    //       port: '',
    //       pathname: '/my-bucket/**',
    //     },
    //   ],
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;

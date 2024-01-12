/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Menambahkan domain yang diizinkan di sini
    domains: ['localhost'],
    // remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 's3.amazonaws.com',
    //       port: '',
    //       pathname: '/my-bucket/**',
    //     },
    //   ],
  },
};

module.exports = nextConfig;

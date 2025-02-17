/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xura.tsj.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

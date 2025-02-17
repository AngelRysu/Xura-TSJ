/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xura.tecmm.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

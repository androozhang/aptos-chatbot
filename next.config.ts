import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mmsn7692iu.ufs.sh',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
}

export default nextConfig;

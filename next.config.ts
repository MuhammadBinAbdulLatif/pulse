import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'ucarecdn.com',  
                port: '',
                pathname: '/**'
            },

        ]
    }
};

export default nextConfig;

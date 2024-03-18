/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_SERVER_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ]
    }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'media.avarchives.icrc.org',
            }
        ]
    }
}

module.exports = nextConfig

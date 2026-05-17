/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'cdn.myanimelist.net', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
}

export default nextConfig
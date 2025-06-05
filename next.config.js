/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tshirt-customizer',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: '/tshirt-customizer/',
}

module.exports = nextConfig 
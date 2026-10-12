/** @type {import('next').NextConfig} */
const config = {
  devIndicators: false,
  allowedDevOrigins: ['terminal.local'],
  images: { unoptimized: true },
  output: 'export',
  trailingSlash: true,
};

export default config;

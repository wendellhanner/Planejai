/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar erros de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignorar erros de tipo durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações de otimização
  
  // Otimizar carregamento de páginas
  reactStrictMode: true,
  
  // Configurações de imagens
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com', 'ext.same-assets.com', 'ugc.same-assets.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
      },
      {
        protocol: 'https',
        hostname: 'ugc.same-assets.com',
      },
    ],
  },
  
  // Configuração do webpack para substituir o Prisma Client pelo mock durante o build
  webpack: (config, { isServer }) => {
    if (process.env.NETLIFY === 'true') {
      config.resolve.alias['@prisma/client'] = require.resolve('./prisma-mock.js');
    }
    return config;
  },
};

module.exports = nextConfig;

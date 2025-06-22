/** @type {import('next').NextConfig} */
const nextConfig = {
  // Melhorar o desempenho da compilação
  swcMinify: true,
  
  // Otimizar carregamento de páginas
  reactStrictMode: true,
  
  // Configuração para imagens
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  
  // Configuração para remover o ícone N flutuante
  devIndicators: false,
  
  // Otimizar o carregamento de módulos
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;

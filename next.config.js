/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration minimale pour debug
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Désactiver les optimisations complexes temporairement
  // experimental: {
  //   optimizePackageImports: ['lucide-react'],
  // },

  // Configuration basique des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers simplifiés
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://images.unsplash.com",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src 'self' blob: data:",
              "object-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ],
      }
    ]
  },

  // Configuration de base
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
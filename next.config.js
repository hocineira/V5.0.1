/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Configuration Turbo (remplace turbo deprecated)
  turbopack: {},

  // Optimisations compilation et bundling 
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration optimisée des images pour performance mobile
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimisations spécifiques mobile et WebP
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
  },

  // Compression et optimisations de bundle
  compress: true,
  
  // Optimisation du build pour performance
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config, { dev, isServer }) => {
      // Optimisations de bundle pour la production
      if (!dev && !isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
      return config;
    },
  }),

  // Headers de sécurité et performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          // Sécurité générale
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Content Security Policy robuste
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Nécessaire pour Next.js
              "style-src 'self' 'unsafe-inline'", // Pour Tailwind CSS
              "img-src 'self' data: https://images.unsplash.com",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // Permissions Policy (anciennement Feature Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()'
            ].join(', ')
          }
        ],
      },
      // Headers spécifiques pour les ressources statiques
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
    ]
  },

  // Configuration de production sécurisée
  poweredByHeader: false, // Cache le header X-Powered-By
  generateEtags: false, // Désactive les ETags pour éviter le tracking
  
  // Configuration des rewrites sécurisés
  async rewrites() {
    return []
  },

  // Environnement de développement sécurisé
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      forceSwcTransforms: true,
    }
  })
}

module.exports = nextConfig
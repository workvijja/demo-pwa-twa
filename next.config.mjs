import withPWA from 'next-pwa';
import pkgJSON from './package.json' with {type: "json"};
import nextPWACache from 'next-pwa/cache.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production"
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: pkgJSON.version,
    },
    eslint: {
        // This allows production builds to successfully complete
        // even if your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: ({ url }) => {
                const isSameOrigin = self.origin === url.origin;
                if (!isSameOrigin) return false;

                const pathname = url.pathname;

                // Skip API routes
                if (pathname.startsWith('/api/')) return false;

                // Only cache /v2 routes
                return pathname.startsWith('/v2');
            },
            handler: 'NetworkFirst',
            options: {
                cacheName: 'v2-pages',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
                },
                networkTimeoutSeconds: 10,
                plugins: [{
                    cacheWillUpdate: async ({ response }) => {
                        // Only cache successful responses
                        if (response && response.status === 200) {
                            return response;
                        }
                        return null;
                    }
                }]
            }
        },
        ...nextPWACache,
    ],
    buildExcludes: [
        /middleware-manifest\.json$/,
        /_middleware\.js$/,
        /middleware\.js$/,
        /_buildManifest\.js$/,
        /_ssgManifest\.js$/,
        /app-build-manifest\.json$/,
    ],
    fallbacks: {
        document: '/offline',
    },
})(nextConfig);

// export default nextConfig;

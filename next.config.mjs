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
  runtimeCaching: nextPWACache,
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

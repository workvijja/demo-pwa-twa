import withPWA from 'next-pwa';
import pkgJSON from './package.json' with {type: "json"};

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
  dest: "public",         // destination directory for the PWA files
  // disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
  // You can uncomment to further tune:
  // runtimeCaching: require('next-pwa/cache'),
  fallbacks: { document: '/offline' }, // if you add an offline page
})(nextConfig);

// export default nextConfig;

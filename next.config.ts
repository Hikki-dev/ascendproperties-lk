import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // This is the fix for Turbopack (the default in Next.js 16)
  // An empty object silences the warning, allowing the webpack config to be used.
  turbopack: {
    // We leave this empty on purpose.
  },
  
  // This is the same fix, but for Webpack (for production builds or if you run --webpack)
  webpack: (config, { isServer }) => {
    // This is the actual fix for the "fs" module error.
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
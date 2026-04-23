/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry\/instrumentation/ },
      { module: /node_modules\/@prisma\/instrumentation/ }
    ];
    return config;
  },
};
export default nextConfig;

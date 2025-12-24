import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "quickair-admin.build8.dev",
        ".build8.dev", // Allow all subdomains of build8.dev
      ],
      // Disable HMR in production to prevent SSL errors
      hmr:
        process.env.NODE_ENV === "production"
          ? false
          : {
              port: 5173,
            },
    },
    build: {
      // Optimize build for memory usage
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
      // Reduce memory usage during build
      minify: "esbuild",
      sourcemap: false,
    },
  });
};

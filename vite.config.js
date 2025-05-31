export default defineConfig({
    base: "/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "three", "three/addons/"]
                }
            }
        }
    }
  });
  
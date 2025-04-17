import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/vienna/",
  build: {
    outDir: "dist", // Явно указываем папку для сборки
    emptyOutDir: true, // Очищать папку перед сборкой
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //         @use "@/assets/styles/main.scss" as *;
  //       `,
  //     },
  //   },
  // },
});

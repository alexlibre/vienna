import { defineConfig, loadEnv } from "vite";
import path from "node:path";

import tailwindcss from "@tailwindcss/vite";

import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: process.env.VITE_API_URL,
    //       secure: false,
    //     },
    //   },
    // },
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true" && repositoryName.length > 0;

export default defineConfig({
  plugins: [react()],
  base: isGithubPagesBuild ? `/${repositoryName}/` : "/",
  build: {
    target: "es2020",
    sourcemap: true,
    chunkSizeWarningLimit: 700,
  },
});

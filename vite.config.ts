import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  // Cloudflare Workers plugin only on build (produces the worker output);
  // the workerd runtime isn't available for the dev server.
  // On Vercel (VERCEL=1) build with Nitro instead, so both hosts work.
  const isVercel = process.env.VERCEL === "1";
  if (isVercel) {
    // Vercel Marketplace supplies server names; Vite embeds only VITE_*.
    // Override the Lovable .env defaults without exposing any private keys.
    for (const name of ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]) {
      const value = process.env[name];
      if (!value) throw new Error(`Missing Vercel integration variable: ${name}`);
      process.env[`VITE_${name}`] = value;
    }
  }
  const useCloudflare = command === "build" && !isVercel;
  const useNitro = command === "build" && isVercel;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      tailwindcss(),
      mockupPreviewPlugin({ designSystemPolling: true }),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      tanstackStart(),
      ...(useNitro ? [nitro()] : []),
      viteReact(),
      ...(mode === "development" ? [componentTagger()] : []),
    ],
  };
});

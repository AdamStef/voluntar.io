/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // define: {
    //   __APP_ENV__: JSON.stringify(env.PORT),
    // },
    plugins: [react()],
    server: {
      port: parseInt(env.PORT),
      host: true,
      watch: {
        usePolling: true,
      }
    },
    build: {
      watch: {
      }
    }
  }
})
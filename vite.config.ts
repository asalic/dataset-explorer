import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return{
  server: {
    allowedHosts:
      env.VITE_ALLOWED_HOSTS?.split(',') ?? ['localhost'],
    watch: {
      ignored: ['**/dist/**', '**/build/**', '**/.turbo/**'],
    },
  },
  base: process.env.PUBLIC_URL,
  plugins: [react()],
};})

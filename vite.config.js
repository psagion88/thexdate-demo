import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_BASE if provided, otherwise default to '/'
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  plugins: [react()],
  base,
})

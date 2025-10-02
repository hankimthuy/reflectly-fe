import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

const copyToBackendPlugin = () => {
  return {
    name: 'copy-to-backend',
    writeBundle() {
      const backendStaticPath = 'E:\\01_Working\\IT_Project\\reflectly-be\\src\\main\\resources\\static'
      const distPath = resolve(__dirname, 'dist') // Vite default output directory
      
      if (fs.existsSync(backendStaticPath)) {
        fs.rmSync(backendStaticPath, { recursive: true, force: true })
        fs.cpSync(distPath, backendStaticPath, { recursive: true })
        console.log('✅ Successfully copied dist folder to backend static directory!')
      } else {
        console.warn('⚠️  Backend static directory not found:', backendStaticPath)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyToBackendPlugin()],
  server: {
    port: 5173, // Vite default port
    host: true, // Allow external connections
    cors: true, // Enable CORS for development
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: () => 'app',
        // Tên file đơn giản
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/app.js',
        assetFileNames: 'assets/[name].[ext]'
      },
    },
  },
  define: {
    // Define environment variables for build
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})

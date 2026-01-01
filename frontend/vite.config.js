import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    }
  }
})

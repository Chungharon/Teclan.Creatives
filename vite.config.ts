import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom plugin to copy manifest.json to dist/
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    closeBundle() {
      const manifestPath = resolve(__dirname, 'manifest.json');
      const distPath = resolve(__dirname, 'dist', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        fs.copyFileSync(manifestPath, distPath);
        console.log('✅ Copied manifest.json to dist/');
      } else {
        console.warn('⚠️ manifest.json not found in root!');
      }
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    copyManifest()
  ],
  define: {
    // Prevent "process is not defined" error in browser
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'content-script.tsx'),
      },
      output: {
        entryFileNames: 'content.js',
        assetFileNames: (assetInfo) => {
          // Force CSS to be named content.css to match manifest
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'content.css';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
});
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './index.html'),
        content: path.resolve(__dirname, 'src/content.ts'),
        background: path.resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: ({ name }) => {
          if(['content', 'background'].includes(name)) {
            return `[name].js`;
          }
          return `assets/[name]-[hash].js`;
        }
      }
    }
  },
})

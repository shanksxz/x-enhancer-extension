import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            input: {
                content: path.resolve(__dirname, 'src/content.ts'),
            },
            output: {
                entryFileNames: "[name].js"
            }
        },
        emptyOutDir: false
    },
})
